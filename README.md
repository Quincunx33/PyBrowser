# Cortex Operating System v4.0 (Enterprise Edition)

Welcome to **Cortex OS**, a high-performance, browser-based development and hacking environment built on a robust full-stack architecture. Cortex OS provides a seamless experience for developing, testing, and deploying web applications and tools directly from your browser.

## 🚀 Core Features

### 1. **Live Deployment Hub (Real Subdomain Routing)**
The standout feature of Cortex OS is the **Web Gateway Hub**. Unlike standard IDEs that only offer static previews, Cortex allows you to "deploy" your files to real, addressable endpoints.
- **Real Backend Integration:** Powered by an Express.js server, it dynamically registers routes.
- **Instant Deployment:** Use the `deploy [filename] [subdomain]` command to map any HTML/CSS/JSON file to a unique URL.
- **Integrated Browser:** View your live deployments inside the OS without leaving the workspace.

### 2. **Universal Execution Hub**
The `run` command is the heart of the system.
- **Python Support:** Execute Python scripts (`.py`) in-browser using Pyodide.
- **Universal Run:** The "Run Code" button in the editor dynamically handles different file types, providing console output directly in your history log.

### 3. **Advanced Security Vault**
A dedicated **Offline Security** module allows you to stage files for secure archiving.
- **AES-Zip Concepts:** Prepare assets for secure, encrypted storage.
- **Archiving Logic:** Features a drag-and-drop interface for staging assets before final processing.

### 4. **Modern Developer Suite**
- **Full-Stack Filesystem:** A sidebar that supports folders, nested files, and real-time state synchronization.
- **Multi-View Sidebar:** Toggle between File Explorer, Network Gateway, AI Automation, and Pocket ML views.
- **Hybrid Terminal:** A command-line interface that bridges the gap between simulated OS commands and real API calls.

## 🛠 Command Reference

| Command | Usage | Description |
| :--- | :--- | :--- |
| `run` | `run [file]` | Executes the specified file. |
| `deploy` | `deploy [file] [name]` | Deploys a file to `[origin]/v-host/[name]`. |
| `kill` | `kill [PID]` | Terminates a running process or deployment. |
| `ls` | `ls` | Lists files in the current directory. |
| `status` | `status` | Shows system resource usage and active nodes. |
| `traffic-log` | `traffic-log` | Activates global traffic monitoring. |

## 🏗 Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Express.js (Real-time gateway registry).
- **Runtime:** Node.js (v4.0.0+ Compatibility).
- **Core Engine:** TSX (TypeScript Execute) for server-side reliability.
- **Animations:** Framer Motion (motion/react).

## 🔒 Security Notice
Cortex OS is designed for development and sandbox testing. While it provides "Edge Node" simulation and "Subdomain Routing", all operations are contained within the provisioned environment for safety.

---
*Built with ❤️ for developers who need more than just a code editor.*
