import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Terminal as TerminalIcon, Cpu, Loader2, History, Zap, 
  Folder, Plus, Trash2, Upload, FileCode, FolderPlus,
  Monitor, X, Save, Code2, Activity, Square, BarChart3,
  Image as ImageIcon, Binary, Lock, ShieldCheck, Download,
  RefreshCw, Scissors, Type, Brain, Target, LineChart,
  Package, Search, CheckCircle2, DownloadCloud
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [sideView, setSideView] = useState<'files' | 'tasks' | 'data' | 'imaging' | 'math' | 'crypto' | 'ml' | 'packages'>('files');
  const [activeFile, setActiveFile] = useState<OpenFile | null>(null);
  const [tasks, setTasks] = useState<PyTask[]>([]);
  const [analysisResult, setAnalysisResult] = useState<{ summary: string; plot: string | null } | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [mathResult, setMathResult] = useState<{ answer: string; plot: string | null } | null>(null);
  const [isMathProcessing, setIsMathProcessing] = useState(false);
  const [mathInput, setMathInput] = useState('');
  const [cryptoResult, setCryptoResult] = useState<{ text: string; mode: 'enc' | 'dec' } | null>(null);
  const [mlResult, setMlResult] = useState<{ prediction: string; plot: string | null } | null>(null);
  const [isMlProcessing, setIsMlProcessing] = useState(false);
  const [installedPackages, setInstalledPackages] = useState<string[]>(['numpy', 'pandas', 'matplotlib', 'scipy', 'scikit-learn', 'Pillow']);
  const [installingPackage, setInstallingPackage] = useState<string | null>(null);
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

  useEffect(() => {
    if (showSidebar) {
      inputRef.current?.blur();
    }
  }, [showSidebar]);

  const focusInput = () => {
    if (!showSidebar && !activeFile) {
      inputRef.current?.focus();
    }
  };

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

  const analyzeDataFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pyodide) return;

    setIsAnalysing(true);
    addHistory('system', `Analysing ${file.name} with Pandas...`);

    try {
      // Ensure pandas and matplotlib are loaded
      await pyodide.loadPackage(['pandas', 'matplotlib']);
      
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      pyodide.FS.writeFile(`/tmp/${file.name}`, bytes);

      const pythonCode = `
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
import os

# Load data
file_path = '/tmp/${file.name}'
if file_path.endswith('.csv'):
    df = pd.read_csv(file_path)
else:
    # Basic Excel support (requires openpyxl)
    df = pd.read_excel(file_path)

# Summary
summary = df.describe().to_string()

# Plot first numeric columns
numeric_df = df.select_dtypes(include=['number'])
img_str = None

if not numeric_df.empty:
    plt.figure(figsize=(10, 6))
    # Standardize plot style for dark theme
    plt.style.use('dark_background')
    colors = ['#10b981', '#6366f1', '#f59e0b']
    
    cols_to_plot = numeric_df.columns[:3]
    numeric_df[cols_to_plot].plot(kind='box', color=dict(boxes=colors[0], whiskers=colors[1], medians=colors[2], caps='white'))
    plt.title(f'Distribution of {", ".join(cols_to_plot)}', color='#94a3b8', fontsize=10)
    plt.grid(True, alpha=0.1)
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', transparent=True, dpi=120)
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

summary, img_str
`;
      const [summary, img_str] = await pyodide.runPythonAsync(pythonCode);
      setAnalysisResult({ summary, plot: img_str ? `data:image/png;base64,${img_str}` : null });
      addHistory('system', `Analysis complete for ${file.name}`);
    } catch (err: any) {
      addHistory('error', `Analysis failed: ${err.message}`);
    } finally {
      setIsAnalysing(false);
    }
  };

  const processImageFile = async (e: React.ChangeEvent<HTMLInputElement>, action: 'bw' | 'resize' | 'edge') => {
    const file = e.target.files?.[0];
    if (!file || !pyodide) return;

    setIsProcessingImg(true);
    addHistory('system', `Processing image: ${file.name} [${action}]...`);

    try {
      await pyodide.loadPackage('Pillow');
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      pyodide.FS.writeFile(`/tmp/${file.name}`, bytes);

      const pythonCode = `
from PIL import Image, ImageFilter
import io
import base64

img = Image.open('/tmp/${file.name}')

if '${action}' == 'bw':
    img = img.convert('L')
elif '${action}' == 'resize':
    img = img.resize((img.width // 2, img.height // 2))
elif '${action}' == 'edge':
    img = img.filter(ImageFilter.FIND_EDGES)

buf = io.BytesIO()
img.save(buf, format='PNG')
buf.seek(0)
base64.b64encode(buf.read()).decode('utf-8')
`;
      const img_str = await pyodide.runPythonAsync(pythonCode);
      setProcessedImage(`data:image/png;base64,${img_str}`);
      addHistory('system', `Image processed successfully.`);
    } catch (err: any) {
      addHistory('error', `Image processing failed: ${err.message}`);
    } finally {
      setIsProcessingImg(false);
    }
  };

  const solveMath = async (expression: string, plot = false) => {
    if (!pyodide || !expression) return;
    setIsMathProcessing(true);
    try {
      await pyodide.loadPackage(['numpy', 'matplotlib']);
      const pythonCode = `
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
import math

expr = """${expression}"""
plot_request = ${plot ? 'True' : 'False'}
img_str = None
ans = "N/A"

# Create a safe namespace with common math/numpy functions
safe_dict = {
    'np': np,
    'math': math,
    'sin': np.sin, 'cos': np.cos, 'tan': np.tan,
    'log': np.log, 'log10': np.log10, 'exp': np.exp,
    'sqrt': np.sqrt, 'pi': np.pi, 'e': np.e,
    'abs': np.abs, 'pow': np.power, 'arcsin': np.arcsin,
    'arccos': np.arccos, 'arctan': np.arctan
}

try:
    ans = str(eval(expr, {"__builtins__": None}, safe_dict))
except Exception as e:
    ans = f"Error: {str(e)}"

if plot_request:
    try:
        plt.figure(figsize=(10, 6))
        plt.style.use('dark_background')
        x = np.linspace(-10, 10, 1000)
        # Attempt to plot y = f(x)
        # Handle the case where x is used in the expression
        plot_dict = safe_dict.copy()
        plot_dict['x'] = x
        y = eval(expr, {"__builtins__": None}, plot_dict)
        
        # If y is a single value, convert to array for plotting
        if isinstance(y, (int, float)):
            y = np.full_like(x, y)
            
        plt.plot(x, y, color='#06b6d4', linewidth=2)
        plt.title(f"f(x) = {expr}", color='#94a3b8', fontsize=10)
        plt.axhline(0, color='white', linewidth=0.5, alpha=0.3)
        plt.axvline(0, color='white', linewidth=0.5, alpha=0.3)
        plt.grid(True, alpha=0.1)
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', transparent=True, dpi=120)
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()
    except Exception as e:
        ans = f"Plot Error: {str(e)}"

ans, img_str
`;
      const [ans, img_str] = await pyodide.runPythonAsync(pythonCode);
      setMathResult({ answer: ans, plot: img_str ? `data:image/png;base64,${img_str}` : null });
    } catch (err: any) {
      addHistory('error', `Math Error: ${err.message}`);
    } finally {
      setIsMathProcessing(false);
    }
  };

  const runCrypto = async (text: string, key: string, mode: 'enc' | 'dec') => {
    if (!pyodide || !text || !key) return;
    try {
      const pythonCode = `
import base64

def simple_xor(data, key):
    return "".join(chr(ord(c) ^ ord(key[i % len(key)])) for i, c in enumerate(data))

text = """${text.replace(/"/g, '\\"')}"""
key = """${key.replace(/"/g, '\\"')}"""

if "${mode}" == "enc":
    xor_res = simple_xor(text, key)
    res = base64.b64encode(xor_res.encode()).decode()
else:
    try:
        decoded = base64.b64decode(text).decode()
        res = simple_xor(decoded, key)
    except:
        res = "DECRYPTION_FAILED: Invalid Token or Key"

res
`;
      const result = await pyodide.runPythonAsync(pythonCode);
      setCryptoResult({ text: result, mode });
    } catch (err: any) {
      addHistory('error', `Crypto Error: ${err.message}`);
    }
  };

  const runMiniML = async (dataStr: string) => {
    if (!pyodide || !dataStr) return;
    setIsMlProcessing(true);
    addHistory('system', 'Initializing ML Engine (Scikit-Learn)...');
    try {
      await pyodide.loadPackage(['scikit-learn', 'numpy', 'matplotlib']);
      const pythonCode = `
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import io
import base64

# Simple parser for "x,y" lines
lines = [l.strip() for l in """${dataStr}""".split('\\n') if l.strip()]
X_raw = []
y_raw = []
for line in lines:
    try:
        parts = line.split(',')
        if len(parts) >= 2:
            X_raw.append(float(parts[0]))
            y_raw.append(float(parts[1]))
    except:
        continue

if len(X_raw) < 2:
    ans = "MIN_DATA_REQUIRED: 2 Points"
    img = None
else:
    X = np.array(X_raw).reshape(-1, 1)
    y = np.array(y_raw)
    
    model = LinearRegression().fit(X, y)
    
    # Predict next value
    next_x = np.max(X) + 1
    pred = model.predict([[next_x]])[0]
    ans = f"Trend: y = {model.coef_[0]:.2f}x + {model.intercept_:.2f}\\nNext Prediction (x={next_x}): {pred:.2f}"
    
    # Plot
    plt.figure(figsize=(10, 6))
    plt.style.use('dark_background')
    plt.scatter(X, y, color='#10b981', label='Actual Data')
    plt.plot(X, model.predict(X), color='#f59e0b', linewidth=2, label='ML Linear Trend')
    plt.legend()
    plt.grid(True, alpha=0.1)
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', transparent=True, dpi=120)
    buf.seek(0)
    img = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

ans, img
`;
      const [prediction, plot] = await pyodide.runPythonAsync(pythonCode);
      setMlResult({ prediction, plot: plot ? `data:image/png;base64,${plot}` : null });
      addHistory('system', 'ML Trend Analysis complete.');
    } catch (err: any) {
      addHistory('error', `ML Error: ${err.message}`);
    } finally {
      setIsMlProcessing(false);
    }
  };

  const installPackage = async (pkgName: string) => {
    if (!pyodide || !pkgName) return;
    setInstallingPackage(pkgName);
    addHistory('system', `Installing package: ${pkgName}...`);
    try {
      // Use micropip for broader compatibility if possible, or direct loadPackage
      await pyodide.loadPackage(pkgName.toLowerCase());
      setInstalledPackages(prev => Array.from(new Set([...prev, pkgName.toLowerCase()])));
      addHistory('system', `Package ${pkgName} installed successfully.`);
    } catch (err: any) {
      addHistory('error', `Failed to install ${pkgName}: ${err.message}. Trying micropip...`);
      try {
        await pyodide.loadPackage('micropip');
        const micropip = pyodide.pyimport('micropip');
        await micropip.install(pkgName.toLowerCase());
        setInstalledPackages(prev => Array.from(new Set([...prev, pkgName.toLowerCase()])));
        addHistory('system', `Package ${pkgName} installed successfully via micropip.`);
      } catch (err2: any) {
        addHistory('error', `Installation failed: ${err2.message}`);
      }
    } finally {
      setInstallingPackage(null);
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
        <div 
          className="w-12 bg-neutral-950 border-r border-emerald-900/10 flex flex-col items-center py-4 gap-4 shrink-0 z-50"
          onClick={(e) => e.stopPropagation()}
        >
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
            onClick={() => { setShowSidebar(true); setSideView('data'); }}
            title="Data Analyst"
            className={`p-2 rounded-lg transition-all ${showSidebar && sideView === 'data' ? 'bg-indigo-500/10 text-indigo-500' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setShowSidebar(true); setSideView('imaging'); }}
            title="Image Lab"
            className={`p-2 rounded-lg transition-all ${showSidebar && sideView === 'imaging' ? 'bg-rose-500/10 text-rose-500' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setShowSidebar(true); setSideView('math'); }}
            title="Scientific Math"
            className={`p-2 rounded-lg transition-all ${showSidebar && sideView === 'math' ? 'bg-cyan-500/10 text-cyan-500' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <Binary className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setShowSidebar(true); setSideView('crypto'); }}
            title="Security Vault"
            className={`p-2 rounded-lg transition-all ${showSidebar && sideView === 'crypto' ? 'bg-amber-500/10 text-amber-500' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <Lock className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setShowSidebar(true); setSideView('ml'); }}
            title="Pocket ML"
            className={`p-2 rounded-lg transition-all ${showSidebar && sideView === 'ml' ? 'bg-emerald-500/10 text-emerald-500' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <Brain className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setShowSidebar(true); setSideView('packages'); }}
            title="Package Manager"
            className={`p-2 rounded-lg transition-all ${showSidebar && sideView === 'packages' ? 'bg-blue-500/10 text-blue-500' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <Package className="w-5 h-5" />
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

        {/* Sliding Side View */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside 
              initial={{ width: 0, x: -320 }}
              animate={{ 
                width: sideView === 'files' || sideView === 'tasks' ? 320 : 'calc(100% - 48px)',
                x: 0 
              }}
              exit={{ width: 0, x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-12 top-0 bottom-0 bg-neutral-950 border-r border-emerald-900/20 flex flex-col shrink-0 overflow-hidden z-40 shadow-2xl focus-within:ring-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${sideView === 'files' || sideView === 'tasks' ? 'w-[320px]' : 'w-full'} p-6 h-full flex flex-col`}>
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-emerald-900/10">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowSidebar(false)}
                      className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-emerald-500 transition-all flex items-center gap-1 group"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-mono hidden group-hover:inline">Close</span>
                    </button>
                    <div className="w-[1px] h-4 bg-neutral-800 mx-1" />
                    <button 
                      onClick={() => { setShowSidebar(false); setActiveFile(null); }}
                      className="text-[10px] text-neutral-500 hover:text-emerald-500 uppercase font-mono tracking-widest flex items-center gap-2"
                    >
                      Main_Console
                    </button>
                  </div>
                </div>

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
                ) : sideView === 'data' ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 className="w-3 h-3 text-indigo-500" /> Data_Analyst
                      </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                      <div 
                        className="border-2 border-dashed border-emerald-900/20 rounded-xl p-6 text-center hover:border-indigo-500/40 transition-colors cursor-pointer bg-black/20"
                        onClick={() => document.getElementById('data-upload')?.click()}
                      >
                        <Upload className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
                        <p className="text-[10px] text-neutral-500 font-mono">DRAG & DROP CSV/EXCEL</p>
                        <p className="text-[8px] text-neutral-700 mt-1 uppercase">OR CLICK TO BROWSE</p>
                        <input id="data-upload" type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={analyzeDataFile} />
                      </div>

                      {isAnalysing && (
                        <div className="flex items-center justify-center gap-3 py-6 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                          <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                          <span className="text-[10px] text-indigo-400 font-mono animate-pulse uppercase">Processing_Engine...</span>
                        </div>
                      )}

                      {analysisResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4 pb-4"
                        >
                          <div className="bg-neutral-900 rounded-lg p-4 border border-emerald-900/10">
                            <h4 className="text-[9px] font-bold text-neutral-500 uppercase mb-3 border-b border-emerald-900/5 pb-2">Statistical Summary</h4>
                            <pre className="text-[9px] text-indigo-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                              {analysisResult.summary}
                            </pre>
                          </div>

                          {analysisResult.plot && (
                            <div className="bg-neutral-900 rounded-lg p-2 border border-emerald-900/10 overflow-hidden">
                              <h4 className="text-[9px] font-bold text-neutral-500 uppercase mb-2 ml-2">Visual Insights</h4>
                              <img src={analysisResult.plot} alt="Analysis Plot" className="w-full rounded-md opacity-90 brightness-110" />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </>
                ) : sideView === 'imaging' ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                         <ImageIcon className="w-3 h-3 text-rose-500" /> Image_Processor
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => document.getElementById('img-bw')?.click()}
                          className="flex flex-col items-center justify-center p-3 bg-neutral-900 rounded-lg border border-emerald-900/10 hover:border-rose-500/30 transition-all gap-2"
                        >
                          <RefreshCw className="w-4 h-4 text-rose-500" />
                          <span className="text-[8px] uppercase font-mono">B & W</span>
                          <input id="img-bw" type="file" className="hidden" accept="image/*" onChange={(e) => processImageFile(e, 'bw')} />
                        </button>
                        <button 
                          onClick={() => document.getElementById('img-resize')?.click()}
                          className="flex flex-col items-center justify-center p-3 bg-neutral-900 rounded-lg border border-emerald-900/10 hover:border-rose-500/30 transition-all gap-2"
                        >
                          <Scissors className="w-4 h-4 text-rose-500" />
                          <span className="text-[8px] uppercase font-mono">Resize 50%</span>
                          <input id="img-resize" type="file" className="hidden" accept="image/*" onChange={(e) => processImageFile(e, 'resize')} />
                        </button>
                         <button 
                          onClick={() => document.getElementById('img-edge')?.click()}
                          className="flex flex-col items-center justify-center p-3 bg-neutral-900 rounded-lg border border-emerald-900/10 hover:border-rose-500/30 transition-all gap-2 col-span-2"
                        >
                          <Zap className="w-4 h-4 text-rose-500" />
                          <span className="text-[8px] uppercase font-mono">Edge Detection</span>
                          <input id="img-edge" type="file" className="hidden" accept="image/*" onChange={(e) => processImageFile(e, 'edge')} />
                        </button>
                      </div>

                      {isProcessingImg && (
                        <div className="flex items-center justify-center gap-3 py-6 bg-rose-500/5 rounded-lg border border-rose-500/10">
                          <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
                          <span className="text-[10px] text-rose-400 font-mono animate-pulse uppercase">Processing_Pixel...</span>
                        </div>
                      )}

                      {processedImage && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                           <div className="bg-neutral-900 rounded-lg p-2 border border-emerald-900/10 overflow-hidden">
                              <img src={processedImage} alt="Processed" className="w-full rounded-md" />
                              <a 
                                href={processedImage} 
                                download="processed_image.png"
                                className="flex items-center justify-center gap-2 mt-2 w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold uppercase rounded transition-colors"
                              >
                                <Download className="w-3 h-3" /> Download Result
                              </a>
                            </div>
                        </motion.div>
                      )}
                    </div>
                  </>
                ) : sideView === 'math' ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                         <Binary className="w-3 h-3 text-cyan-500" /> Scientific_Math
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                      <div className="bg-black/40 border border-cyan-900/20 rounded-xl p-4 space-y-3">
                        <div className="bg-black/60 rounded-lg p-3 border border-emerald-900/10 min-h-[60px] flex flex-col justify-end items-end overflow-hidden">
                          <div className="text-[10px] text-neutral-600 font-mono self-start uppercase mb-1">Expression</div>
                          <div className="text-lg font-mono text-cyan-400 break-all text-right leading-tight">
                            {mathInput || '0'}
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5">
                          {/* Row 1: Sci Functions */}
                          {['sin', 'cos', 'tan', 'log'].map(fn => (
                            <button 
                              key={fn} 
                              onClick={() => setMathInput(prev => prev + `${fn}(`)}
                              className="py-1.5 bg-cyan-950/20 hover:bg-cyan-900/30 text-[9px] font-bold text-cyan-600 rounded border border-cyan-900/10 uppercase"
                            >
                              {fn}
                            </button>
                          ))}
                          
                          {/* Row 2: Sci Functions Continued */}
                          {['sqrt', 'pi', 'exp', 'pow'].map(fn => (
                            <button 
                              key={fn} 
                              onClick={() => setMathInput(prev => prev + (fn === 'pi' ? 'pi' : `${fn}(`))}
                              className="py-1.5 bg-cyan-950/20 hover:bg-cyan-900/30 text-[9px] font-bold text-cyan-600 rounded border border-cyan-900/10 uppercase"
                            >
                              {fn}
                            </button>
                          ))}

                          {/* Row 3: Numeric + Basic Ops */}
                          {[7, 8, 9, '/'].map(val => (
                            <button 
                              key={val} 
                              onClick={() => setMathInput(prev => prev + val)}
                              className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-[12px] font-mono text-neutral-400 rounded border border-emerald-900/10"
                            >
                              {val}
                            </button>
                          ))}

                          {[4, 5, 6, '*'].map(val => (
                            <button 
                              key={val} 
                              onClick={() => setMathInput(prev => prev + val)}
                              className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-[12px] font-mono text-neutral-400 rounded border border-emerald-900/10"
                            >
                              {val}
                            </button>
                          ))}

                          {[1, 2, 3, '-'].map(val => (
                            <button 
                              key={val} 
                              onClick={() => setMathInput(prev => prev + val)}
                              className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-[12px] font-mono text-neutral-400 rounded border border-emerald-900/10"
                            >
                              {val}
                            </button>
                          ))}

                          {['(', 0, ')', '+'].map(val => (
                            <button 
                              key={val.toString()} 
                              onClick={() => setMathInput(prev => prev + val)}
                              className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-[12px] font-mono text-neutral-400 rounded border border-emerald-900/10"
                            >
                              {val}
                            </button>
                          ))}

                          {/* Last Row: Actions */}
                          <button 
                            onClick={() => setMathInput('')}
                            className="py-2.5 bg-rose-950/20 hover:bg-rose-900/30 text-[9px] font-bold text-rose-600 rounded border border-rose-900/10 uppercase"
                          >
                            CLR
                          </button>
                          <button 
                            onClick={() => setMathInput(prev => prev.slice(0, -1))}
                            className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-[9px] font-bold text-neutral-500 rounded border border-emerald-900/10 uppercase"
                          >
                            DEL
                          </button>
                          <button 
                            onClick={() => solveMath(mathInput)}
                            className="py-2.5 bg-cyan-600 hover:bg-cyan-500 text-[9px] font-bold text-white rounded shadow-lg shadow-cyan-900/20 uppercase"
                          >
                            EXE
                          </button>
                          <button 
                            onClick={() => solveMath(mathInput, true)}
                            className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-[9px] font-bold text-white rounded shadow-lg shadow-emerald-900/20 uppercase"
                          >
                            Plot
                          </button>
                        </div>
                      </div>

                      {isMathProcessing && (
                        <div className="flex items-center justify-center gap-3 py-4">
                          <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
                          <span className="text-[10px] text-cyan-400 font-mono">COMPUTING...</span>
                        </div>
                      )}

                      {mathResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          <div className="bg-neutral-900 p-4 rounded-lg border border-emerald-900/10">
                            <div className="text-[9px] text-neutral-600 uppercase mb-1">Result:</div>
                            <div className="text-xl font-mono text-cyan-500 break-all leading-tight">{mathResult.answer}</div>
                          </div>
                          {mathResult.plot && (
                            <div className="bg-neutral-900 p-2 rounded-lg border border-emerald-900/10 overflow-hidden">
                              <h4 className="text-[9px] font-bold text-neutral-500 uppercase mb-2 ml-2">Graph Visualization</h4>
                              <img src={mathResult.plot} alt="Plot" className="w-full rounded opacity-90 brightness-110" />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </>
                ) : sideView === 'crypto' ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                         <Lock className="w-3 h-3 text-amber-500" /> Offline_Security
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                      <div className="space-y-3">
                        <textarea 
                          id="crypto-text"
                          placeholder="Enter your message..."
                          className="w-full h-24 bg-black border border-emerald-900/20 rounded-lg px-3 py-3 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-500/50"
                        />
                        <input 
                          type="password" 
                          id="crypto-key"
                          placeholder="Security Key"
                          className="w-full bg-black border border-emerald-900/20 rounded-lg px-3 py-2 text-xs font-mono text-amber-500 focus:outline-none focus:border-amber-500/50"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => runCrypto(
                              (document.getElementById('crypto-text') as HTMLTextAreaElement).value,
                              (document.getElementById('crypto-key') as HTMLInputElement).value,
                              'enc'
                            )}
                            className="py-2 bg-amber-900/20 hover:bg-amber-900/40 text-[10px] font-mono text-amber-500 rounded border border-amber-500/20 uppercase flex items-center justify-center gap-2"
                          >
                            <Lock className="w-3 h-3" /> Encrypt
                          </button>
                          <button 
                            onClick={() => runCrypto(
                              (document.getElementById('crypto-text') as HTMLTextAreaElement).value,
                              (document.getElementById('crypto-key') as HTMLInputElement).value,
                              'dec'
                            )}
                            className="py-2 bg-emerald-900/20 hover:bg-emerald-900/40 text-[10px] font-mono text-emerald-500 rounded border border-emerald-900/20 uppercase flex items-center justify-center gap-2"
                          >
                            <ShieldCheck className="w-3 h-3" /> Decrypt
                          </button>
                        </div>
                      </div>

                      {cryptoResult && (
                        <div className="bg-neutral-900 p-4 rounded-lg border border-emerald-900/10 space-y-2 group relative">
                          <div className="text-[9px] text-neutral-600 uppercase">
                            {cryptoResult.mode === 'enc' ? 'Encrypted Token:' : 'Decrypted Message:'}
                          </div>
                          <div className="text-xs font-mono text-amber-200 break-all select-all leading-relaxed">
                            {cryptoResult.text}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : sideView === 'ml' ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                         <Brain className="w-3 h-3 text-emerald-500" /> Pocket_ML
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                      <div className="space-y-3">
                        <label className="text-[9px] text-neutral-600 uppercase font-mono ml-1">Input Data (X, Y per line)</label>
                        <textarea 
                          id="ml-data"
                          placeholder="1,10&#10;2,20&#10;3,35&#10;4,45"
                          className="w-full h-32 bg-black border border-emerald-900/20 rounded-lg px-3 py-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/50"
                        />
                        <button 
                          onClick={() => runMiniML((document.getElementById('ml-data') as HTMLTextAreaElement).value)}
                          className="w-full py-3 bg-emerald-600/20 hover:bg-emerald-600/40 text-[10px] font-mono text-emerald-500 rounded border border-emerald-500/20 uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <Target className="w-4 h-4" /> Analyse Data Trends
                        </button>
                      </div>

                      {isMlProcessing && (
                        <div className="flex items-center justify-center gap-3 py-6 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                          <span className="text-[10px] text-emerald-400 font-mono animate-pulse uppercase">Training_Model...</span>
                        </div>
                      )}

                      {mlResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-4">
                          <div className="bg-neutral-900 p-4 rounded-lg border border-emerald-900/10">
                            <div className="text-[9px] text-neutral-600 uppercase mb-2 flex items-center gap-2">
                              <LineChart className="w-3 h-3" /> Linear Regression Result:
                            </div>
                            <pre className="text-[10px] font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                              {mlResult.prediction}
                            </pre>
                          </div>
                          {mlResult.plot && (
                            <div className="bg-neutral-900 p-2 rounded-lg border border-emerald-900/10 overflow-hidden">
                              <img src={mlResult.plot} alt="ML Trend Plot" className="w-full rounded" />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </>
                ) : sideView === 'packages' ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                         <Package className="w-3 h-3 text-blue-500" /> Package_Manager
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                        <input 
                          type="text" 
                          id="pkg-search"
                          placeholder="Search PyPI / NumPy / Rich..."
                          className="w-full bg-black border border-emerald-900/20 rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500/50"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              installPackage((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                      </div>

                      {installingPackage && (
                        <div className="flex items-center justify-center gap-3 py-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                          <DownloadCloud className="w-4 h-4 text-blue-500 animate-bounce" />
                          <span className="text-[10px] text-blue-400 font-mono animate-pulse uppercase">Installing_{installingPackage}...</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-[9px] font-bold text-neutral-700 uppercase ml-1">Loaded Runtime Modules</h4>
                        {installedPackages.map(pkg => (
                          <div key={pkg} className="group flex items-center justify-between p-2.5 bg-neutral-900 border border-emerald-900/10 rounded-lg hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              <span className="text-xs font-mono text-neutral-300">{pkg}</span>
                            </div>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-blue-900/5 border border-blue-900/10 rounded-lg">
                        <p className="text-[9px] text-neutral-600 leading-relaxed uppercase font-mono">
                          Tip: Packages are loaded into WASM memory. Some heavy packages might take time to fetch from CDN.
                        </p>
                      </div>
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
          onClick={focusInput}
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
