import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Terminal as TerminalIcon, Cpu, Loader2, History, Zap, 
  Folder, Plus, Trash2, Upload, FileCode, FolderPlus,
  Monitor, X, Save, Code2, Activity, Square, BarChart3, CornerDownLeft,
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
  const [mathPreview, setMathPreview] = useState<string | null>(null);
  const [showScientific, setShowScientific] = useState(false);
  const [sciTab, setSciTab] = useState<'basic' | 'matrix' | 'stats' | 'units'>('basic');
  const [mathHistory, setMathHistory] = useState<{ expression: string; result: string }[]>(() => {
    const saved = localStorage.getItem('math_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [mathVariables, setMathVariables] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('math_variables');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('math_history', JSON.stringify(mathHistory));
  }, [mathHistory]);

  useEffect(() => {
    localStorage.setItem('math_variables', JSON.stringify(mathVariables));
  }, [mathVariables]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mathInput && pyodide) {
        // Quick preview calculation
        const runPreview = async () => {
          try {
            const pythonCode = `
import sympy
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application
transformations = (standard_transformations + (implicit_multiplication_application,))
try:
    expr = parse_expr("""${mathInput}""", transformations=transformations)
    simplified = sympy.simplify(expr)
    if simplified.is_number:
        res = float(simplified.evalf())
        print(f"{res:g}" if abs(res) < 1e10 else f"{res:.4e}")
    else:
        print(str(simplified))
except:
    print("")
`;
            const result = await pyodide.runPythonAsync(pythonCode);
            setMathPreview(result?.trim() || null);
          } catch (e) {
            setMathPreview(null);
          }
        };
        runPreview();
      } else {
        setMathPreview(null);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [mathInput, pyodide]);
  const [cryptoResult, setCryptoResult] = useState<{ text: string; mode: 'enc' | 'dec' } | null>(null);
  const [mlResult, setMlResult] = useState<{ prediction: string; plot: string | null } | null>(null);
  const [isMlProcessing, setIsMlProcessing] = useState(false);
  const [installedPackages, setInstalledPackages] = useState<string[]>(['numpy', 'pandas', 'matplotlib', 'scipy', 'scikit-learn', 'Pillow']);
  const [installingPackage, setInstallingPackage] = useState<string | null>(null);
  const [pkgSearch, setPkgSearch] = useState('');

  const commonPackages = [
    'sympy', 'requests', 'networkx', 'beautifulsoup4', 
    'bokeh', 'statsmodels', 'regex', 'pyyaml', 'seaborn',
    'scikit-image', 'pytz', 'six', 'bitarray', 'pydantic'
  ];
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
      // Ensure we have sympy for symbolic math and others for plotting
      await pyodide.loadPackage(['sympy', 'numpy', 'matplotlib']);
      
      const varsJson = JSON.stringify(mathVariables);
      const pythonCode = `
import sympy
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
import json
import math
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

expr_str = """${expression}"""
saved_vars = json.loads("""${varsJson}""")
plot_request = ${plot ? 'True' : 'False'}
img_str = None
ans_text = "N/A"
is_assignment = False
var_name = None

try:
    # Handle variable assignment (e.g., 'a = 10')
    if '=' in expr_str and not '==' in expr_str:
        parts = expr_str.split('=')
        var_name = parts[0].strip()
        expr_str = parts[1].strip()
        is_assignment = True

    # Pre-process
    transformations = (standard_transformations + (implicit_multiplication_application,))
    
    # Inject saved variables into sympy context
    context = {v: sympy.sympify(val) for v, val in saved_vars.items()}
    x, y, z = sympy.symbols('x y z')
    
    # Custom helpers for UI convenience
    def SymMatrix(arr): return sympy.Matrix(arr)
    
    context.update({
        'x': x, 'y': y, 'z': z,
        'Matrix': sympy.Matrix,
        'det': lambda m: m.det(),
        'inv': lambda m: m.inv(),
        'transpose': lambda m: m.T,
        'mean': lambda arr: np.mean(arr),
        'median': lambda arr: np.median(arr),
        'std': lambda arr: np.std(arr),
        'np': np,
        'math': math,
        'm_to_ft': lambda m: m * 3.28084,
        'ft_to_m': lambda ft: ft / 3.28084,
        'kg_to_lb': lambda kg: kg * 2.20462,
        'lb_to_kg': lambda lb: lb / 2.20462,
        'c_to_f': lambda c: (c * 9/5) + 32,
        'f_to_c': lambda f: (f - 32) * 5/9
    })
    
    parsed_expr = parse_expr(expr_str, transformations=transformations, local_dict=context)
    simplified = sympy.simplify(parsed_expr)
    
    if is_assignment and var_name:
        ans_text = f"Stored: {var_name} = {simplified}"
    elif simplified.is_number:
        res = float(simplified.evalf())
        ans_text = f"{res:g}" if abs(res) < 1e10 else f"{res:.4e}"
    else:
        ans_text = str(simplified)

except Exception as e:
    ans_text = f"Math Error: {str(e)}"

# Plotting logic
if plot_request:
    try:
        plt.figure(figsize=(10, 6))
        plt.style.use('dark_background')
        
        # Define x range
        x_vals = np.linspace(-10, 10, 1000)
        
        # Convert sympy expression to numeric function for plotting
        f = sympy.lambdify(x, simplified, modules=['numpy', 'math'])
        y_vals = f(x_vals)
        
        # Handle constant expressions
        if isinstance(y_vals, (int, float, np.float64)):
            y_vals = np.full_like(x_vals, y_vals)
            
        plt.plot(x_vals, y_vals, color='#06b6d4', linewidth=2)
        plt.title(f"f(x) = {simplified}", color='#94a3b8', fontsize=10)
        plt.axhline(0, color='white', linewidth=0.5, alpha=0.3)
        plt.axvline(0, color='white', linewidth=0.5, alpha=0.3)
        plt.grid(True, alpha=0.1)
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', transparent=True, dpi=120)
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()
    except Exception as e:
        ans_text = f"Plot Error: {str(e)}"

# Return values for JS
[ans_text, img_str, var_name if is_assignment and not ans_text.startswith('Math') else None, str(simplified) if is_assignment and not ans_text.startswith('Math') else None]
`;
      const [ans, img_str, newVarName, newVarVal] = await pyodide.runPythonAsync(pythonCode);
      
      if (newVarName && newVarVal) {
        setMathVariables(prev => ({ ...prev, [newVarName]: newVarVal }));
        addHistory('success', `Variable saved: ${newVarName} = ${newVarVal}`);
      }

      const newResult = { answer: ans, plot: img_str ? `data:image/png;base64,${img_str}` : null };
      setMathResult(newResult);
      
      // Log to terminal
      addHistory('info', `Math: ${expression} -> ${ans}`);
      
      if (!ans.startsWith('Math Error') && !ans.startsWith('Plot Error')) {
        setMathHistory(prev => [{ expression: expression, result: ans }, ...prev].slice(0, 10));
      }
    } catch (err: any) {
      addHistory('error', `Runtime Error: ${err.message}`);
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
      addHistory('success', `Crypto: ${mode.toUpperCase()} operation completed.`);
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
      addHistory('info', `ML Inference Result: ${prediction.split('\n')[0]}`);
      addHistory('system', 'ML Trend Analysis complete.');
    } catch (err: any) {
      addHistory('error', `ML Error: ${err.message}`);
    } finally {
      setIsMlProcessing(false);
    }
  };

  const [pkgStatus, setPkgStatus] = useState<string | null>(null);

  const installPackage = async (pkgName: string) => {
    if (!pkgName) return;
    
    if (!pyodide) {
      setPkgStatus("Error: Runtime not ready. Please wait...");
      setTimeout(() => setPkgStatus(null), 3000);
      return;
    }

    const name = pkgName.toLowerCase().trim();
    if (installedPackages.includes(name)) {
      setPkgStatus(`${name} is already loaded.`);
      setTimeout(() => setPkgStatus(null), 2000);
      return;
    }

    setInstallingPackage(name);
    setPkgStatus(`Starting installation of ${name}...`);
    addHistory('system', `Installing ${name}...`);
    
    try {
      // First, check if it's a built-in Pyodide package
      setPkgStatus(`Loading ${name} from CDN...`);
      try {
        await pyodide.loadPackage(name);
      } catch (e) {
        // Fallback to micropip for any other PyPI package
        setPkgStatus(`Fetching ${name} via micropip...`);
        await pyodide.loadPackage('micropip');
        const micropip = pyodide.pyimport('micropip');
        await micropip.install(name);
      }
      
      setInstalledPackages(prev => [...new Set([...prev, name])]);
      setPkgStatus(`Successfully installed ${name}`);
      addHistory('info', `Package ${name} is now available.`);
      setPkgSearch('');
      setTimeout(() => setPkgStatus(null), 3000);
    } catch (err: any) {
      console.error('Install error:', err);
      setPkgStatus(`Error: ${err.message || 'Installation failed'}`);
      addHistory('error', `Could not install ${name}.`);
    } finally {
      setInstallingPackage(null);
    }
  };

  const removePackage = (pkgName: string) => {
    const name = pkgName.toLowerCase().trim();
    setInstalledPackages(prev => prev.filter(p => p !== name));
    setPkgStatus(`Removed ${name} from tracking`);
    addHistory('system', `${name} untracked.`);
    setTimeout(() => setPkgStatus(null), 2000);
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
                         <Binary className="w-3 h-3 text-cyan-500" /> Advanced_OS_Calculator
                      </h3>
                      <button 
                        onClick={() => {
                          setMathHistory([]);
                          addHistory('system', 'Scientific calculation history cleared.');
                        }}
                        className="text-[8px] text-neutral-600 hover:text-rose-500 uppercase font-mono transition-colors"
                      >
                        Clear_History
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                      <div className="bg-neutral-900/50 border border-cyan-900/20 rounded-xl p-4 space-y-3 backdrop-blur-sm">
                        <div className="bg-black/60 rounded-lg p-3 border border-cyan-900/10 min-h-[100px] flex flex-col justify-between items-end overflow-hidden group relative">
                          <div className="w-full flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] text-cyan-400 font-mono uppercase tracking-tighter">I/O_Buffer</span>
                            {isMathProcessing && <Activity className="w-3 h-3 text-cyan-500 animate-spin" />}
                          </div>
                          <div className="w-full space-y-1">
                            <div className="text-xs font-mono text-neutral-500 text-right truncate opacity-60">
                              {mathHistory[0]?.expression || '...'}
                            </div>
                            <div className="text-xl font-mono text-cyan-400 break-all text-right leading-tight">
                              {mathInput || '0'}
                            </div>
                            {mathPreview && mathInput && (
                              <div className="text-[10px] font-mono text-cyan-500/50 text-right italic">
                                Preview: {mathPreview}
                              </div>
                            )}
                          </div>
                        </div>

                        {mathResult && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3"
                          >
                            <div className="text-[9px] text-cyan-500/60 uppercase font-mono mb-1">Result</div>
                            <div className="text-sm font-mono text-cyan-100 leading-relaxed break-words">
                              {mathResult.answer}
                            </div>
                            {mathResult.plot && (
                              <div className="mt-3 overflow-hidden rounded-lg border border-cyan-900/30 bg-black/40">
                                <img src={mathResult.plot} alt="Plot" className="w-full h-auto" />
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Controls */}
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => setShowScientific(!showScientific)}
                            className={`w-full py-2 rounded border transition-all text-[9px] font-bold uppercase ${
                              showScientific 
                                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                                : 'bg-neutral-800 border-white/5 text-neutral-500'
                            }`}
                          >
                            {showScientific ? 'Hide_Scientific_Tools' : 'Show_Scientific_Tools'}
                          </button>

                          {showScientific && (
                            <div className="flex gap-1 p-1 bg-black/40 rounded-lg border border-white/5">
                              {(['basic', 'matrix', 'stats', 'units'] as const).map(tab => (
                                <button
                                  key={tab}
                                  onClick={() => setSciTab(tab)}
                                  className={`flex-1 py-1 rounded text-[7px] font-bold uppercase transition-all ${
                                    sciTab === tab 
                                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                                      : 'text-neutral-500 hover:text-neutral-300'
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Sci Keypad */}
                        <AnimatePresence mode="wait">
                          {showScientific && (
                            <motion.div 
                              key={sciTab}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="space-y-1.5"
                            >
                              {sciTab === 'basic' && (
                                <div className="grid grid-cols-4 gap-1.5">
                                  {['sin', 'cos', 'tan', 'log'].map(fn => (
                                    <button 
                                      key={fn} 
                                      onClick={() => setMathInput(prev => prev + `${fn}(`)}
                                      className="py-2 bg-neutral-900/50 hover:bg-cyan-500/10 text-[9px] font-bold text-cyan-600 rounded border border-cyan-900/10 uppercase transition-all"
                                    >
                                      {fn}
                                    </button>
                                  ))}
                                  {['sqrt', 'pi', 'e', 'abs'].map(fn => (
                                    <button 
                                      key={fn} 
                                      onClick={() => setMathInput(prev => prev + (fn === 'pi' || fn === 'e' ? fn : `${fn}(`))}
                                      className="py-2 bg-neutral-900/50 hover:bg-cyan-500/10 text-[9px] font-bold text-cyan-600 rounded border border-cyan-900/10 uppercase transition-all"
                                    >
                                      {fn}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {sciTab === 'matrix' && (
                                <div className="grid grid-cols-3 gap-1.5">
                                  <button onClick={() => setMathInput(prev => prev + "Matrix([[1,0],[0,1]])")} className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-cyan-600 rounded border border-cyan-900/10 uppercase transition-all">New_Matrix</button>
                                  <button onClick={() => setMathInput(prev => prev + "det(")} className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-cyan-600 rounded border border-cyan-900/10 uppercase transition-all">Determinant</button>
                                  <button onClick={() => setMathInput(prev => prev + "inv(")} className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-cyan-600 rounded border border-cyan-900/10 uppercase transition-all">Inverse</button>
                                  <button onClick={() => setMathInput(prev => prev + "transpose(")} className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-cyan-600 rounded border border-cyan-900/10 uppercase transition-all">T_Transpose</button>
                                  <button onClick={() => setMathInput(prev => prev + "Matrix([1,2,3])")} className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-cyan-600 rounded border border-cyan-900/10 uppercase transition-all">Vector</button>
                                  <button onClick={() => setMathInput(prev => prev + "eye(3)")} className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-cyan-600 rounded border border-cyan-900/10 uppercase transition-all">Identity</button>
                                </div>
                              )}

                              {sciTab === 'stats' && (
                                <div className="grid grid-cols-3 gap-1.5">
                                  <button onClick={() => setMathInput(prev => prev + "mean([") } className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-emerald-600 rounded border border-emerald-900/10 uppercase transition-all">Average/Mean</button>
                                  <button onClick={() => setMathInput(prev => prev + "median([") } className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-emerald-600 rounded border border-emerald-900/10 uppercase transition-all">Median</button>
                                  <button onClick={() => setMathInput(prev => prev + "std([") } className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-emerald-600 rounded border border-emerald-900/10 uppercase transition-all">Std_Dev</button>
                                  <button onClick={() => setMathInput(prev => prev + "sum([") } className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-emerald-600 rounded border border-emerald-900/10 uppercase transition-all">Summation</button>
                                  <button onClick={() => setMathInput(prev => prev + "min([") } className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-emerald-600 rounded border border-emerald-900/10 uppercase transition-all">Minimum</button>
                                  <button onClick={() => setMathInput(prev => prev + "max([") } className="py-2 bg-neutral-800 hover:bg-cyan-500/10 text-[8px] font-mono text-emerald-600 rounded border border-emerald-900/10 uppercase transition-all">Maximum</button>
                                </div>
                              )}

                              {sciTab === 'units' && (
                                <div className="grid grid-cols-2 gap-1.5">
                                  <button onClick={() => setMathInput(prev => prev + "m_to_ft(")} className="py-2 bg-neutral-800 hover:bg-orange-500/10 text-[8px] font-mono text-orange-500 rounded border border-orange-500/10 uppercase transition-all">Meter ➜ Feet</button>
                                  <button onClick={() => setMathInput(prev => prev + "ft_to_m(")} className="py-2 bg-neutral-800 hover:bg-orange-500/10 text-[8px] font-mono text-orange-500 rounded border border-orange-500/10 uppercase transition-all">Feet ➜ Meter</button>
                                  <button onClick={() => setMathInput(prev => prev + "kg_to_lb(")} className="py-2 bg-neutral-800 hover:bg-orange-500/10 text-[8px] font-mono text-orange-500 rounded border border-orange-500/10 uppercase transition-all">KG ➜ LB</button>
                                  <button onClick={() => setMathInput(prev => prev + "lb_to_kg(")} className="py-2 bg-neutral-800 hover:bg-orange-500/10 text-[8px] font-mono text-orange-500 rounded border border-orange-500/10 uppercase transition-all">LB ➜ KG</button>
                                  <button onClick={() => setMathInput(prev => prev + "c_to_f(")} className="py-2 bg-neutral-800 hover:bg-orange-500/10 text-[8px] font-mono text-orange-500 rounded border border-orange-500/10 uppercase transition-all">°C ➜ °F</button>
                                  <button onClick={() => setMathInput(prev => prev + "f_to_c(")} className="py-2 bg-neutral-800 hover:bg-orange-500/10 text-[8px] font-mono text-orange-500 rounded border border-orange-500/10 uppercase transition-all">°F ➜ °C</button>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="grid grid-cols-4 gap-1.5">
                          {['**', '(', ')', '/'].map(val => (
                            <button 
                              key={val} 
                              onClick={() => setMathInput(prev => prev + val)}
                              className="py-2 bg-neutral-900/80 hover:bg-neutral-800 text-[11px] font-mono text-cyan-500/70 rounded border border-cyan-900/10"
                            >
                              {val === '**' ? 'x^y' : val}
                            </button>
                          ))}

                          {[7, 8, 9, '*'].map(val => (
                            <button 
                              key={val} 
                              onClick={() => setMathInput(prev => prev + val)}
                              className="py-3 bg-neutral-900 hover:bg-neutral-800 text-[14px] font-mono text-neutral-300 rounded border border-white/5 shadow-inner"
                            >
                              {val}
                            </button>
                          ))}

                          {[4, 5, 6, '-'].map(val => (
                            <button 
                              key={val} 
                              onClick={() => setMathInput(prev => prev + val)}
                              className="py-3 bg-neutral-900 hover:bg-neutral-800 text-[14px] font-mono text-neutral-300 rounded border border-white/5 shadow-inner"
                            >
                              {val}
                            </button>
                          ))}

                          {[1, 2, 3, '+'].map(val => (
                            <button 
                              key={val} 
                              onClick={() => setMathInput(prev => prev + val)}
                              className="py-3 bg-neutral-900 hover:bg-neutral-800 text-[14px] font-mono text-neutral-300 rounded border border-white/5 shadow-inner"
                            >
                              {val}
                            </button>
                          ))}

                          <button 
                            onClick={() => setMathInput(prev => prev.slice(0, -1))}
                            className="py-3 bg-rose-950/20 hover:bg-rose-900/30 text-[10px] font-bold text-rose-600 rounded border border-rose-900/10 uppercase"
                          >
                            DEL
                          </button>
                          <button 
                            onClick={() => setMathInput(prev => prev + '0')}
                            className="py-3 bg-neutral-900 hover:bg-neutral-800 text-[14px] font-mono text-neutral-300 rounded border border-white/5 shadow-inner"
                          >
                            0
                          </button>
                          <button 
                            onClick={() => setMathInput(prev => prev + '.')}
                            className="py-3 bg-neutral-900 hover:bg-neutral-800 text-[14px] font-mono text-neutral-300 rounded border border-white/5 shadow-inner"
                          >
                            .
                          </button>
                          <button 
                            onClick={() => {
                              if (mathInput) solveMath(mathInput);
                            }}
                            disabled={isMathProcessing || !mathInput}
                            className="py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-[14px] font-bold text-black rounded border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                          >
                            =
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                           <button 
                            onClick={() => setMathInput('')}
                            className="py-2 bg-neutral-800 hover:bg-neutral-700 text-[9px] font-bold text-neutral-400 rounded border border-white/5 uppercase"
                          >
                            Reset_All
                          </button>
                          <button 
                            onClick={() => {
                              if (mathInput) solveMath(mathInput, true);
                            }}
                            className="py-2 bg-cyan-950/30 hover:bg-cyan-900/40 text-[9px] font-bold text-cyan-400 rounded border border-cyan-500/20 uppercase"
                          >
                            Plot_Variable_X
                          </button>
                        </div>
                      </div>

                      {/* Variables Panel */}
                      {Object.keys(mathVariables).length > 0 && (
                        <div className="space-y-2 mb-4">
                          <h4 className="text-[9px] font-bold text-neutral-600 uppercase ml-1 flex items-center gap-2">
                             <Lock className="w-3 h-3" /> Saved_Variables
                          </h4>
                          <div className="flex flex-wrap gap-2 p-3 bg-neutral-900/30 border border-white/5 rounded-lg">
                            {Object.entries(mathVariables).map(([name, val]) => (
                              <button 
                                key={name}
                                onClick={() => setMathInput(prev => prev + name)}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  const next = { ...mathVariables };
                                  delete next[name];
                                  setMathVariables(next);
                                  addHistory('system', `Variable ${name} deleted.`);
                                }}
                                className="group relative flex items-center gap-2 px-2 py-1 bg-black/40 border border-cyan-900/10 rounded-md hover:border-cyan-500/30 transition-all"
                                title="Right click to delete"
                              >
                                <span className="text-[9px] font-mono text-cyan-500">{name}</span>
                                <span className="text-[9px] font-mono text-neutral-500">= {val}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* History Panel */}
                      {mathHistory.length > 0 && (
                        <div className="space-y-2 mt-6">
                          <h4 className="text-[9px] font-bold text-neutral-600 uppercase ml-1 flex items-center justify-between gap-2">
                             <span className="flex items-center gap-2"><History className="w-3 h-3" /> Recent_Calculations</span>
                             <button 
                               onClick={() => {
                                 setMathHistory([]);
                                 addHistory('system', 'Calculation history purged.');
                               }}
                               className="text-[7px] text-neutral-700 hover:text-rose-500 transition-colors uppercase"
                             >
                               Purge_All
                             </button>
                          </h4>
                          <div className="space-y-1.5">
                            {mathHistory.map((item, idx) => (
                              <div key={idx} className="group relative">
                                <button 
                                  onClick={() => setMathInput(item.expression)}
                                  className="w-full flex items-center justify-between p-3 bg-neutral-900/30 border border-emerald-900/5 rounded-lg hover:border-cyan-500/30 transition-all text-left"
                                >
                                  <div className="flex flex-col gap-0.5 overflow-hidden pr-8">
                                    <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-400 truncate">{item.expression}</span>
                                    <span className="text-xs font-mono text-cyan-500/80 group-hover:text-cyan-400 truncate">{item.result}</span>
                                  </div>
                                  <CornerDownLeft className="w-3 h-3 text-neutral-800 group-hover:text-cyan-600 shrink-0" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMathHistory(prev => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 opacity-0 group-hover:opacity-100 bg-neutral-900 border border-white/5 rounded-md text-neutral-600 hover:text-rose-500 transition-all shadow-xl"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-3 bg-cyan-900/5 border border-cyan-900/10 rounded-lg">
                        <p className="text-[9px] text-neutral-600 leading-relaxed uppercase font-mono italic">
                          Scientific mode: supports NumPy eval, basic plotting (use 'x' as variable), and complex arithmetic.
                        </p>
                      </div>
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
                    <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pb-10">
                      {pkgStatus && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className={`p-3 rounded-lg border text-[10px] font-mono flex items-center gap-3 ${
                            pkgStatus.startsWith('Error') 
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                          }`}
                        >
                          {pkgStatus.startsWith('Error') ? <X className="w-4 h-4" /> : <Activity className="w-4 h-4 animate-pulse" />}
                          {pkgStatus}
                        </motion.div>
                      )}

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                        <input 
                          type="text" 
                          value={pkgSearch}
                          onChange={(e) => setPkgSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && pkgSearch) {
                              installPackage(pkgSearch);
                              setPkgSearch('');
                            }
                          }}
                          placeholder="Search PyPI / NumPy / Type & Enter..."
                          className="w-full bg-black border border-emerald-900/20 rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      {installingPackage && (
                        <div className="flex items-center justify-center gap-3 py-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                          <DownloadCloud className="w-4 h-4 text-blue-500 animate-bounce" />
                          <span className="text-[10px] text-blue-400 font-mono animate-pulse uppercase">Installing_{installingPackage}...</span>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-[9px] font-bold text-emerald-600 uppercase ml-1 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> Active Modules
                          </h4>
                          {installedPackages
                            .filter(p => !pkgSearch || p.toLowerCase().includes(pkgSearch.toLowerCase()))
                            .map(pkg => (
                            <div key={pkg} className="group flex items-center justify-between p-3 bg-neutral-900/50 border border-emerald-900/10 rounded-lg hover:border-emerald-500/20 transition-all">
                              <span className="text-xs font-mono text-neutral-300">{pkg}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-[8px] font-mono text-emerald-500/60 uppercase border border-emerald-500/20 px-2 py-0.5 rounded">Loaded</span>
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removePackage(pkg);
                                  }}
                                  className="p-1 hover:bg-rose-500/10 text-neutral-700 hover:text-rose-500 rounded transition-colors"
                                  title="Unload"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-[9px] font-bold text-neutral-600 uppercase ml-1 flex items-center gap-2">
                            <DownloadCloud className="w-3 h-3" /> Available in Registry
                          </h4>
                          {commonPackages
                            .filter(p => !installedPackages.includes(p))
                            .filter(p => !pkgSearch || p.toLowerCase().includes(pkgSearch.toLowerCase()))
                            .map(pkg => (
                            <button 
                              key={pkg} 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                installPackage(pkg);
                              }}
                              disabled={!!installingPackage}
                              className="w-full group flex items-center justify-between p-3 bg-neutral-900/30 border border-emerald-900/5 rounded-lg hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-left disabled:opacity-50"
                            >
                              <span className="text-xs font-mono text-neutral-500 group-hover:text-neutral-300">{pkg}</span>
                              <Plus className="w-3.5 h-3.5 text-neutral-700 group-hover:text-blue-500" />
                            </button>
                          ))}
                          
                          {pkgSearch && !commonPackages.some(p => p.includes(pkgSearch)) && !installedPackages.some(p => p.includes(pkgSearch)) && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                installPackage(pkgSearch);
                              }}
                              className="w-full p-4 border border-dashed border-blue-900/20 rounded-lg text-center hover:bg-blue-500/5 transition-all"
                            >
                              <div className="text-[10px] text-blue-500/60 font-mono uppercase mb-1">Module Not in Registry</div>
                              <div className="text-xs font-mono text-blue-400">Install "{pkgSearch}" via micropip?</div>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-blue-900/5 border border-blue-900/10 rounded-lg">
                        <p className="text-[9px] text-neutral-600 leading-relaxed uppercase font-mono italic">
                          Note: Pyodide loads packages directly into browser memory via CDN. Some larger science libraries may take time to fetch.
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
