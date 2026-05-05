import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Terminal as TerminalIcon, Cpu, Loader2, History, Zap, 
  Folder, Plus, Trash2, Upload, FileCode, FolderPlus,
  Monitor, X, Save, Code2, Activity, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

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

interface OpenFile {
  path: string;
  content: string;
  name: string;
  isDirty: boolean;
}

interface PyTask {
  id: string;
  command: string;
  status: 'running' | 'completed' | 'terminated' | 'failed';
  startTime: number;
}

export default function App() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sideView, setSideView] = useState<'files' | 'tasks'>('files');
  const [activeFile, setActiveFile] = useState<OpenFile | null>(null);
  const [tasks, setTasks] = useState<PyTask[]>([]);
  const [interruptBuffer] = useState(() => {
    try {
      return typeof SharedArrayBuffer !== 'undefined' 
        ? new Int32Array(new SharedArrayBuffer(4)) 
        : new Int32Array(new ArrayBuffer(4));
    } catch (e) {
      return new Int32Array(new ArrayBuffer(4));
    }
  });
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
        
        // Setup Interrupt Buffer
        if (typeof SharedArrayBuffer !== 'undefined' && interruptBuffer.buffer instanceof SharedArrayBuffer) {
          py.setInterruptBuffer(interruptBuffer);
        }
        
        // Setup Persistent FS (IDBFS)
        try {
          py.FS.mkdir('/home/pyodide');
          py.FS.mount(py.FS.filesystems.IDBFS, {}, '/home/pyodide');
          // Sync from IndexedDB to Memory
          await new Promise((resolve, reject) => {
            py.FS.syncfs(true, (err: any) => {
              if (err) reject(err); else resolve(null);
            });
          });
        } catch (e) {
          console.warn('FS Setup Warning:', e);
        }

        setPyodide(py);
        setIsLoading(false);
        addHistory('system', 'Python runtime connected with Persistent Storage.');
        addHistory('welcome', 'Files in /home/pyodide are saved across sessions.');
        
        refreshFiles(py);
      } catch (err) {
        addHistory('error', `Critical Failure: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    }
    initPyodide();
  }, []);

  // --- Terminal Utilities ---
  const addHistory = useCallback((type: TerminalLine['type'], content: string) => {
    setHistory(prev => [...prev, { type, content, id: Math.random().toString(36).substring(7) }]);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const focusInput = () => inputRef.current?.focus();

  // --- Persistence Helper ---
  const persistFS = useCallback(() => {
    if (!pyodide) return;
    pyodide.FS.syncfs(false, (err: any) => {
      if (err) console.error('FS Persist Error:', err);
    });
  }, [pyodide]);

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
    const name = prompt('Enter file name (e.g. main.py):');
    if (name && pyodide) {
      try {
        pyodide.FS.writeFile(`/home/pyodide/${name}`, '');
        refreshFiles();
        persistFS();
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
        persistFS();
        addHistory('system', `Created folder: ${name}`);
      } catch (err) {
        addHistory('error', `Failed to create folder: ${err}`);
      }
    }
  };

  const deletePath = (path: string) => {
    if (confirm(`Permanent Delete: ${path}?`) && pyodide) {
      try {
        const stat = pyodide.FS.stat(path);
        if (pyodide.FS.isDir(stat.mode)) {
          pyodide.FS.rmdir(path);
        } else {
          pyodide.FS.unlink(path);
        }
        if (activeFile?.path === path) setActiveFile(null);
        refreshFiles();
        persistFS();
        addHistory('system', `Removed: ${path}`);
      } catch (err) {
        addHistory('error', `Delete failed: ${err}`);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || !pyodide) return;

    const filesArray: File[] = Array.from(filesList);

    const uploadPromises = filesArray.map((file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result;
          if (content instanceof ArrayBuffer) {
            try {
              pyodide.FS.writeFile(`/home/pyodide/${file.name}`, new Uint8Array(content));
              resolve(file.name);
            } catch (err) {
              reject(err);
            }
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    });

    try {
      const uploaded = await Promise.all(uploadPromises);
      refreshFiles();
      persistFS();
      addHistory('system', `Successfully uploaded ${uploaded.length} file(s).`);
    } catch (err) {
      addHistory('error', `Some uploads failed: ${err}`);
    }
  };

  const openFile = (file: FileNode) => {
    if (file.isDir) return;
    if (pyodide) {
      try {
        const content = pyodide.FS.readFile(file.path, { encoding: 'utf8' });
        setActiveFile({
          path: file.path,
          name: file.name,
          content,
          isDirty: false
        });
      } catch (err) {
        addHistory('error', `Failed to read file: ${err}`);
      }
    }
  };

  const saveFile = useCallback((isAuto = false) => {
    if (activeFile && pyodide) {
      try {
        pyodide.FS.writeFile(activeFile.path, activeFile.content);
        setActiveFile(prev => prev ? { ...prev, isDirty: false } : null);
        persistFS();
        addHistory('system', `${isAuto ? 'Auto-save' : 'File saved'} to disk: ${activeFile.name}`);
      } catch (err) {
        addHistory('error', `Failed to save file: ${err}`);
      }
    }
  }, [activeFile, pyodide, persistFS, addHistory]);

  // --- Auto-save logic ---
  useEffect(() => {
    if (!activeFile?.isDirty || !pyodide) return;

    const timer = setInterval(() => {
      saveFile(true);
    }, 30000); // 30 seconds

    return () => clearInterval(timer);
  }, [activeFile?.isDirty, activeFile?.path, pyodide, saveFile]);

  const terminateTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && task.status === 'running') {
      // Trigger interrupt by writing non-zero to buffer
      interruptBuffer[0] = 2; // SIGINT
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'terminated' } : t));
      addHistory('system', `Process terminated manually.`);
      
      // Reset buffer after a short delay
      setTimeout(() => {
        interruptBuffer[0] = 0;
      }, 100);
    }
  };

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

      // Task Tracking
      const taskId = Math.random().toString(36).substring(7);
      const newTask: PyTask = {
        id: taskId,
        command,
        status: 'running',
        startTime: Date.now()
      };
      setTasks(prev => [newTask, ...prev]);

      try {
        // Reset interrupt buffer
        interruptBuffer[0] = 0;

        let output = '';
        pyodide.setStdout({ batched: (text: string) => { output += text + '\n'; } });
        pyodide.setStderr({ batched: (text: string) => { output += text + '\n'; } });

        // --- Basic Shell Aliases ---
        let finalCommand = command;
        const lowerCmd = command.trim().toLowerCase();
        
        if (lowerCmd === 'clear') {
          setHistory([{ type: 'welcome', content: 'PyBrowser Terminal OS v1.0.0 (WASM-Core)', id: 'w1' }]);
          setInput('');
          setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
          return;
        }

        if (lowerCmd === 'ls') finalCommand = 'import os; print("\\n".join(os.listdir(".")))';
        else if (lowerCmd === 'pwd') finalCommand = 'import os; print(os.getcwd())';
        else if (lowerCmd.startsWith('mkdir ')) {
          const dir = command.replace(/mkdir /i, '').trim();
          finalCommand = `import os; os.mkdir("${dir}")`;
        }

        const result = await pyodide.runPythonAsync(finalCommand);
        
        if (output) addHistory('output', output.trim());
        if (result !== undefined && result !== null) addHistory('output', String(result));
        
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));

        // Potential side effects on FS
        refreshFiles();
      } catch (err: any) {
        const isInterrupt = err.message?.includes('KeyboardInterrupt');
        const status = isInterrupt ? 'terminated' : 'failed';
        
        // --- User Friendly Error Formatting ---
        let errorMsg = String(err);
        if (err.message) {
          const lines = err.message.split('\n');
          // Try to find the last meaningful line of the traceback
          const lastLine = lines[lines.length - 2] || lines[lines.length - 1];
          if (lastLine) errorMsg = lastLine;
        }

        addHistory('error', `Process Error: ${errorMsg}`);
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
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
            onClick={() => { setShowSidebar(true); setSideView('files'); }}
            className={`p-2 rounded-lg transition-all ${showSidebar && sideView === 'files' ? 'bg-emerald-500/10 text-emerald-500' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <Folder className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setShowSidebar(true); setSideView('tasks'); }}
            className={`p-2 rounded-lg transition-all ${showSidebar && sideView === 'tasks' ? 'bg-amber-500/10 text-amber-500' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <Activity className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { if (activeFile) setActiveFile(null); }}
            className={`p-2 rounded-lg transition-all ${activeFile ? 'text-blue-500 hover:bg-blue-500/10' : 'text-neutral-800'}`}
          >
            <Code2 className="w-5 h-5" />
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
                {sideView === 'files' ? (
                  <>
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
                        <div 
                          key={file.path} 
                          onClick={() => openFile(file)}
                          className="group flex items-center justify-between hover:bg-emerald-500/5 rounded-md px-3 py-1.5 transition-colors cursor-pointer"
                        >
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
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3 h-3 text-amber-500" /> Task_Manager
                      </h3>
                      <button 
                        onClick={() => setTasks([])}
                        className="text-[10px] text-neutral-600 hover:text-neutral-400 uppercase font-mono"
                      >
                        Clear_All
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                      {tasks.length === 0 && (
                        <div className="text-[10px] text-neutral-700 italic text-center py-4">NO_ACTIVE_PROCESSES</div>
                      )}
                      {tasks.map((task) => (
                        <div key={task.id} className="p-3 bg-neutral-900/50 rounded-lg border border-emerald-900/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-neutral-500">PID: {task.id.substring(0, 4)}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                task.status === 'running' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                                task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                task.status === 'terminated' ? 'bg-neutral-500/10 text-neutral-500' :
                                'bg-rose-500/10 text-rose-500'
                              }`}>
                                {task.status}
                              </span>
                              {task.status === 'running' && (
                                <button 
                                  onClick={() => terminateTask(task.id)}
                                  className="p-1 hover:text-rose-500 text-neutral-600"
                                  title="Kill Process"
                                >
                                  <Square className="w-3 h-3 fill-current" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-neutral-400 font-mono line-clamp-2 bg-black/40 p-2 rounded border border-emerald-900/5">
                            {task.command}
                          </div>
                          <div className="text-[9px] text-neutral-600 font-mono">
                            Started: {new Date(task.startTime).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="p-3 mt-4 bg-black/40 border border-emerald-900/10 rounded-lg text-[9px] text-neutral-600 font-mono flex flex-col gap-1">
                  <div className="flex justify-between uppercase"><span>Path:</span><span className="text-emerald-900 truncate ml-2">/home/pyodide</span></div>
                  <div className="flex justify-between uppercase"><span>Type:</span><span className="text-emerald-900">MEMFS</span></div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Code Editor Pane */}
        <AnimatePresence>
          {activeFile && (
            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              className="absolute lg:relative right-0 top-0 bottom-0 lg:left-0 w-full lg:flex-1 bg-neutral-900 border-r border-emerald-900/20 flex flex-col z-40"
            >
              <div className="p-4 border-b border-emerald-900/10 flex items-center justify-between bg-neutral-950">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className={`text-xs font-mono truncate ${activeFile.isDirty ? 'text-amber-500 italic' : 'text-neutral-400'}`}>
                    {activeFile.name} {activeFile.isDirty && '*'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={saveFile}
                    className="flex items-center gap-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded uppercase transition-colors"
                  >
                    <Save className="w-3 h-3" /> Save
                  </button>
                  <button 
                    onClick={() => setActiveFile(null)}
                    className="p-1 hover:bg-neutral-800 rounded text-neutral-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-neutral-900 custom-scrollbar p-0">
                <Editor
                  value={activeFile.content}
                  onValueChange={code => setActiveFile(prev => prev ? { ...prev, content: code, isDirty: true } : null)}
                  highlight={code => Prism.highlight(code, Prism.languages.python, 'python')}
                  padding={24}
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 14,
                    minHeight: '100%',
                    backgroundColor: 'transparent'
                  }}
                  textareaClassName="outline-none"
                  className="code-editor-prism text-emerald-50/80"
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Terminal Area */}
        <div 
          className={`flex-1 overflow-y-auto space-y-1 scrollbar-hide p-6 pb-24 relative z-10 ${activeFile ? 'hidden lg:block' : ''}`}
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

        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} multiple />
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
