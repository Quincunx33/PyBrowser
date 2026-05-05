# PyBrowser Terminal OS v1.0.0

Welcome to **PyBrowser Terminal OS**, a next-generation "Terminal-First" operating environment running entirely in your browser using WebAssembly (WASM). Powered by **Python 3.11 (Pyodide)**, this app provides a full stack of engineering tools for data analysis, machine learning, image processing, and web automation.

## 🚀 Core Features

- **WASM Python Kernel**: Execute complex Python scripts directly in the browser with access to `numpy`, `pandas`, `scipy`, and `scikit-learn`.
- **Persistent File System**: Uses `IDbfs` (IndexedDB) to save your scripts and data across page refreshes.
- **Terminal-Driven Workflow**: A robust command-line interface with 150+ workable command patterns.
- **Data Analyst Module**: Drag-and-drop CSV/Excel files for instant Pandas-powered analysis and dynamic charting.
- **Image Laboratory**: Professional imaging features (B&W, Edge Detection, AI Magic) using the `Pillow` library.
- **Pocket ML**: Train and run linear regression models on your custom datasets in real-time.
- **Automation Core**: Built-in web scraper and macro recorder with device simulation (Mobile/Desktop/Tablet).
- **Security Vault**: AES-256 (ZipCrypto) implementation for sealing files with high-entropy security keys.

## 🛠️ Workable Command Guide (Categories)

### [CORE SYSTEM]
- `ls`: List virtual directory contents.
- `pwd`: Show current working directory.
- `cd [dir]`: Change directory.
- `mkdir [name]`: Create new directory.
- `rm [file]`: Remove file.
- `cat [file]`: Read file contents.
- `touch [file]`: Create empty file.
- `clear`: Wipe terminal history.
- `whoami`: Current user context.
- `date`: System timestamp.
- `uptime`: Runtime duration.
- `uname`: Internal kernel info.
- `env`: List environment variables.
- `df`: Disk usage metrics.
- `top`: Mapped process monitor.
- `echo [msg]`: Repeat input.
- `history`: Command log.
- `version`: build identity.

### [IMAGING LAB]
- `img-bw`: Convert target to grayscale.
- `img-resize`: Scale image 50%.
- `img-sepia`: Apply vintage tone.
- `img-edge`: Laplacian edge detection.
- `img-bright`: Increase luminosity.
- `img-contrast`: Expand dynamic range.
- `img-convert [fmt]`: Change file format (PNG/WEBP/JPG).
- `img-magick`: Open visual editor canvas.
- `img-clean`: Purge temp buffers.
- `pixel-peek`: Metadata extractor.

### [DATA ANALYST]
- `data-load`: Mount file to engine.
- `data-head`: Preview top 5 vectors.
- `data-stats`: Full pandas describe() report.
- `data-chart`: Render default distribution plot.
- `data-clean`: Drop NaN values.
- `data-export`: Download as Excel/CSV.
- `df-query [expr]`: Filter dataset using logic.
- `matrix-calc`: Linear algebra solver.
- `plot-sin`: Trig visualizer.
- `plot-norm`: Gaussian distribution curve.

### [SCIENTIFIC MATH]
- `calc [expr]`: Direct Python eval.
- `solve [expr]`: Symbolic equation solver (SymPy).
- `derivative [expr]`: Calculus derivation.
- `integral [expr]`: Area under curve integrator.
- `limit [expr]`: Limit solver.
- `matrix-inv`: Matrix inversion.
- `matrix-det`: Determinant calculation.
- `stat-mean`: Average logic.
- `stat-std`: Deviation logic.
- `unit-conv [val]`: Unit transformer (metric/imperial).

### [CRYPTO VAULT]
- `crypto-gen`: Generate 16-char high-entropy key.
- `crypto-enc`: Encrypt buffer.
- `crypto-dec`: Decrypt buffer.
- `crypto-lock`: Seal active files into encrypted ZIP.
- `crypto-unlock`: Unseal ZIP vault.
- `hash-sha256`: SHA-256 digest.
- `hash-md5`: MD5 hash digest.
- `pass-gen`: Random secure password creator.
- `base64-enc`: Binary to string encoding.
- `base64-dec`: String to binary decoding.

### [POCKET ML]
- `ml-train`: Execute neural weight training.
- `ml-predict [x]`: Regression trend inference.
- `ml-status`: Model health & dataset size.
- `ml-reset`: Flush neural cache.
- `neural-sync`: Weights persistence logic.
- `gradient-check`: Verify descent optimization.
- `loss-func`: MSE calculator.
- `tensor-map`: View vector mappings.

### [WEB AUTOMATION]
- `auto-scrape`: Execute BeautifulSoup scraper.
- `auto-bot`: Start macro sequence.
- `auto-macro`: Record browser steps.
- `auto-device [type]`: Emulate User-Agent (Mobile/Desktop/Tablet).
- `cors-set [url]`: Update bridge relay.
- `proxy-ping`: Health check bridge.

### [PACKAGE MANAGER (PIP)]
- `pip-install [pkg]`: Fetch from PyPI/CDN.
- `pip-list`: Show active libraries.
- `pip-show [pkg]`: Metadata viewer.
- `pip-search [pkg]`: Search CDN registry.
- `pip-remove [pkg]`: Untrack handle.
- `lib-load`: Load standard science bundle.

### [FUN & EXTRAS]
- `fortune`: Random wisdom bit.
- `cowsay [msg]`: ASCII bovine messenger.
- `weather`: Localized atmospheric data.
- `matrix`: "Wake up, Neo" effect.
- `hack`: Simulation layer hack effect.
- `joke`: Programmer humor.
- `ping [ip]`: ICMP latency simulation.
- `pwn`: Terminal vanity trigger.
- `ascii-art`: Creative text rendering.
- `neofetch`: System hardware overview.

## ⚙️ Development & Technology

- **Language**: TypeScript 5.0+
- **Framework**: React 18+
- **Styling**: Tailwind CSS (Lucide Icons)
- **Engine**: Pyodide 0.26.x (Python 3.11 in WASM)
- **Math**: SymPy / NumPy
- **ML**: Scikit-Learn
- **Imaging**: Pillow (PIL)
- **Storage**: Browser IDB via Emscripten FS

## ⚠️ Limitations & Notes
- This is a client-side environment. No network persistence exists beyond your browser's IndexedDB.
- Web Scraping requires a CORS proxy as browsers block direct cross-site requests.
- Heavy ML training is limited by your local CPU performance.

---
*Created by PyBrowser OS Team with ❤️ for Developers.*
