# Terminal OS (PyBrowser) - The Next Generation Browser-Based Operating System

Terminal OS (hosted on GitHub as **PyBrowser**) is a revolutionary, browser-based operating system. By leveraging WebAssembly (WASM), SharedArrayBuffer, and advanced browser APIs, it provides a full-featured, Unix-like environment directly within your browser.

## Why Terminal OS?
- **Privacy-Centric Execution:** Everything runs locally in your browser. No data ever leaves your computer!
- **WASM-Powered Performance:** Near-native speed using WebAssembly.
- **Multi-Kernel Support:** Run Python, C, Rust, Go, JavaScript, and 16+ other languages simultaneously.
- **Zero-Friction:** No Docker, no virtual environments—just open and code.

## Core Features
1. **Aether Microkernel:** Handles scheduling and inter-kernel communication.
2. **Virtual File System (VFS):** Uses IndexedDB for persistent storage across sessions.
3. **Socket Proxy:** Securely bridges standard CLI tools to external services.
4. **AI-Ready:** Built-in Gemini AI integration for coding and debugging assistance.

## Commands Reference
- `py-run <file.py>`: Executes Python scripts.
- `wasm-compile <file.zig>`: Compiles Zig/C/C++ binaries.
- `ai-generate --query "..."`: AI assistant queries for code generation.
- `vfs-mount --persist`: Mounts IndexedDB for persistence.
- `kernel-switch <name>`: Switch languages.

## Roadmap 2026
- **Q1:** Parallel execution.
- **Q2:** GUI support for X11 apps.
- **Q3:** Collaborative sessions.
- **Q4:** Multimodal AI integration.

## Get Started
```bash
git clone https://github.com/Quincunx33/PyBrowser
cd PyBrowser
npm install
npm run dev
```

## GitHub Repository
[https://github.com/Quincunx33/PyBrowser](https://github.com/Quincunx33/PyBrowser)

## License
MIT License. Terminal OS v2.0.4 - Built for modern engineers.
