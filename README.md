# 🖥️ Terminal OS (PyBrowser)
### **The Next Generation Browser-Based Operating System**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Terminal OS (PyBrowser)** is a revolutionary browser-based environment that brings a full-featured, Unix-like operating system experience directly to your web browser. Powered by WebAssembly (WASM), it executes real code locally, securely, and privately.

---

## 🌟 Key Highlights

*   **🔒 Privacy First**: Everything runs locally in your browser. No data ever leaves your machine.
*   **⚡ Near-Native Speed**: High-performance WASM allows for heavy computations without lag.
*   **🌐 16+ Languages**: Support for Python, C, Rust, Go, JS, Ruby, PHP, Zig, and more.
*   **🛠️ Zero Config**: No Docker or VM needed. Open the URL and start building.
*   **🧠 AI Integrated**: Built-in Gemini AI for code generation and debugging.

---

## 🏗️ Architectural Overview

### **1. Aether Microkernel**
The central orchestrator of Terminal OS, managing process scheduling and **Inter-Kernel Communication (IKC)**, allowing different languages to talk to each other.

### **2. Virtual File System (VFS)**
A persistent file system backed by **IndexedDB**. Use standard Unix commands like `ls`, `cd`, `mkdir`, and `grep`, then see your changes reflected in the graphical File Explorer.

### **3. AI-Ready Infrastructure**
Deep integration with **Google Gemini AI** provides:
- Intelligent Code Completion
- Real-time Error Correction
- Natural Language to Code translation

---

## 🚀 Core Features

| Feature | Description |
| :--- | :--- |
| **Terminal** | A robust shell with standard commands (`tar`, `curl`, `find`) and custom tools. |
| **File Manager** | A beautiful GUI for managing files, with drag-and-drop and folder navigation. |
| **Code Editor** | Integrated editor with syntax highlighting for dozens of languages. |
| **Data Lab** | Powerful tools for CSV/JSON analysis, statistical processing, and charting. |
| **Neural Center** | A complete machine learning suite for training models directly in-browser. |
| **Security Hub** | Built-in cryptography tools for file encryption and hashing. |

---

## 🛠️ Tech Stack

- **Framework**: [React 18+](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Code Execution**: [Pyodide](https://pyodide.org/) & WebAssembly
- **Syntax Highlighting**: [Prism.js](https://prismjs.com/)

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1.  **Clone the Repo**
    ```bash
    git clone https://github.com/Quincunx33/PyBrowser.git
    cd PyBrowser
    ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Launch the OS**
    ```bash
    npm run dev
    ```

Open your browser to `http://localhost:3000` and experience the future!

---

## 🗺️ Roadmap 2026

- [ ] **Parallel Execution**: True multi-threading with Web Workers.
- [ ] **X11 Support**: Support for legacy GUI applications.
- [ ] **Cloud Sync**: Optional E2E encrypted cloud storage.
- [ ] **Voice Control**: AI-powered voice commands for terminal operations.

---

## 🤝 Contributing

Contributions are welcome! Whether it's adding new kernels, fixing bugs, or improving the UI, please feel free to open a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Developed with ❤️ by [Quincunx33](https://github.com/Quincunx33)**
*Terminal OS v2.0.4 - Empowering developers through the browser.*
