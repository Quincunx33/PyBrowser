export interface KernelInfo {
  title: string;
  description: string;
  features: string[];
  useCases: string;
  longDescription: string;
  history: string;
  architecture: string;
  ecosystem: string;
}

export const KERNELS: Record<string, KernelInfo> = {
  python: {
    title: "Python 3.11",
    description: "The premier language for Data Science, AI, and rapid prototyping.",
    features: ["Dynamic Typing", "Extensive Standard Library", "WebAssembly (Pyodide)", "High-level Abstractions"],
    useCases: "Machine Learning, Data Analysis, Scripting, Backend Development",
    longDescription: "Python 3.11 represents a significant leap forward in performance and developer experience. As a high-level, interpreted language, it remains the gold standard for data science, artificial intelligence, and machine learning research. Its syntax is designed for maximum clarity, allowing developers to focus on solving complex problems rather than fighting intricacies of language implementation.",
    history: "Python was conceived in the late 1980s by Guido van Rossum at Centrum Wiskunde & Informatica (CWI) in the Netherlands as a successor to the ABC programming language. Since its first release in 1991, Python has evolved through three major versions. Python 2.0 (2000) introduced list comprehensions and garbage collection, while Python 3.0 (2008) brought major cleanups but required a significant transition for the community. Python 3.11, the version featured here, is notable for its speed improvements of up to 60% over previous iterations.",
    architecture: "Python operates on a virtual machine architecture. Source code is compiled into bytecode (.pyc files), which is then interpreted by the Python Virtual Machine (PVM). In our browser environment, we utilize Pyodide, which compiles the CPython interpreter into WebAssembly (WASM). This allows Python to interact directly with the browser's JavaScript environment while maintaining compatibility with C-based libraries like NumPy through a specialized foreign function interface.",
    ecosystem: "The Python Package Index (PyPI) hosts over 400,000 projects. Key pillars of the ecosystem include NumPy for numerical computing, Pandas for data analysis, Scikit-learn for machine learning, and TensorFlow/PyTorch for deep learning. For web development, frameworks like Django and Flask have defined how scalable backend services are built for over a decade."
  },
  javascript: {
    title: "JavaScript (ES2023+)",
    description: "The language of the web. Essential for modern, interactive applications.",
    features: ["Event-Driven", "Asynchronous Programming", "Huge Ecosystem", "First-class Functions"],
    useCases: "Frontend Web Development, Server-side (Node.js), Browser Extensions",
    longDescription: "JavaScript is the fundamental engine that powers the modern web. In this terminal environment, it serves as the ubiquitous language for interactive development. JavaScript's asynchronous capabilities, bolstered by modern Promises and async/await syntax, allow for highly concurrent and non-blocking operations.",
    history: "Created in 10 days by Brendan Eich at Netscape in 1995, JavaScript was originally intended to be a simple scripting language for non-professional programmers. However, with the rise of AJAX in the mid-2000s and the release of Chrome's V8 engine in 2008, it transformed into a high-performance language. The standardization under ECMAScript (ES6 in 2015) was a turning point for the language's modern era.",
    architecture: "JavaScript engines like V8 use Just-In-Time (JIT) compilation. They profile the code as it runs and compile hot paths into highly optimized machine code. In this terminal, JS runs in its native environment—the browser—giving it zero-overhead access to DOM APIs and browser-native capabilities like WebGL and WebUSB.",
    ecosystem: "The npm (Node Package Manager) ecosystem is the largest repository of software in human history. From frontend frameworks like React and Vue to utility libraries like Lodash and build tools like Vite, JavaScript offers a solution for every conceivable programming task. It is the only language that can truly run 'everywhere'—client, server, and IoT."
  },
  rust: {
    title: "Rust",
    description: "Systems programming language focused on safety and performance.",
    features: ["Memory Safety", "Zero-Cost Abstractions", "Fearless Concurrency", "Strict Type System"],
    useCases: "WASM Engine, Systems Programming, High-Performance Tools, Blockchain",
    longDescription: "Rust is a modern systems programming language that addresses the long-standing trade-off between memory safety and performance. Its unique ownership model, enforced by the compiler, ensures memory safety without the need for a garbage collector.",
    history: "Rust began as a personal project by Graydon Hoare at Mozilla in 2006. Mozilla began sponsoring the project in 2009 and announced it in 2010. Rust 1.0 was released in 2015, establishing its stability guarantees. It has since topped the list of 'most loved languages' in developer surveys for many consecutive years.",
    architecture: "Rust relies on an LLM-based compilation pipeline. Its most defining architectural feature is the 'Borrow Checker,' which manages memory allocation at compile-time. By utilizing affine types, Rust ensures that data is either uniquely owned or immutably shared, preventing data races and memory leaks at the hardware level.",
    ecosystem: "The Rust ecosystem is managed via Cargo, which handles dependency management, builds, and documentation. Key crates (libraries) include Serde for serialization, Rayon for data parallelism, and Tokio for asynchronous networking. Rust's growing popularity for WebAssembly development makes it a cornerstone of the future of the web."
  },
  c: {
    title: "C",
    description: "The foundational language for systems and low-level control.",
    features: ["Extremely Lightweight", "Direct Memory Access", "Minimalist", "High Portability"],
    useCases: "Kernel Development, Emulators, Embedded Systems, Hardware Drivers",
    longDescription: "C is the language that defined modern computing. It is the low-level bedrock upon which operating systems, compilers, and major infrastructure are built. It provides total control over every byte of your program's execution.",
    history: "Developed by Dennis Ritchie at Bell Labs between 1969 and 1973, C was created to rewrite the Unix operating system. Its design was influenced by the earlier language B. The publication of 'The C Programming Language' by Kernighan and Ritchie (K&R) in 1978 served as the original de facto standard.",
    architecture: "C is a procedural language that maps closely to machine instructions. It uses a manual memory management model where the programmer is responsible for allocation and deallocation (malloc/free). This lack of a runtime or garbage collector is what gives C its legendary performance and predictability.",
    ecosystem: "As the oldest widely-used high-level language, C's ecosystem is essentially 'all of computer science.' Virtually all modern operating systems (Linux, Windows, macOS) are written in C. It remains the universal 'glue' language, with almost every other language providing a way to interface with C libraries (C FFI)."
  },
  cpp: {
    title: "C++",
    description: "Object-oriented performance with low-level control.",
    features: ["High Performance", "Standard Template Library", "Zero-Cost Abstractions", "Generic Programming"],
    useCases: "Game Engines, Real-time Systems, Computational Tools, Browser Engines",
    longDescription: "C++ extends the foundational capabilities of C by introducing powerful object-oriented programming paradigms, generic programming, and one of the most comprehensive standard libraries in existence.",
    history: "Created by Bjarne Stroustrup at Bell Labs starting in 1979, C++ began as 'C with Classes.' It was designed to add Simula-style abstractions to C's performance. The first official version was released in 1985. Modern C++ (C++11, 14, 17, 20) has drastically changed the language with features like move semantics and smart pointers.",
    architecture: "C++ supports multiple programming paradigms: procedural, object-oriented, and generic (via templates). It is a compiled language that targets raw machine code. Its 'Zero-overhead principle' ensures that you don't pay in performance for the abstractions you don't use.",
    ecosystem: "The Standard Template Library (STL) provides essential containers and algorithms. Beyond that, C++ powers most of the software we use daily: Photoshop, Chrome, and game engines like Unreal Engine. It is the undisputed king of performance-oriented software development."
  },
  go: {
    title: "Go (Golang)",
    description: "Designed for simplicity, concurrency, and scalability.",
    features: ["Strongly Typed", "First-class Concurrency", "Fast Compilation", "Garbage Collected"],
    useCases: "Microservices, Networking, Cloud Infrastructure, DevOps Tools",
    longDescription: "Go is a language designed at Google to solve the challenges of building massively scalable, concurrent, and highly maintainable software. Its syntax is intentionally minimalist.",
    history: "Developed by Robert Griesemer, Rob Pike, and Ken Thompson at Google, Go was announced in 2009. It was designed to improve programming productivity in an era of multicore machines and large codebases. Its creators were veterans from the Bell Labs Unix and C teams.",
    architecture: "Go uses a statically-linked binary model and includes a small, highly efficient runtime that handles garbage collection and scheduling. Its most famous feature is 'Goroutines'—lightweight threads managed by the Go runtime rather than the OS, allowing millions of concurrent processes to run on a single machine.",
    ecosystem: "Go is the language of the 'Cloud Native' era. Docker, Kubernetes, and Terraform are all written in Go. Its focus on simplicity and high-performance networking has made it the default choice for backend infrastructure and cloud services."
  },
  csharp: {
    title: "C# (.NET)",
    description: "Robust, enterprise-grade language for scalable apps.",
    features: ["Static Typing", "Rich IDE Ecosystem", "Great Integration", "Modern Syntax"],
    useCases: "Enterprise Apps, Game Development (Unity), Web APIs, Desktop Software",
    longDescription: "C# is a highly robust, enterprise-grade language developed by Microsoft for the .NET ecosystem. It has evolved into a versatile powerhouse for modern software engineering.",
    history: "Led by Anders Hejlsberg (who also created Turbo Pascal and TypeScript), C# was launched in 2000 as part of the .NET initiative. Originally influenced by Java and C++, it has since introduced many pioneering features like LINQ and async/await that have been adopted by other languages.",
    architecture: "C# compiles to Common Intermediate Language (CIL), which is then JIT-compiled by the Common Language Runtime (CLR). This provides features like cross-language interoperability, advanced memory management, and security sandboxing while maintaining high performance.",
    ecosystem: "Supported by Microsoft and a huge open-source community, the NuGet package manager hosts thousands of libraries. The .NET framework (and now cross-platform .NET Core) provides everything needed for high-scale web services, desktop UI (WPF/MAUI), and 3D games (Unity)."
  },
  zig: {
    title: "Zig",
    description: "A modern alternative to C with safety and simplicity at its core.",
    features: ["Comptime", "No Hidden Allocators", "Interoperable with C", "No Runtime"],
    useCases: "Portable Libraries, Game Engines, Systems Tools, Compilers",
    longDescription: "Zig is a modern systems programming language that serves as a direct, cleaner, and safer alternative to C. It is designed to be as performant as C while mitigating common pitfalls.",
    history: "Zig was created by Andrew Kelley in 2016. It gained significant attention for its pragmatic approach to systems programming, focusing on fixing C's issues without the complexity of Rust or the overhead of a garbage collector.",
    architecture: "Zig has no hidden control flow and no hidden memory allocations. Its unique 'Comptime' feature allows for code generation and introspection at compile-time, replacing the need for complex preprocessors or macros. It can also act as a C/C++ compiler, making it an excellent build tool.",
    ecosystem: "Though young, the Zig ecosystem is rapidly growing in the systems programming world. Projects like the Bun runtime and various high-performance databases are being built in Zig. Its ability to seamlessly use existing C libraries makes it immediately useful in production."
  },
  ruby: {
    title: "Ruby",
    description: "Productivity-focused language with a elegant, readable syntax.",
    features: ["Object-Oriented", "Highly Readable", "Powerful Metaprogramming", "Dynamic"],
    useCases: "Web Development (Rails), Scripting, Automation, DevOps",
    longDescription: "Ruby is a language designed to make developers productive and happy. Its syntax is incredibly elegant, natural, and expressive.",
    history: "Created by Yukihiro 'Matz' Matsumoto in Japan, Ruby was released in 1995. Matz combined elements from Perl, Smalltalk, and Lisp to create a language that balanced functional and imperative programming. It became globally popular after the release of Ruby on Rails in 2005.",
    architecture: "The standard implementation (MRI) is an interpreted language running on the YARV virtual machine. Ruby is an 'everything is an object' language, where even numbers and classes are instance objects, providing a very consistent and flexible programming model.",
    ecosystem: "The RubyGems system is the heart of the ecosystem. Ruby on Rails remains one of the most powerful and productive web frameworks ever created, famously powering GitHub, Shopify, and Airbnb. Ruby also excels in automation with tools like Homebrew and Puppet."
  },
  php: {
    title: "PHP",
    description: "The backbone of server-side web development for decades.",
    features: ["HTML Integrated", "Extensive Frameworks", "Server-side Oriented", "Fast Deployment"],
    useCases: "Web Applications, CMSs (WordPress), Server-Side Logic",
    longDescription: "PHP has been a workhorse of the web for decades. Today’s PHP, with its modern frameworks and heavily typed features, is a mature environment for large-scale production.",
    history: "PHP was originally created in 1994 by Rasmus Lerdorf as a set of Common Gateway Interface (CGI) scripts in C. It evolved into a complete language over time. PHP 7 and 8 have brought massive performance improvements, comparable to Node.js and Java.",
    architecture: "PHP typically runs as a module within a web server or via CGI. It follows a shared-nothing architecture, where each request starts a fresh state, making it inherently scalable and easy to debug. Recent versions have added a JIT compiler to further boost performance.",
    ecosystem: "PHP powers over 75% of the web. Composer is its modern dependency manager. Frameworks like Laravel and Symfony have modernized PHP development, providing expressive syntax and robust tools for building complex APIs and monoliths."
  },
  typescript: {
    title: "TypeScript",
    description: "JavaScript with strong typing for scalable web applications.",
    features: ["Type Safety", "Great Tooling", "Easy Refactoring", "Interoperability"],
    useCases: "Large-scale Web Applications, Complex Frontend UI, Enterprise JS",
    longDescription: "TypeScript is the evolution of JavaScript that introduces a robust static type system, designed specifically for building large-scale, enterprise-ready applications.",
    history: "Developed by Microsoft and led by Anders Hejlsberg, TypeScript was first released in 2012. It was created to help developers build larger, more complex JavaScript applications. It has since become the 'industry standard' for frontend and Node.js development.",
    architecture: "TypeScript is a 'superset' of JavaScript. It doesn't run directly; it is 'transpiled' into standard JavaScript by the TypeScript compiler (tsc). This means it can run anywhere JS runs, while providing safety during the development phase.",
    ecosystem: "Virtually all modern JavaScript libraries now ship with TypeScript definitions. Frameworks like Angular are built entirely in TS, and it is the preferred language for most React and Next.js developers. It is essential for managing codebases in large teams."
  },
  kotlin: {
    title: "Kotlin",
    description: "Modern language running on the JVM, built for Android and beyond.",
    features: ["Concise", "Safe (null-safety)", "Great Interoperability", "Statically Typed"],
    useCases: "Android Development, Server-side Backend, Multiplatform, Desktop",
    longDescription: "Kotlin is a modern, statically typed language developed by JetBrains. It was created to improve upon Java's verbose syntax while guaranteeing null safety.",
    history: "Announced in 2011, Kotlin was designed to be faster to compile and more expressive than Java. In 2017, Google announced Kotlin as a first-class language for Android development, and in 2019, it became the preferred language for Android apps.",
    architecture: "Kotlin compiles to JVM bytecode, allowing it to run anywhere Java runs. It is designed to be 100% interoperable with Java, meaning developers can use Java libraries from Kotlin and vice versa. It also supports compilation to JavaScript and LLVM (Kotlin/Native).",
    ecosystem: "Kotlin is now the dominant language for Android. On the server side, frameworks like Ktor and Spring Boot support Kotlin natively. The Kotlin Multiplatform (KMP) initiative is currently revolutionizing how code is shared across iOS and Android."
  },
  dart: {
    title: "Dart",
    description: "Client-optimized language for fast UI development across all platforms.",
    features: ["Fast UI Rendering", "Strongly Typed", "Productive", "Hot Reload"],
    useCases: "Mobile App Development (Flutter), Web Dev, Desktop Apps",
    longDescription: "Dart is a language optimized specifically for building fast, beautiful, and interactive user interfaces using the Flutter framework.",
    history: "Released by Google in 2011, Dart was initially seen as a potential replacement for JavaScript. However, it found its true calling with the release of the Flutter UI framework in 2017, which propelled it into the mainstream for mobile app development.",
    architecture: "Dart features a double-compiler approach: it uses JIT (Just-In-Time) compilation for fast development (Hot Reload) and AOT (Ahead-Of-Time) compilation for high-performance production binaries. Its garbage collector is specifically optimized for high-frequency UI updates.",
    ecosystem: "The Dart ecosystem revolves around 'pub.dev', its package manager. Flutter is the primary driver of the language, being the most popular framework for cross-platform mobile development today. Dart is also increasingly used for high-performance web and CLI tools."
  },
  swift: {
    title: "Swift",
    description: "High-performance language from Apple for modern systems.",
    features: ["Type Safety", "Fast & Secure", "Expressive", "ARC Memory Management"],
    useCases: "iOS Development, macOS Systems Programming, Server-side Swift",
    longDescription: "Swift is the modern, powerful, and safe programming language from Apple. Designed to replace Objective-C, it is built for performance and safety.",
    history: "Developed at Apple beginning in 2010 and released in 2014, Swift was the result of a decade of research into language design. It was open-sourced in 2015, leading to its expansion into Linux and server-side environments.",
    architecture: "Swift uses the LLVM compiler and Automatic Reference Counting (ARC) for memory management. Unlike languages with garbage collectors, ARC removes the need for stop-the-world pauses, giving Swift predictable, low-latency performance characteristic of systems languages.",
    ecosystem: "Swift is the heart of development for iPhone, iPad, Mac, and Apple Watch. The Swift Package Manager (SPM) is integrated into Xcode and the CLI. Outside of Apple platforms, frameworks like Vapor allow Swift to be used for high-performance backend systems."
  },
  sql: {
    title: "SQL",
    description: "The standard for relational database management and querying.",
    features: ["Declarative", "Highly Efficient Querying", "Relational Model", "ACID Compliant"],
    useCases: "Database Management, Data Analysis, Backend Support, Business Intelligence",
    longDescription: "SQL (Structured Query Language) is the indispensable standard for managing and manipulating relational databases efficiently across all technological domains.",
    history: "SQL was developed at IBM by Donald D. Chamberlin and Raymond F. Boyce in the early 1970s based on Edgar F. Codd's relational model. It was standardized by ANSI in 1986 and has since become one of the most widely used and influential languages in the world.",
    architecture: "SQL is a declarative language, meaning you describe the 'what' and the database engine determines the 'how'. It operates on sets of data (tables) and provides a strong foundation for data integrity through constraints, triggers, and transactions.",
    ecosystem: "Every major database system—PostgreSQL, MySQL, SQLite, Oracle, SQL Server—uses a dialect of SQL. It is the language of business data, powering everything from bank transactions and global logistics to the personalized recommendation systems on social media."
  },
  terminalos: {
    title: "Terminal OS v2.0",
    description: "The next-generation browser-based operating system for cloud-native development.",
    features: ["WASM Execution", "Sandboxed Environment", "Virtual File System", "Multi-Kernel Support", "POSIX Emulation", "Real-time AI Integration"],
    useCases: "Cloud Development, Interactive Learning, High-Security Sandboxing, Legacy System Emulation",
    longDescription: "Terminal OS is a revolutionary computing environment built entirely on modern web standards. By leveraging WebAssembly, SharedArrayBuffer, and advanced browser capabilities, it provides a full-featured Unix-like environment directly in your navigation bar. It is designed for engineers, security researchers, and developers who need a disposable, secure, and highly performant workspace that travels with them. No installation, no configuration—just pure computational power in any browser, on any device.",
    history: "Terminal OS was conceived in 2024 as a response to the growing complexity of local development environments and the rise of cloud-computing. The goal was to bridge the gap between the flexibility of a local terminal and the accessibility of a web browser. After two years of intensive research into WebAssembly-to-OS mapping and virtual memory management, version 2.0 was released in 2026, introducing the multi-kernel architecture that allows 15+ different programming languages to run simultaneously within a single browser tab.",
    architecture: "The core of Terminal OS is built on a custom microkernel named 'Aether.' Aether handles the scheduling of WASM-compiled language runtimes and manages a robust virtual file system (VFS) that uses IndexedDB for persistent storage. Networking is handled via a specialized WebSocket proxy that emulates raw TCP/IP sockets, allowing standard CLI tools like curl and git to function as if they were running on a native Linux machine. The UI is built using React and Framer Motion, providing a 60FPS fluid experience even during heavy computational tasks.",
    ecosystem: "Terminal OS supports a vast ecosystem of over 500+ pre-compiled CLI utilities. It integrates seamlessly with popular IDEs, allowing you to sync your workspace between local machines and the cloud. The 'Terminal Market' allows developers to share custom scripts, kernel extensions, and environment configurations. With built-in AI assistance powered by Gemini, debugging and code generation are integrated into the core shell experience, making it the most advanced development platform ever created for the web."
  }
};
