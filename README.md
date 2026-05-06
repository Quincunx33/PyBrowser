# Terminal OS (PyBrowser) - The Next Generation Browser-Based Operating System

## Introduction

Terminal OS, known as PyBrowser on GitHub, is a revolutionary, browser-based operating system that brings a full-featured, Unix-like environment directly to your web browser. It uses WebAssembly (WASM), SharedArrayBuffer, and advanced browser technologies to deliver a powerful, private, and versatile computing experience.

PyBrowser aims to simplify development by removing common setup hurdles. You don't need to worry about Docker, virtual machines, or complex language installations. With PyBrowser, you can start coding, analyzing data, or managing systems instantly, right from your browser.

### Why Terminal OS (PyBrowser)?

PyBrowser offers several key advantages:

*   **Privacy-Centric Execution**: All your work, data, and applications run locally within your browser. This means your sensitive information never leaves your computer, ensuring maximum privacy and security.
*   **WASM-Powered Performance**: Thanks to WebAssembly, PyBrowser runs computationally intensive tasks at near-native speeds. This allows for smooth operation of complex applications and algorithms, making browser-based development highly efficient.
*   **Multi-Kernel Support**: PyBrowser supports over 16 programming languages simultaneously, including Python, C, Rust, Go, JavaScript, and more. This allows you to easily switch between languages or combine them in a single project.
*   **Zero-Friction Development**: Say goodbye to complex environment setups. PyBrowser provides an instant development experience. Just open your browser and start coding, compiling, and executing across multiple languages without any prior installations.
*   **Integrated AI Capabilities**: PyBrowser includes built-in Gemini AI integration for intelligent coding assistance, debugging support, and automated code generation, boosting your productivity.

## Architectural Overview

PyBrowser's architecture combines modern web technologies with innovative system design to create a seamless operating experience.

### Core Components

1.  **Aether Microkernel**: This is the central brain of Terminal OS, responsible for managing all processes within the browser. It handles:
    *   **Process Scheduling**: Efficiently allocates browser resources to running tasks and language kernels.
    *   **Inter-Kernel Communication (IKC)**: Allows different language kernels to communicate and exchange data seamlessly. For example, a Python script can interact with a C++ module.
    *   **Resource Management**: Oversees memory and CPU usage to ensure optimal performance.

2.  **Virtual File System (VFS)**: PyBrowser uses a Virtual File System for managing files, similar to a traditional operating system. Key features include:
    *   **IndexedDB Integration**: Your files, code, and project data are saved locally using the browser's IndexedDB. This means your data persists across sessions, even if you close and reopen PyBrowser.
    *   **Standard File Operations**: Supports common Unix-like commands such as `ls`, `cd`, `mkdir`, `rm`, `cat`, `touch`, `cp`, `mv`, `grep`, and `find` for easy file management.
    *   **File Explorer UI**: A graphical file explorer provides an intuitive way to navigate, create, delete, rename, upload, and download files and folders.

3.  **Socket Proxy**: To interact with external services, PyBrowser uses a secure Socket Proxy. This component:
    *   **Bridges CLI Tools**: Allows PyBrowser to securely connect with external services and traditional command-line tools that run outside the browser.
    *   **Security and Isolation**: Ensures that external interactions are controlled and secure, protecting your local browser environment.

4.  **AI-Ready Infrastructure**: PyBrowser is built with AI at its core, offering deep integration with advanced AI models:
    *   **Gemini AI Integration**: Incorporates Google's Gemini AI for various intelligent functions:
        *   **Coding Assistance**: Provides smart code suggestions, auto-completion, and error detection.
        *   **Debugging Support**: Helps identify and fix code issues with explanations and potential solutions.
        *   **Automated Code Generation**: Generates code snippets or scripts from natural language prompts.
        *   **Data Analysis Insights**: Assists in interpreting data and suggesting visualizations.

### Frontend Technologies

PyBrowser's user interface is built using a modern and efficient frontend stack:

*   **React**: A JavaScript library for building dynamic and responsive user interfaces.
*   **Vite**: A fast frontend tooling that provides instant server start and quick Hot Module Replacement (HMR) for efficient development.
*   **TypeScript**: A superset of JavaScript that adds static typing, improving code quality and maintainability.
*   **Tailwind CSS**: A utility-first CSS framework for rapid and customizable UI development.
*   **Motion (Framer Motion)**: A React library for smooth and engaging animations.
*   **Prism.js**: A lightweight syntax highlighter for clear and readable code presentation in the editor.

### Backend (server.ts)

While PyBrowser primarily runs client-side, a minimal backend (`server.ts`) handles specific functionalities, especially during development and for external interactions:

*   **Express**: A Node.js web framework for creating server-side logic, handling API requests, and serving static assets.
*   **TSX**: Allows running TypeScript files directly without compilation, simplifying backend development.
*   **Dotenv**: Loads environment variables from a `.env` file, keeping sensitive configurations secure.

## Core Features in Detail

PyBrowser offers a wide range of features for developers, data scientists, and anyone needing a powerful browser-based computing environment.

### Multi-Kernel Language Support

PyBrowser's ability to integrate and execute multiple programming languages is a key innovation. This is managed through optimized language kernels.

*   **Supported Languages**: PyBrowser supports over 16 languages, providing great flexibility:
    *   **Python**: For data science, machine learning, and scripting.
    *   **C**: For low-level programming and performance-critical applications.
    *   **Rust**: For systems programming and high-performance computing.
    *   **Go**: For concurrent programming and scalable applications.
    *   **JavaScript**: For web development and interactive UIs.
    *   **C++**: For high-performance applications and game development.
    *   **C#**: For enterprise applications and game development (Unity).
    *   **Zig**: A modern systems programming language focused on robustness.
    *   **Ruby**: For web development (Rails) and scripting.
    *   **PHP**: For web development and server-side scripting.
    *   **TypeScript**: For scalable JavaScript applications.
    *   **Kotlin**: For Android development and server-side applications.
    *   **Dart**: For cross-platform mobile (Flutter) and web development.
    *   **Swift**: For iOS/macOS development.
    *   **SQL**: For database querying and management.

*   **Inter-Kernel Interaction**: The Aether Microkernel allows languages to run concurrently and interact. For example:
    *   Calling Python functions from JavaScript.
    *   Passing data between C and Rust modules.
    *   Executing SQL queries from Python and processing results in JavaScript.

*   **`kernel-switch <name>` Command**: Change the active language kernel in the terminal. This sets the default language for subsequent commands without restarting the environment.
    ```bash
    # Switch to Python kernel
    kernel-switch python
    # Now, any code you run will be interpreted as Python
    
    # Switch to JavaScript kernel
    kernel-switch javascript
    # Now, any code you run will be interpreted as JavaScript
    ```

### Terminal Functionality

PyBrowser's terminal offers a rich set of commands and features similar to a Unix-like shell.

*   **Input/Output Handling**: A responsive interface for command input, displaying output, errors, and system messages clearly.
*   **Command History**: Easily recall and re-execute previous commands. Use the `history` command to view a log of all executed commands.
    ```bash
    # View command history
    history
    ```
*   **Custom Commands**: PyBrowser includes specific commands for its browser-based environment:
    *   `py-run <file.py>`: Executes Python scripts.
        ```bash
        # Example: Run a Python script named my_script.py
        py-run my_script.py
        ```
    *   `wasm-compile <file.zig>`: Compiles WebAssembly-compatible binaries from languages like Zig, C, or C++.
        ```bash
        # Example: Compile a Zig file named my_program.zig
        wasm-compile my_program.zig
        ```
    *   `ai-generate --query "..."`: Uses Gemini AI for code generation, questions, or debugging.
        ```bash
        # Example: Ask AI to generate a Python function
        ai-generate --query "Generate a Python function to calculate factorial"
        ```
    *   `vfs-mount --persist`: Mounts the Virtual File System to save files across browser sessions.
        ```bash
        # Mount VFS for persistent storage
        vfs-mount --persist
        ```
*   **Standard Unix-like Commands**: Familiar commands for experienced users:
    *   `ls`: List directory contents.
        ```bash
        # List files in the current directory
        ls
        # List all files including hidden ones
        ls -a
        ```
    *   `cd <directory>`: Change directory.
        ```bash
        # Go to the 'src' directory
        cd src
        # Go back to the parent directory
        cd ..
        ```
    *   `mkdir <directory_name>`: Create a new directory.
        ```bash
        # Create a new directory named 'my_project'
        mkdir my_project
        ```
    *   `rm <file_or_directory>`: Remove files or directories.
        ```bash
        # Remove a file named 'old_file.txt'
        rm old_file.txt
        # Remove a directory and its contents (use with caution!)
        rm -rf my_project
        ```
    *   `cat <file>`: Display file content.
        ```bash
        # Display the content of 'README.md'
        cat README.md
        ```
    *   `touch <file_name>`: Create an empty file.
        ```bash
        # Create a new empty file named 'new_script.py'
        touch new_script.py
        ```
    *   `cp <source> <destination>`: Copy files or directories.
        ```bash
        # Copy 'file.txt' to 'backup/file.txt'
        cp file.txt backup/file.txt
        ```
    *   `mv <source> <destination>`: Move or rename files or directories.
        ```bash
        # Rename 'old_name.txt' to 'new_name.txt'
        mv old_name.txt new_name.txt
        ```
    *   `grep <pattern> <file>`: Search for patterns in files.
        ```bash
        # Find lines containing 'function' in 'main.tsx'
        grep function src/main.tsx
        ```
    *   `find <path> -name <pattern>`: Find files and directories.
        ```bash
        # Find all Python files in the current directory and its subdirectories
        find . -name "*.py"
        ```
    *   `clear` or `cls`: Clear the terminal screen.
        ```bash
        # Clear the terminal
        clear
        ```

### File Management

PyBrowser offers both command-line and graphical file management.

*   **File Explorer UI**: A sidebar file explorer allows you to:
    *   **Navigate**: Browse directories and files visually.
    *   **Create**: Make new files and folders.
    *   **Delete**: Remove files or directories.
    *   **Rename**: Change file and folder names.
    *   **Upload/Download**: Transfer files between your computer and PyBrowser.
*   **Persistence with IndexedDB**: All file changes are automatically saved to your browser's IndexedDB, ensuring data persistence even if you close the browser.

### Code Editor

PyBrowser includes an integrated code editor for an efficient coding experience.

*   **`react-simple-code-editor`**: A lightweight yet powerful editor.
*   **Prism.js for Syntax Highlighting**: Provides clear and readable syntax highlighting for all supported languages.
*   **Customizable Features**: Personalize your editor:
    *   **Font Size**: Adjust text size.
    *   **Word Wrap**: Toggle word wrapping for long lines.
    *   **Line Numbers**: Show or hide line numbers.
    *   **Auto-Save**: Enable automatic saving of file changes.

### Data Lab

PyBrowser's "Data Lab" provides tools for data loading, analysis, visualization, and manipulation.

*   **Data Loading and Analysis Commands**:
    *   `data-load <file>`: Load datasets (e.g., CSV, JSON).
        ```bash
        # Load a CSV file named 'sales_data.csv'
        data-load sales_data.csv
        ```
    *   `data-head`: Display the first few rows of a dataset.
        ```bash
        # Show the first 5 rows of the loaded data
        data-head
        ```
    *   `data-stats`: Generate descriptive statistics.
        ```bash
        # Get statistical summary of the data
        data-stats
        ```
    *   `data-chart <type> <x_column> <y_column>`: Create charts (line, bar, pie, hist).
        ```bash
        # Create a bar chart of 'product' vs 'sales'
        data-chart bar product sales
        ```
    *   `data-clean`: Tools for data cleaning (e.g., handling missing values).
    *   `data-export <file>`: Export processed data.
    *   `df-query <query_expression>`: Query dataframes using SQL-like syntax or Python expressions.
        ```bash
        # Filter data where 'sales' is greater than 1000
        df-query "sales > 1000"
        ```
*   **Charting Capabilities**: Supports line, bar, pie, and histograms for effective data visualization.
*   **Integration with Python Data Science Libraries**: Implicitly supports libraries like NumPy, Pandas, and Matplotlib through Pyodide for advanced analysis.

### Imaging Operations

PyBrowser's "Imaging Ops" module provides commands for image processing and manipulation.

*   **Image Processing Commands**:
    *   `img-bw <image_file>`: Convert to black and white.
        ```bash
        # Convert 'photo.jpg' to black and white
        img-bw photo.jpg
        ```
    *   `img-resize <image_file> <width> <height>`: Resize an image.
        ```bash
        # Resize 'image.png' to 800x600 pixels
        img-resize image.png 800 600
        ```
    *   `img-sepia <image_file>`: Apply sepia tone.
    *   `img-edge <image_file>`: Detect edges.
    *   `img-bright <image_file> <value>`: Adjust brightness.
    *   `img-contrast <image_file> <value>`: Adjust contrast.
    *   `img-convert <image_file> <format>`: Convert image format (e.g., PNG to JPEG).
        ```bash
        # Convert 'image.png' to 'image.jpeg'
        img-convert image.png jpeg
        ```
    *   `img-magick <command> <image_file>`: Advanced image manipulation.
    *   `img-clean <image_file>`: Apply cleaning filters.
    *   `pixel-peek <image_file> <x> <y>`: Inspect pixel values.
*   **Supported Formats**: Supports common image formats like PNG, JPEG, WEBP.

### Math & Science Tools

PyBrowser includes powerful tools for mathematical computations and scientific analysis.

*   **Calculations**:
    *   `calc <expression>`: Perform arithmetic calculations.
        ```bash
        # Calculate 5 + 3 * 2
        calc "5 + 3 * 2"
        ```
    *   `solve <equation>`: Solve equations.
        ```bash
        # Solve for x: x^2 - 4 = 0
        solve "x^2 - 4 = 0"
        ```
    *   `derivative <expression> <variable>`: Compute derivatives.
    *   `integral <expression> <variable>`: Calculate integrals.
    *   `limit <expression> <variable> <value>`: Evaluate limits.
*   **Matrix Operations**:
    *   `matrix-calc <operation> <matrix1> <matrix2>`: Perform matrix operations.
    *   `matrix-inv <matrix>`: Compute inverse of a matrix.
    *   `matrix-det <matrix>`: Calculate determinant of a matrix.
*   **Statistical Functions**:
    *   `stat-mean <data_list>`: Calculate mean.
    *   `stat-std <data_list>`: Compute standard deviation.
*   **Unit Conversion**: `unit-conv <value> <from_unit> <to_unit>`: Convert units.
    ```bash
    # Convert 100 meters to feet
    unit-conv 100 m ft
    ```
*   **Plotting**:
    *   `plot-sin`: Plot sine waves.
    *   `plot-norm`: Plot normal distributions.
*   **Scientific Calculator UI**: A graphical interface for complex calculations, variable management, and history.

### Offline Security / Cryptography

PyBrowser provides features for offline security and cryptographic operations.

*   **File Encryption/Decryption**:
    *   `crypto-gen`: Generate cryptographic keys.
    *   `crypto-enc <file> <key>`: Encrypt files.
        ```bash
        # Encrypt 'secret.txt' with a generated key
        crypto-enc secret.txt my_secret_key
        ```
    *   `crypto-dec <file> <key>`: Decrypt files.
    *   `crypto-lock <file>`: Lock access to encrypted files.
    *   `crypto-unlock <file>`: Unlock access to encrypted files.
*   **Hashing Utilities**:
    *   `hash-md5 <file>`: Compute MD5 hashes.
    *   `hash-sha256 <file>`: Compute SHA-256 hashes.
*   **Password Generation**: `pass-gen`: Generate strong passwords.
    ```bash
    # Generate a strong password
    pass-gen
    ```
*   **Base64 Encoding/Decoding**: `base64-enc <text>` and `base64-dec <encoded_text>`.

### Web Automation

PyBrowser integrates web automation capabilities to script interactions with web pages.

*   **Automation Commands**:
    *   `auto-scrape <url> <selector>`: Scrape data from web pages.
        ```bash
        # Scrape all h1 tags from example.com
        auto-scrape https://example.com h1
        ```
    *   `auto-bot <script_file>`: Automate repetitive tasks on websites.
    *   `auto-macro <record|play> <macro_name>`: Record and play back user interactions.
        ```bash
        # Start recording a macro named 'login_flow'
        auto-macro record login_flow
        # ... perform actions in the browser ...
        # Stop recording
        auto-macro stop login_flow
        # Play back the recorded macro
        auto-macro play login_flow
        ```
    *   `auto-device <type>`: Simulate different device types (desktop, mobile, tablet).
*   **CORS Handling**: `cors-set <origin>`: Manage Cross-Origin Resource Sharing settings.
*   **Proxy Support**: `proxy-ping <url>` for testing proxy connections.

### Networking Tools

Essential networking utilities for connectivity diagnosis and web service interaction.

*   **Network Commands**:
    *   `netstat`: Display network connections.
    *   `ping <host>`: Test host reachability.
        ```bash
        # Ping google.com
        ping google.com
        ```
    *   `serve <port>`: Start a local web server.
        ```bash
        # Start a web server on port 8000
        serve 8000
        ```
    *   `deploy <app_name>`: Deploy web applications or static sites.
*   **Active Ports Management**: Tracks active network ports and their processes.

### Machine Learning (Neural Center)

PyBrowser's "Neural Center" offers a comprehensive environment for machine learning tasks.

*   **ML Commands**:
    *   `ml-train <model_name> <data_file>`: Initiate model training.
        ```bash
        # Train a model named 'my_classifier' with 'training_data.csv'
        ml-train my_classifier training_data.csv
        ```
    *   `ml-predict <model_name> <input_data>`: Make predictions with trained models.
    *   `ml-status`: Display status and progress of ML tasks.
    *   `ml-reset <model_name>`: Reset ML models or training states.
    *   `neural-sync`: Synchronize neural network states.
    *   `gradient-check`: Perform gradient checking.
    *   `loss-func <function_name>`: Configure loss functions.
    *   `tensor-map`: Visualize tensor data.
*   **Training Progress and Metrics**: Real-time feedback on training progress (accuracy, loss, etc.).
*   **Data File Support**: Supports images, voice, links, ZIP, CSV, and JSON for ML tasks.
*   **Model Types**: Select from classifier, regressor, clustering, or neural models.

### Package Management

PyBrowser simplifies dependency management for Python projects.

*   **`pip` Commands**:
    *   `pip-install <package>`: Install Python packages.
        ```bash
        # Install the 'numpy' package
        pip-install numpy
        ```
    *   `pip-list`: List installed Python packages.
    *   `pip-show <package>`: Display package information.
    *   `pip-search <query>`: Search for packages on PyPI.
    *   `pip-remove <package>`: Uninstall Python packages.
*   **`lib-load <library_name>`**: Load external libraries or modules.

### System and Utility Commands

Various system and utility commands for general use.

*   **System Information**: `neofetch`, `system-check`, `uname`, `uptime`, `version`, `top`, `env`.
*   **Fun and Engagement**: `fortune`, `cowsay`, `weather`, `matrix`, `hack`, `joke`.
*   **Help and Navigation**: `help`, `cls` (clear screen).

## Roadmap 2026

PyBrowser is continuously evolving with an ambitious roadmap for 2026:

*   **Q1: Parallel Execution**: Implement true parallel execution using Web Workers and SharedArrayBuffer for multi-threaded applications.
*   **Q2: GUI Support for X11 Apps**: Integrate a GUI layer to support traditional X11 desktop applications within the browser.
*   **Q3: Collaborative Sessions**: Develop features for real-time collaborative coding and project management.
*   **Q4: Multimodal AI Integration**: Expand AI capabilities to include multimodal AI for processing and generating text, images, audio, and video.

## Get Started

To start using Terminal OS (PyBrowser), follow these steps:

1.  **Clone the Repository**: First, you need to get a copy of the project files to your local machine. Open your terminal or command prompt and run:
    ```bash
    git clone https://github.com/Quincunx33/PyBrowser
    ```
    *What this does*: This command downloads the entire PyBrowser project from GitHub to a new folder named `PyBrowser` on your computer.

2.  **Navigate to the Project Directory**: After cloning, move into the newly created project folder:
    ```bash
    cd PyBrowser
    ```
    *What this does*: `cd` stands for "change directory". This command takes you inside the `PyBrowser` folder so you can work with its files.

3.  **Install Dependencies**: PyBrowser relies on several external libraries and tools. Install them using npm (Node Package Manager):
    ```bash
    npm install
    ```
    *What this does*: This command reads the `package.json` file in the `PyBrowser` folder and downloads all necessary project dependencies (like React, Vite, etc.). This might take a few moments.

4.  **Start the Development Server**: Once dependencies are installed, you can start PyBrowser in your local development environment:
    ```bash
    npm run dev
    ```
    *What this does*: This command starts a local web server that hosts PyBrowser. You will usually see a message in your terminal indicating the address where it's running, typically `http://localhost:5173` or a similar URL. Open this URL in your web browser to access PyBrowser.

## GitHub Repository

For the latest updates, contributions, and to explore the codebase, visit the official GitHub repository:

[https://github.com/Quincunx33/PyBrowser](https://github.com/Quincunx33/PyBrowser)

## License

Terminal OS (PyBrowser) is released under the **MIT License**. This open-source license allows for broad use, modification, and distribution, encouraging community collaboration.

Terminal OS v2.0.4 - Built for modern engineers.
