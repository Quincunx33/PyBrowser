# Terminal OS (PyBrowser) - The Next Generation Browser-Based Operating System

## Introduction

Terminal OS, affectionately known as PyBrowser in its GitHub incarnation, represents a paradigm shift in how we interact with operating systems and development environments. It is a groundbreaking, fully-featured, Unix-like operating system meticulously engineered to run entirely within your web browser. By harnessing the formidable power of WebAssembly (WASM), the efficiency of SharedArrayBuffer, and a suite of cutting-edge browser APIs, PyBrowser delivers a robust, high-performance computing environment that is both privacy-centric and incredibly versatile.

At its core, PyBrowser is designed to eliminate the traditional barriers to entry for development and system interaction. Forget the complexities of Docker containers, the overhead of virtual machines, or the setup headaches of language-specific environments. With PyBrowser, a powerful, multi-language development ecosystem is just a browser tab away. It embodies the philosophy of "zero-friction" computing, allowing users to dive directly into coding, data analysis, or system administration tasks without any prior setup.

### Why Terminal OS (PyBrowser)?

PyBrowser stands out in the crowded landscape of development tools and operating systems due to several compelling advantages:

*   **Privacy-Centric Execution**: A cornerstone of PyBrowser's design is its unwavering commitment to user privacy. All computational processes, data storage, and application executions occur exclusively within your local browser environment. This architecture ensures that no sensitive data ever leaves your computer, providing an unparalleled level of security and confidentiality for your projects and information.
*   **WASM-Powered Performance**: Leveraging WebAssembly, PyBrowser achieves near-native execution speeds for computationally intensive tasks. This allows for the seamless operation of complex applications and algorithms, bridging the performance gap often associated with browser-based solutions. WASM's efficiency is critical for supporting the diverse range of programming languages and tools integrated into the OS.
*   **Multi-Kernel Support**: One of PyBrowser's most revolutionary features is its ability to run over 16 different programming languages simultaneously within a unified environment. This includes popular languages like Python, C, Rust, Go, JavaScript, C++, C#, Zig, Ruby, PHP, TypeScript, Kotlin, Dart, Swift, and SQL. This multi-kernel architecture facilitates polyglot development, enabling developers to switch between languages or even combine them within a single project effortlessly.
*   **Zero-Friction Development**: The traditional hurdles of setting up development environments—installing compilers, configuring interpreters, managing dependencies, or wrestling with virtual environments—are completely bypassed. PyBrowser provides an instant-on development experience. Simply open your browser, and you're ready to code, compile, and execute across multiple languages without any prerequisite installations.
*   **Integrated AI Capabilities**: PyBrowser is forward-looking, incorporating advanced AI capabilities directly into its core. With built-in Gemini AI integration, users gain access to intelligent coding assistance, debugging support, and automated code generation, significantly enhancing productivity and streamlining the development workflow.

## Architectural Overview

PyBrowser's sophisticated architecture is a testament to modern web technologies and innovative system design. It is composed of several interconnected modules that work in harmony to deliver a seamless operating experience.

### Core Components

1.  **Aether Microkernel**: This is the brain of Terminal OS. The Aether Microkernel is responsible for managing and orchestrating all processes within the browser environment. Its primary functions include:
    *   **Process Scheduling**: Efficiently allocates browser resources to various running tasks and language kernels, ensuring smooth multitasking and responsiveness.
    *   **Inter-Kernel Communication (IKC)**: Facilitates seamless data exchange and command execution between different language kernels. This allows, for example, a Python script to interact with a C++ module or a JavaScript component to trigger a Rust function, enabling true polyglot application development.
    *   **Resource Management**: Oversees memory allocation, CPU utilization, and other system resources to prevent bottlenecks and maintain optimal performance.

2.  **Virtual File System (VFS)**: PyBrowser implements a robust Virtual File System that provides a familiar hierarchical structure for file management. Key aspects of the VFS include:
    *   **IndexedDB Integration**: The VFS leverages the browser's IndexedDB API for persistent storage. This means that all your files, code, and project data are saved locally within your browser and persist across sessions, even after closing and reopening PyBrowser. This provides a reliable and offline-capable storage solution.
    *   **Standard File Operations**: Supports a full suite of Unix-like file commands such as `ls`, `cd`, `mkdir`, `rm`, `cat`, `touch`, `cp`, `mv`, `grep`, and `find`, allowing users to manage their files and directories with familiar commands.
    *   **File Explorer UI**: A graphical file explorer complements the command-line interface, offering an intuitive way to navigate, create, delete, rename, upload, and download files and folders.

3.  **Socket Proxy**: To extend the capabilities of PyBrowser beyond the browser's sandbox, a secure Socket Proxy is implemented. This component:
    *   **Bridges CLI Tools**: Enables PyBrowser to securely interact with external services and traditional command-line interface (CLI) tools that might run outside the browser environment. This is crucial for tasks requiring network access or interaction with external APIs.
    *   **Security and Isolation**: The proxy is designed with security in mind, ensuring that external interactions are mediated and controlled, protecting the integrity of the local browser environment.

4.  **AI-Ready Infrastructure**: PyBrowser is built with AI at its foundation, offering deep integration with advanced AI models:
    *   **Gemini AI Integration**: Directly incorporates Google's Gemini AI for a variety of intelligent functionalities, including:
        *   **Coding Assistance**: Provides intelligent code suggestions, auto-completion, and syntax error detection across multiple languages.
        *   **Debugging Support**: Helps identify and resolve issues in code by offering explanations, potential fixes, and best practices.
        *   **Automated Code Generation**: Users can leverage AI to generate code snippets, functions, or even entire scripts based on natural language prompts, significantly accelerating development.
        *   **Data Analysis Insights**: Assists in interpreting data, suggesting appropriate visualizations, and identifying patterns or anomalies.

### Frontend Technologies

The user interface and interactive elements of PyBrowser are built using a modern and efficient frontend stack:

*   **React**: A declarative, component-based JavaScript library for building user interfaces. React ensures a highly responsive and dynamic user experience, allowing for complex UI elements to be managed efficiently.
*   **Vite**: A next-generation frontend tooling that provides an extremely fast development experience. Vite's instant server start and lightning-fast Hot Module Replacement (HMR) significantly boost developer productivity.
*   **TypeScript**: A superset of JavaScript that adds static typing. TypeScript enhances code quality, readability, and maintainability, especially in large-scale applications like PyBrowser, by catching errors at compile-time rather than runtime.
*   **Tailwind CSS**: A utility-first CSS framework that enables rapid UI development. Tailwind CSS allows for highly customizable and responsive designs directly within the HTML, leading to a streamlined styling process.
*   **Motion (Framer Motion)**: A powerful React library for production-ready animations. Motion is used to create the smooth transitions, interactive elements, and engaging visual feedback that contribute to PyBrowser's polished user experience.
*   **Prism.js**: A lightweight, extensible syntax highlighter used within the code editor to provide clear and readable code presentation for all supported programming languages.

### Backend (server.ts)

While PyBrowser primarily operates client-side, a minimal backend component (`server.ts`) is utilized for specific functionalities, particularly during development and for handling certain external interactions:

*   **Express**: A fast, unopinionated, minimalist web framework for Node.js. Express is used to create the server-side logic, handle API requests, and serve static assets.
*   **TSX**: A TypeScript execution environment that allows for running TypeScript files directly without prior compilation. This simplifies the development workflow for the backend components.
*   **Dotenv**: A module that loads environment variables from a `.env` file, ensuring that sensitive configuration details are kept separate from the codebase and are not exposed in the client-side application.

## Core Features in Detail

PyBrowser is packed with an extensive array of features designed to cater to developers, data scientists, and anyone seeking a powerful, browser-based computing environment.

### Multi-Kernel Language Support

PyBrowser's ability to seamlessly integrate and execute multiple programming languages is a cornerstone of its innovation. This is achieved through the sophisticated management of various language kernels, each optimized for its respective language.

*   **Supported Languages**: PyBrowser proudly supports a comprehensive list of over 16 programming languages, allowing for unparalleled flexibility in development:
    *   **Python**: For data science, machine learning, scripting, and general-purpose programming.
    *   **C**: For low-level programming, system utilities, and performance-critical applications.
    *   **Rust**: For systems programming, safety-critical applications, and high-performance computing.
    *   **Go**: For concurrent programming, network services, and scalable applications.
    *   **JavaScript**: For web development, interactive UIs, and server-side (Node.js-like) scripting.
    *   **C++**: For high-performance applications, game development, and embedded systems.
    *   **C#**: For enterprise applications, Windows development, and game development (Unity).
    *   **Zig**: A modern systems programming language focused on robustness, optimality, and maintainability.
    *   **Ruby**: For web development (Rails), scripting, and general-purpose programming.
    *   **PHP**: For web development, server-side scripting, and content management systems.
    *   **TypeScript**: For scalable JavaScript applications, enhancing code quality and developer experience.
    *   **Kotlin**: For Android development, server-side applications, and general-purpose programming.
    *   **Dart**: For cross-platform mobile (Flutter) and web development.
    *   **Swift**: For iOS/macOS development, and general-purpose programming.
    *   **SQL**: For database querying and management.

*   **Inter-Kernel Interaction**: The Aether Microkernel manages the execution contexts for each language, allowing them to run concurrently and, where appropriate, interact with each other. This enables advanced scenarios such as:
    *   Calling Python functions from JavaScript.
    *   Passing data structures between C and Rust modules.
    *   Executing SQL queries from a Python script and processing the results in JavaScript.

*   **`kernel-switch <name>` Command**: Users can dynamically switch the active kernel within the terminal using the `kernel-switch` command. This changes the default language for subsequent commands, providing a fluid development experience without needing to restart or reconfigure the environment.

### Terminal Functionality

The heart of PyBrowser is its powerful and intuitive terminal, offering a rich set of commands and features reminiscent of a traditional Unix-like shell.

*   **Input/Output Handling**: The terminal provides a responsive interface for command input and displays output, errors, and system messages clearly. It supports multi-line input and intelligent command parsing.
*   **Command History**: A persistent command history allows users to easily recall and re-execute previous commands, enhancing productivity. The `history` command provides a comprehensive log of all executed commands.
*   **Custom Commands**: PyBrowser introduces several custom commands tailored to its unique browser-based environment and integrated features:
    *   `py-run <file.py>`: Executes Python scripts directly within the Pyodide kernel.
    *   `wasm-compile <file.zig>`: Compiles WebAssembly-compatible binaries from languages like Zig, C, or C++.
    *   `ai-generate --query "..."`: Invokes the integrated Gemini AI to generate code, answer questions, or provide debugging assistance based on the provided query.
    *   `vfs-mount --persist`: Mounts the Virtual File System, enabling persistence of files and data across browser sessions.
    *   `kernel-switch <name>`: As described above, changes the active language kernel.
*   **Standard Unix-like Commands**: To provide a familiar experience for seasoned developers, PyBrowser includes implementations of many common Unix commands:
    *   `ls`, `pwd`, `cd`, `mkdir`, `rm`, `cat`, `touch`, `cp`, `mv`, `grep`, `find`, `locate`, `which`, `whereis`, `du`, `df`, `free`, `lsblk`, `watch`, `ps`, `kill`, `pkill`, `jobs`, `fg`, `bg`, `nice`, `renice`, `timeout`, `sleep`, `wait`, `git`, `echo`, `env`, `exit`, `clear`, `whoami`, `date`, `uptime`, `version`, `uname`, `top`, `netstat`, `run`, `serve`, `deploy`, `help`, `cls`, `neofetch`, `system-check`, `fortune`, `cowsay`, `weather`, `matrix`, `hack`, `joke`, `ping`, `kernel`.

### File Management

PyBrowser offers a comprehensive file management system that combines the power of a command-line interface with the convenience of a graphical user interface.

*   **File Explorer UI**: A sidebar-based file explorer provides a visual representation of the VFS. Users can:
    *   **Navigate**: Browse directories and files with ease.
    *   **Create**: Create new files and folders directly from the UI.
    *   **Delete**: Remove unwanted files or directories.
    *   **Rename**: Change the names of files and folders.
    *   **Upload/Download**: Seamlessly transfer files between the local machine and the PyBrowser VFS.
*   **Persistence with IndexedDB**: All changes made to files and directories within PyBrowser are automatically saved to the browser's IndexedDB, ensuring data persistence even if the browser tab is closed or the computer is restarted. This makes PyBrowser a reliable environment for long-term projects.

### Code Editor

An integrated, feature-rich code editor is central to PyBrowser's development capabilities, providing a comfortable and efficient coding experience.

*   **`react-simple-code-editor`**: The editor is built upon `react-simple-code-editor`, offering a lightweight yet powerful editing experience.
*   **Prism.js for Syntax Highlighting**: Integrates Prism.js to provide accurate and visually appealing syntax highlighting for all supported programming languages, making code easier to read and understand.
*   **Customizable Features**: Users can personalize their coding environment with several configurable options:
    *   **Font Size**: Adjust the text size to their preference.
    *   **Word Wrap**: Toggle word wrapping for better readability of long lines of code.
    *   **Line Numbers**: Display or hide line numbers in the editor gutter.
    *   **Auto-Save**: Enable automatic saving of file changes to prevent data loss.

### Data Lab

PyBrowser includes a dedicated "Data Lab" for data scientists and analysts, offering powerful tools for data loading, analysis, visualization, and manipulation.

*   **Data Loading and Analysis Commands**: A suite of commands facilitates data workflows:
    *   `data-load`: Loads datasets into the environment, supporting various formats (e.g., CSV, JSON).
    *   `data-head`: Displays the first few rows of a dataset, providing a quick overview.
    *   `data-stats`: Generates descriptive statistics for datasets, including mean, median, standard deviation, etc.
    *   `data-chart`: Creates various types of charts and visualizations from data.
    *   `data-clean`: Provides tools for data cleaning, such as handling missing values or removing duplicates.
    *   `data-export`: Exports processed data to different file formats.
    *   `df-query`: Allows for querying and filtering dataframes using SQL-like syntax or Python expressions.
*   **Charting Capabilities**: The Data Lab supports a variety of chart types for effective data visualization:
    *   **Line Charts**: For visualizing trends over time or continuous data.
    *   **Bar Charts**: For comparing categorical data.
    *   **Pie Charts**: For showing proportions of a whole.
    *   **Histograms**: For displaying the distribution of numerical data.
*   **Integration with Python Data Science Libraries**: Leveraging the Python kernel (Pyodide), PyBrowser implicitly supports popular data science libraries like NumPy, Pandas, and Matplotlib, enabling complex data manipulations and advanced statistical analysis.

### Imaging Operations

For tasks involving image processing and manipulation, PyBrowser provides a dedicated set of commands within its "Imaging Ops" module.

*   **Image Processing Commands**: A comprehensive list of commands for various image transformations:
    *   `img-bw`: Converts an image to black and white.
    *   `img-resize`: Resizes an image to specified dimensions.
    *   `img-sepia`: Applies a sepia tone filter to an image.
    *   `img-edge`: Detects and highlights edges in an image.
    *   `img-bright`: Adjusts the brightness of an image.
    *   `img-contrast`: Modifies the contrast of an image.
    *   `img-convert`: Converts an image from one format to another (e.g., PNG to JPEG).
    *   `img-magick`: Provides advanced image manipulation capabilities, potentially integrating with a WebAssembly version of ImageMagick.
    *   `img-clean`: Applies various cleaning filters to images, such as noise reduction.
    *   `pixel-peek`: Allows for inspecting individual pixel values and properties.
*   **Supported Formats**: PyBrowser supports common image formats like PNG, JPEG, WEBP, and potentially others, ensuring broad compatibility for image processing tasks.

### Math & Science Tools

PyBrowser includes a powerful suite of tools for mathematical computations, scientific analysis, and symbolic manipulation, catering to engineers, scientists, and students.

*   **Calculations**: Direct command-line access to advanced mathematical functions:
    *   `calc`: Performs basic and advanced arithmetic calculations.
    *   `solve`: Solves equations and systems of equations.
    *   `derivative`: Computes the derivative of mathematical expressions.
    *   `integral`: Calculates definite and indefinite integrals.
    *   `limit`: Evaluates the limit of functions.
*   **Matrix Operations**: Comprehensive support for linear algebra:
    *   `matrix-calc`: Performs various matrix operations (addition, subtraction, multiplication).
    *   `matrix-inv`: Computes the inverse of a matrix.
    *   `matrix-det`: Calculates the determinant of a matrix.
*   **Statistical Functions**: Tools for statistical analysis:
    *   `stat-mean`: Calculates the mean of a dataset.
    *   `stat-std`: Computes the standard deviation of a dataset.
*   **Unit Conversion**: Converts values between different units of measurement (`unit-conv`).
*   **Plotting**: Generates visualizations for mathematical functions:
    *   `plot-sin`: Plots sine waves.
    *   `plot-norm`: Plots normal distributions.
*   **Scientific Calculator UI**: A graphical scientific calculator interface complements the command-line tools, offering an intuitive way to perform complex calculations, manage variables, and view calculation history.

### Offline Security / Cryptography

PyBrowser provides robust features for offline security and cryptographic operations, ensuring the confidentiality and integrity of sensitive data.

*   **File Encryption/Decryption**: Commands for securing files:
    *   `crypto-gen`: Generates cryptographic keys.
    *   `crypto-enc`: Encrypts files using strong algorithms.
    *   `crypto-dec`: Decrypts previously encrypted files.
    *   `crypto-lock`: Locks access to encrypted files.
    *   `crypto-unlock`: Unlocks access to encrypted files.
*   **Hashing Utilities**: Tools for generating cryptographic hashes:
    *   `hash-md5`: Computes MD5 hashes.
    *   `hash-sha256`: Computes SHA-256 hashes.
*   **Password Generation**: `pass-gen` generates strong, random passwords.
*   **Base64 Encoding/Decoding**: `base64-enc` and `base64-dec` for encoding and decoding data.
*   **Secure File Handling**: Allows users to encrypt and decrypt files locally within the browser, ensuring that sensitive information remains protected and never leaves the client-side environment.

### Web Automation

PyBrowser integrates powerful web automation capabilities, enabling users to script and automate interactions with web pages directly from the terminal.

*   **Automation Commands**: A set of commands for controlling web interactions:
    *   `auto-scrape`: Scrapes data from web pages.
    *   `auto-bot`: Automates repetitive tasks on websites.
    *   `auto-macro`: Records and plays back user interactions as macros.
    *   `auto-device`: Simulates different device types (desktop, mobile, tablet) for responsive testing.
*   **CORS Handling**: `cors-set` command to manage Cross-Origin Resource Sharing settings, facilitating interaction with various web resources.
*   **Proxy Support**: `proxy-ping` for testing proxy connections and `proxyUrl` state for configuring proxy settings, enabling anonymous browsing or bypassing geo-restrictions.
*   **Macro Recording**: Users can record a sequence of actions (clicks, typing, navigation) on a web page and save them as macros for later playback, automating complex workflows.
*   **Automation Logs**: Detailed logs provide insights into automation script execution, aiding in debugging and monitoring.

### Networking Tools

PyBrowser provides essential networking utilities for diagnosing connectivity, managing ports, and interacting with web services.

*   **Network Commands**: Standard and custom commands for network management:
    *   `netstat`: Displays network connections, routing tables, interface statistics, etc.
    *   `ping`: Tests reachability of a host on an Internet Protocol (IP) network.
    *   `serve`: Starts a local web server to serve files from the VFS.
    *   `deploy`: Deploys web applications or static sites directly from PyBrowser.
*   **Active Ports Management**: The system tracks and displays active network ports, their associated processes, and status, providing visibility into network activity.
*   **Browser Integration**: Seamlessly integrates with the browser's networking capabilities, allowing for direct interaction with web resources and services.

### Machine Learning (Neural Center)

The "Neural Center" in PyBrowser offers a comprehensive environment for machine learning tasks, from model training to prediction and analysis.

*   **ML Commands**: Commands tailored for machine learning workflows:
    *   `ml-train`: Initiates the training process for machine learning models.
    *   `ml-predict`: Uses trained models to make predictions on new data.
    *   `ml-status`: Displays the current status and progress of ML tasks.
    *   `ml-reset`: Resets ML models or training states.
    *   `neural-sync`: Synchronizes neural network states or data.
    *   `gradient-check`: Performs gradient checking for neural networks.
    *   `loss-func`: Configures or analyzes loss functions.
    *   `tensor-map`: Visualizes tensor data or operations.
*   **Training Progress and Metrics**: Provides real-time feedback on training progress, including accuracy, loss, validation metrics, and estimated completion time.
*   **Data File Support**: Supports various data formats for ML tasks, including images, voice, links, ZIP archives, CSV, and JSON.
*   **Model Types**: Users can select from different machine learning model types:
    *   **Classifier**: For classification tasks.
    *   **Regressor**: For regression tasks.
    **Clustering**: For unsupervised learning and data grouping.
    *   **Neural**: For deep learning models.
*   **Model Management**: Allows for naming and managing different ML models (e.g., `model_v1.pkl`).

### Package Management

PyBrowser simplifies dependency management for Python projects through its integrated package manager.

*   **`pip` Commands**: Familiar `pip` commands are available for managing Python packages:
    *   `pip-install <package>`: Installs Python packages from PyPI.
    *   `pip-list`: Lists all installed Python packages.
    *   `pip-show <package>`: Displays information about an installed package.
    *   `pip-search <query>`: Searches for packages on PyPI.
    *   `pip-remove <package>`: Uninstalls Python packages.
*   **`lib-load`**: A custom command to load external libraries or modules into the current environment.

### System and Utility Commands

Beyond core development, PyBrowser includes a variety of system and utility commands for general use and system information.

*   **System Information**: `neofetch`, `system-check`, `uname`, `uptime`, `version`, `top`, `env`.
*   **Fun and Engagement**: `fortune`, `cowsay`, `weather`, `matrix`, `hack`, `joke`.
*   **Help and Navigation**: `help`, `cls` (clear screen).

## Roadmap 2026

PyBrowser is under continuous development, with an ambitious roadmap planned for 2026 to further enhance its capabilities and user experience.

*   **Q1: Parallel Execution**: Implementation of true parallel execution for tasks, leveraging Web Workers and SharedArrayBuffer to maximize performance and responsiveness for multi-threaded applications.
*   **Q2: GUI Support for X11 Apps**: Integration of a graphical user interface (GUI) layer to support X11 applications, enabling the execution of traditional desktop applications directly within the browser.
*   **Q3: Collaborative Sessions**: Development of features for real-time collaborative coding and project management, allowing multiple users to work on the same project simultaneously within PyBrowser.
*   **Q4: Multimodal AI Integration**: Further expansion of AI capabilities to include multimodal AI, enabling the processing and generation of content across various modalities such as text, images, audio, and video.

## Get Started

To begin your journey with Terminal OS (PyBrowser), follow these simple steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Quincunx33/PyBrowser
    ```
2.  **Navigate to the Project Directory**:
    ```bash
    cd PyBrowser
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    This will launch PyBrowser in your local development environment, typically accessible via `http://localhost:5173` or a similar address.

## GitHub Repository

For the latest updates, contributions, and to explore the codebase, visit the official GitHub repository:

[https://github.com/Quincunx33/PyBrowser](https://github.com/Quincunx33/PyBrowser)

## License

Terminal OS (PyBrowser) is released under the **MIT License**. This open-source license grants broad permissions for use, modification, and distribution, fostering community collaboration and innovation.

Terminal OS v2.0.4 - Built for modern engineers.

## References

[1] WebAssembly. (n.d.). *WebAssembly*. Retrieved from https://webassembly.org/
[2] MDN Web Docs. (n.d.). *SharedArrayBuffer*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
[3] Google AI. (n.d.). *Gemini API*. Retrieved from https://ai.google.dev/models/gemini
[4] React. (n.d.). *React – A JavaScript library for building user interfaces*. Retrieved from https://react.dev/
[5] Vite. (n.d.). *Vite | Next Generation Frontend Tooling*. Retrieved from https://vitejs.dev/
[6] TypeScript. (n.d.). *TypeScript - JavaScript With Syntax For Types*. Retrieved from https://www.typescriptlang.org/
[7] Tailwind CSS. (n.d.). *Tailwind CSS - A utility-first CSS framework for rapidly building custom designs*. Retrieved from https://tailwindcss.com/
[8] Framer. (n.d.). *Framer Motion*. Retrieved from https://www.framer.com/motion/
[9] Prism. (n.d.). *Prism - Lightweight, extensible syntax highlighter*. Retrieved from https://prismjs.com/
[10] Express. (n.d.). *Express - Node.js web application framework*. Retrieved from https://expressjs.com/
[11] Pyodide. (n.d.). *Pyodide*. Retrieved from https://pyodide.org/
[12] IndexedDB API. (n.d.). *MDN Web Docs*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
