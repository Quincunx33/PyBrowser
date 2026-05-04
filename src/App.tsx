import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Terminal as TerminalIcon, Cpu, Loader2, History, Zap, 
  Folder, Plus, Trash2, Upload, FileCode, FolderPlus,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
  }
}

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system' | 'welcome';
  content: string;
  id: string;
}

interface FileNode {
  name: string;
  isDir: boolean;
  path: string;
  children?: FileNode[];
}

export default function App() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'welcome', content: 'PyBrowser Terminal OS v1.0.0 (WASM-Core)', id: 'w1' },
    { type: 'welcome', content: 'Python 3.11 Runtime Initializing...', id: 'w2' }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [files, setFiles] = useState<FileNode[]>([]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Pyodide Initialization ---
  useEffect(() => {
    async function initPyodide() {
      try {
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
        });
        setPyodide(py);
        setIsLoading(false);
        addHistory('system', 'Python runtime connected. System ready.');
        addHistory('welcome', 'Type "help()" or Python code to begin.');
        
        // Initial setup for /home/pyodide
        try {
          py.FS.mkdir('/home/pyodide');
        } catch (e) {
          // ignore if exists
        }
        
        refreshFiles(py);
      } catch (err) {
        addHistory('error', `Critical Failure: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    }
    initPyodide();
  }, []);

  // --- File System Utilities ---
  const refreshFiles = useCallback((pyInstance = pyodide) => {
    if (!pyInstance) return;
    try {
      const crawl = (path: string): FileNode[] => {
        const items = pyInstance.FS.readdir(path);
        return items
          .filter((item: string) => item !== '.' && item !== '..')
          .map((item: string) => {
            const fullPath = `${path}/${item}`.replace(/\/+/g, '/');
            const stat = pyInstance.FS.stat(fullPath);
            const isDir = pyInstance.FS.isDir(stat.mode);
            return {
              name: item,
              isDir,
              path: fullPath,
              children: isDir ? [] : undefined
            };
          });
      };
      setFiles(crawl('/home/pyodide'));
    } catch (err) {
      console.error('FS Refresh Error:', err);
    }
  }, [pyodide]);

  const createFile = () => {
    const name = prompt('Enter file name (e.g. script.py):');
    if (name && pyodide) {
      try {
        pyodide.FS.writeFile(`/home/pyodide/${name}`, '');
        refreshFiles();
        addHistory('system', `Created file: ${name}`);
      } catch (err) {
        addHistory('error', `Failed to create file: ${err}`);
      }
    }
  };

  const createFolder = () => {
    const name = prompt('Enter folder name:');
    if (name && pyodide) {
      try {
        pyodide.FS.mkdir(`/home/pyodide/${name}`);
        refreshFiles();
        addHistory('system', `Created folder: ${name}`);
      } catch (err) {
        addHistory('error', `Failed to create folder: ${err}`);
      }
    }
  };

  const deletePath = (path: string) => {
    if (confirm(`Delete ${path}?`) && pyodide) {
      try {
        const stat = pyodide.FS.stat(path);
        if (pyodide.FS.isDir(stat.mode)) {
          pyodide.FS.rmdir(path);
        } else {
          pyodide.FS.unlink(path);
        }
        refreshFiles();
        addHistory('system', `Deleted: ${path}`);
      } catch (err) {
        addHistory('error', `Failed to delete: ${err}`);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pyodide) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (content instanceof ArrayBuffer) {
          try {
            pyodide.FS.writeFile(`/home/pyodide/${file.name}`, new Uint8Array(content));
            refreshFiles();
            addHistory('system', `Uploaded: ${file.name}`);
          } catch (err) {
            addHistory('error', `Upload failed: ${err}`);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // --- Terminal Utilities ---
  const addHistory = useCallback((type: TerminalLine['type'], content: string) => {
    setHistory(prev => [...prev, { type, content, id: Math.random().toString(36).substring(7) }]);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const focusInput = () => inputRef.current?.focus();

  // --- Execution Engine ---
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      if (!command) {
        addHistory('input', '>>> ');
        return;
      }

      addHistory('input', `>>> ${command}`);
      setCommandHistory(prev => [command, ...prev].slice(0, 50));
      setHistoryIndex(-1);
      setInput('');

      if (command === 'clear') {
        setHistory([]);
        return;
      }

      if (!pyodide) {
        addHistory('error', 'Runtime not ready.');
        return;
      }

      try {
        let output = '';
        pyodide.setStdout({ batched: (text: string) => { output += text + '\n'; } });
        pyodide.setStderr({ batched: (text: string) => { output += text + '\n'; } });

        const result = await pyodide.runPythonAsync(command);
        
        if (output) addHistory('output', output.trim());
        if (result !== undefined && result !== null) addHistory('output', String(result));
        
        // Potential side effects on FS
        if (command.includes('os.') || command.includes('open(') || command.includes('write')) {
          refreshFiles();
        }
      } catch (err) {
        addHistory('error', String(err));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-black font-mono text-emerald-500 overflow-hidden flex flex-col selection:bg-emerald-500/30 relative"
      onClick={focusInput}
    >
      {/* OS Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/30 shrink-0 bg-neutral-950">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/30" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
          </div>
          <div className="flex items-center gap-2 text-[10px] opacity-40 uppercase tracking-[0.2em]">
            <TerminalIcon className="w-4 h-4" />
            <span>Terminal_OS_v1.0_PyWASM</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] hidden lg:flex opacity-30">
            <Zap className="w-3 h-3" />
            <span>Memory_Mapped: OK</span>
          </div>
          <div className={`flex items-center gap-2 text-xs font-bold ${isLoading ? 'text-amber-500' : 'text-emerald-500 underline underline-offset-4 decoration-2'}`}>
            {isLoading ? (
              <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> KERNEL_INIT</span>
            ) : (
              'SYSTEM_READY'
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Vertical Icon Bar - Stays fixed to the left */}
        <div className="w-12 bg-neutral-950 border-r border-emerald-900/10 flex flex-col items-center py-4 gap-4 shrink-0 z-50">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-lg transition-all ${showSidebar ? 'bg-emerald-500/10 text-emerald-500' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <Folder className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-neutral-800 cursor-not-allowed">
            <Monitor className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Overlay (Backdrop) */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sliding File Explorer */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside 
              initial={{ width: 0, x: -280 }}
              animate={{ width: 280, x: 0 }}
              exit={{ width: 0, x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute lg:relative left-12 lg:left-0 top-0 bottom-0 bg-neutral-950 border-r border-emerald-900/20 flex flex-col shrink-0 overflow-hidden z-40 shadow-2xl lg:shadow-none"
            >
              <div className="min-w-[280px] p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3 h-3 text-emerald-800" /> Virtual_Disk
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={createFile} title="New File" className="p-1 hover:text-emerald-500 transition-colors"><Plus className="w-4 h-4" /></button>
                    <button onClick={createFolder} title="New Folder" className="p-1 hover:text-emerald-500 transition-colors"><FolderPlus className="w-4 h-4" /></button>
                    <button onClick={() => fileInputRef.current?.click()} title="Upload" className="p-1 hover:text-emerald-500 transition-colors"><Upload className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                  {files.length === 0 && !isLoading && (
                    <div className="text-[10px] text-neutral-700 italic text-center py-4">FS_EMPTY</div>
                  )}
                  {files.map((file) => (
                    <div key={file.path} className="group flex items-center justify-between hover:bg-emerald-500/5 rounded-md px-3 py-1.5 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden cursor-default">
                        {file.isDir ? <Folder className="w-4 h-4 text-blue-500 shrink-0" /> : <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />}
                        <span className="text-xs text-neutral-400 truncate font-mono">{file.name}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deletePath(file.path); }} 
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3 mt-4 bg-black/40 border border-emerald-900/10 rounded-lg text-[9px] text-neutral-600 font-mono flex flex-col gap-1">
                  <div className="flex justify-between uppercase"><span>Path:</span><span className="text-emerald-900 truncate ml-2">/home/pyodide</span></div>
                  <div className="flex justify-between uppercase"><span>Type:</span><span className="text-emerald-900">MEMFS</span></div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Terminal Area */}
        <div 
          className="flex-1 overflow-y-auto space-y-1 scrollbar-hide p-6 pb-24 relative z-10"
          onClick={() => inputRef.current?.focus()}
        >
          <AnimatePresence initial={false}>
            {history.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-sm leading-relaxed break-words ${
                  line.type === 'error' ? 'text-rose-500' : 
                  line.type === 'system' ? 'text-blue-400 italic' : 
                  line.type === 'welcome' ? 'text-neutral-500' : 
                  line.type === 'input' ? 'text-emerald-400 font-bold' : 
                  'text-emerald-200/90'
                }`}
              >
                <span className="whitespace-pre-wrap">{line.content}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Active Input Line */}
          {!isLoading && (
            <div className="flex items-start gap-3 mt-4">
              <span className="text-emerald-500 font-bold text-lg select-none">{">>>"}</span>
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                className="flex-1 bg-transparent border-none outline-none text-emerald-400 font-mono text-lg p-0 m-0 caret-emerald-500"
              />
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>

        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
      </div>

      {/* Bottom Status Bar */}
      <div className="px-6 py-4 bg-neutral-950 border-t border-emerald-900/10 flex items-center justify-between text-[10px] text-neutral-600 uppercase tracking-widest shrink-0">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><History className="w-3 h-3"/> Sessions: {commandHistory.length}</span>
          <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3"/> Core: Python 3.11</span>
          <span className="hidden md:inline">Mount: JS_WORKER_01</span>
        </div>
        <div className="flex items-center gap-4 hidden sm:flex">
          <span className="text-emerald-900/50">WASM_RUNTIME_CONNECTED</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Visual FX */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
