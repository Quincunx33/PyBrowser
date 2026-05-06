export const KERNELS: Record<string, { title: string; description: string; features: string[]; useCases: string; longDescription: string; }> = {
  python: {
    title: "Python 3.11",
    description: "The premier language for Data Science, AI, and rapid prototyping.",
    features: ["Dynamic Typing", "Extensive Standard Library", "WebAssembly (Pyodide)"],
    useCases: "Machine Learning, Data Analysis, Scripting",
    longDescription: "Python 3.11 represents a significant leap forward in performance and developer experience. As a high-level, interpreted language, it remains the gold standard for data science, artificial intelligence, and machine learning research. Its syntax is designed for maximum clarity, allowing developers to focus on solving complex problems rather than fighting intricacies of language implementation. Within this browser terminal environment, we leverage Pyodide—a port of CPython to WebAssembly—to allow you to execute Python code seamlessly within the sandbox without requiring any backend server infrastructure. This enables near-native performance for data manipulation tasks, utilizing powerful libraries like NumPy, Pandas, and Matplotlib directly in the client-side browser. Whether you are building complex neural network models, exploratory data visualizations, or just automating simple system tasks, Python provides the robustness and the massive ecosystem required for the job. Its strong emphasis on community-driven development has resulted in libraries for virtually every technological domain, from web scraping and backend development to scientific computing and distributed systems."
  },
  javascript: {
    title: "JavaScript",
    description: "The language of the web. Essential for modern, interactive applications.",
    features: ["Event-Driven", "Asynchronous Programming", "Huge Ecosystem"],
    useCases: "Web Development, Serverless Functions, Browser Automation",
    longDescription: "JavaScript is the fundamental engine that powers the modern web. In this terminal environment, it serves as the ubiquitous language for interactive development. JavaScript's asynchronous capabilities, bolstered by modern Promises and async/await syntax, allow for highly concurrent and non-blocking operations, making it ideally suited for the browser environment. Our terminal utilizes the built-in JavaScript engine to offer you a robust environment for scripting, building browser-based tools, and managing complex application state. JavaScript's reach has expanded far beyond the client-side with the availability of vast npm repositories and tools that allow you to package, test, and deploy applications with ease. Understanding JavaScript is key to mastering the full-stack paradigm, and in this terminal, you can experiment directly with DOM manipulation, API interactions, and advanced frontend modularity at lightning speed. It is the language that bridges the gap between raw data manipulation and visual, interactive user interfaces, allowing you to build comprehensive tools entirely within the terminal interface."
  },
  rust: {
    title: "Rust",
    description: "Systems programming language focused on safety and performance.",
    features: ["Memory Safety", "Zero-Cost Abstractions", "Fearless Concurrency"],
    useCases: "WASM Engine, Systems Programming, High-Performance Tools",
    longDescription: "Rust is a modern systems programming language that addresses the long-standing trade-off between memory safety and performance. Its unique ownership model, enforced by the compiler, ensures memory safety without the need for a garbage collector, which is revolutionary for systems programming. This makes Rust a powerhouse for writing performance-critical WASM modules that can run at near-native speed in this browser environment. Rust's 'fearless concurrency' means you can write multi-threaded code with the confidence that you will not encounter data races or typical memory-related crashes. Within our TerminalOS, Rust is utilized to construct high-performance backend-emulating modules, CLI utilities, and WASM-based compilers for other languages. It is the language of choice for building infrastructure that needs to be both incredibly fast and rock-solid secure. By learning Rust, you gain a deep understanding of memory management, low-level data structures, and the advanced paradigms required to build systems that scale."
  },
  c: {
    title: "C",
    description: "The foundational language for systems and low-level control.",
    features: ["Extremely Lightweight", "Direct Memory Access", "Minimalist"],
    useCases: "Kernel Development, Emulators, Embedded Systems",
    longDescription: "C is the language that defined modern computing. It is the low-level bedrock upon which operating systems, compilers, and major infrastructure are built. Despite being decades old, its importance remains unmatched for deep systems integration, resource-constrained environments, and performance-critical applications. In our terminal OS, C provides a lens into how systems actually communicate with hardware and manage memory. It empowers you to interact at the closest possible level with system resources. While it lacks the high-level memory safety features of modern languages like Rust or Python, it provides unparalleled performance and total control over every byte of your program's execution. Within this sandbox, C is used for emulators, low-level data structure manipulation, and performance-intensive computational modules. It is the ultimate tool for engineers who want to understand the mechanics of the computer itself, stripping away layers of abstraction to reveal the raw logic operating at the machine level."
  },
  cpp: {
    title: "C++",
    description: "Object-oriented performance with low-level control.",
    features: ["High Performance", "Standard Template Library", "Zero-Cost Abstractions"],
    useCases: "Game Engines, Real-time Systems, Computational Tools",
    longDescription: "C++ extends the foundational capabilities of C by introducing powerful object-oriented programming paradigms, generic programming, and one of the most comprehensive standard libraries in existence. It is the primary tool for building high-performance software that demands complex architectural structure—such as game engines, real-time control systems, and heavy-duty computational simulations. The key concept of C++ is 'zero-cost abstractions,' meaning that powerful features like classes, templates, and inheritance provide clean, reusable code without significantly sacrificing the raw performance of the underlying binary. Inside the browser terminal, C++ modules leverage WASM compilation targets to bridge the gap between high-level logic and high-speed execution. Whether you are building complex physics engines, visual processing libraries, or performance-critical system tools, C++ provides the architectural versatility and the machine-level performance to make these projects a reality, effectively handling the complexities of large-scale software systems."
  },
  go: {
    title: "Go (Golang)",
    description: "Designed for simplicity, concurrency, and scalability.",
    features: ["Strongly Typed", "First-class Concurrency", "Fast Compilation"],
    useCases: "Microservices, Networking, Cloud Infrastructure",
    longDescription: "Go is a language designed at Google to solve the challenges of building massively scalable, concurrent, and highly maintainable software. Its syntax is intentionally minimalist, favoring readability and simplicity over complex language features. Go's defining feature is its first-class concurrency model, represented by goroutines and channels, which make writing robust, multi-threaded applications significantly easier than in traditional languages. This makes Go the standard for cloud-native infrastructure, high-performance web servers, and complex microservice architectures. Inside our terminal environment, Go's fast compilation and statically linked binaries serve as an excellent base for creating portable, fast-running system utilities and networking tools. By focusing on productivity, developer happiness, and operational simplicity, Go has quickly become an essential tool in a modern engineer's toolkit. It handles modern concurrency patterns without the complexity, ensuring that you can build scalable backend-oriented logic with clarity and efficiency."
  },
  csharp: {
    title: "C# (.NET)",
    description: "Robust, enterprise-grade language for scalable apps.",
    features: ["Static Typing", "Rich IDE Ecosystem", "Great Integration"],
    useCases: "Enterprise Apps, Game Development (Unity), Web APIs",
    longDescription: "C# is a highly robust, enterprise-grade language developed by Microsoft for the .NET ecosystem. Over the years, it has evolved into a versatile powerhouse capable of building everything from high-performance web APIs and secure enterprise applications to immersive 3D games within the Unity engine. C# combines statically typed, memory-safe development with a garbage-collected runtime, offering a balance between performance and rapid development speed. It provides an extensive ecosystem of libraries and frameworks, making it a reliable choice for long-term project viability. In this terminal environment, C# is supported for its capability in building complex enterprise systems and interacting seamlessly with modern framework patterns. It is an excellent choice for developers who require a strongly typed environment, rich tooling support, and the ability to build large-scale applications with clear, maintainable architecture. Its balance of power, productivity, and modern features makes it a cornerstone of the professional software engineering landscape."
  },
  zig: {
    title: "Zig",
    description: "A modern alternative to C with safety and simplicity at its core.",
    features: ["Comptime", "No Hidden Allocators", "Interoperable with C"],
    useCases: "Portable Libraries, Game Engines, Systems Tools",
    longDescription: "Zig is a modern systems programming language that serves as a direct, cleaner, and safer alternative to C. It is designed to be as performant as C while mitigating the most common pitfalls that have historically plagued systems developers. Its defining feature is 'comptime,' which allows code to be executed during compilation, enabling extremely powerful, type-safe metaprogramming without the pitfalls of C++ templates. Zig also guarantees no hidden memory allocations, ensuring that all memory management is explicit and clearly visible in the code, which is crucial for building predictable systems. Within this terminal, Zig is used as a highly efficient tool for creating portable system-level libraries, high-speed CLI utilities, and performance-critical WASM modules. Its seamless interoperability with C makes it an effortless plug-in for legacy systems while giving you the benefits of modern safety and compile-time capabilities. Zig is rapidly becoming a favorite among systems engineering aficionados who value absolute control with the pragmatic benefits of modern language design."
  },
  ruby: {
    title: "Ruby",
    description: "Productivity-focused language with a elegant, readable syntax.",
    features: ["Object-Oriented", "Highly Readable", "Powerful Metaprogramming"],
    useCases: "Web Development (Rails), Scripting, Automation",
    longDescription: "Ruby is a language designed by Yukihiro Matsumoto to make developers productive and happy. Its syntax is incredibly elegant, natural, and expressive, reading more like a human language than typical code. Ruby is deeply object-oriented, meaning that virtually everything interacting in a Ruby program is an object, encouraging modular and clean code architecture. It is famously known for its powerful metaprogramming capabilities, which allow developers to write highly flexible code that can dynamically alter its own structure, a technique championed by frameworks like Ruby on Rails. Within our terminal environment, Ruby serves as an excellent tool for rapid scripting, file automation, and building small, expressive web tools. It allows for incredibly quick proof-of-concept development, meaning you can take a complex idea and turn it into a working script in remarkably short time. Ruby's focus is on developer experience, making it perfect for tasks where the clarity of the solution and the speed of development are paramount."
  },
  php: {
    title: "PHP",
    description: "The backbone of server-side web development for decades.",
    features: ["HTML Integrated", "Extensive Frameworks", "Server-side Oriented"],
    useCases: "Web Applications, CMSs, Server-Side Logic",
    longDescription: "PHP has been a workhorse of the web for decades, powering everything from personal blogs to the most complex enterprise-level dynamic web applications. PHP’s strengths lie in its deep integration with the web’s core infrastructure and its ease of deployment. Its server-side nature allows it to process requests, interact with databases, and dynamically generate HTML with incredible speed. Today’s PHP, with its modern frameworks and heavily typed features, is far removed from its early script-based beginnings. It provides a robust, mature environment for handling complex server-side logic in a request-response architecture. Within this browser environment, PHP is supported for engineers needing to test server-side logic, data ingestion, and building dynamic content processors. It remains an vital skill for any engineer operating in the web sphere, providing the reliability, the massive community support, and the established tooling that make maintaining long-term web applications manageable and scalable."
  },
  typescript: {
    title: "TypeScript",
    description: "JavaScript with strong typing for scalable web applications.",
    features: ["Type Safety", "Great Tooling", "Easy Refactoring"],
    useCases: "Large-scale Web Applications, Complex Frontend UI",
    longDescription: "TypeScript is the evolution of JavaScript that introduces a robust static type system, designed specifically for building large-scale, enterprise-ready web applications. It transforms the occasionally unpredictable nature of JavaScript into a structured, highly predictable language. TypeScript catches errors at compile-time that would otherwise only appear at runtime, significantly reducing the amount of debugging required. Its rich type system allows for highly expressive APIs and deep integration with powerful IDEs, leading to unmatched developer productivity through intelligent code completion, safe refactoring, and clear intent documentation. Within this browser terminal OS, TypeScript serves as the ideal language for constructing the complex, data-driven interfaces that define modern web applications. By utilizing TypeScript, you ensure that your code is maintainable, scalable, and resilient to the structural changes that inevitable happen as software projects grow in complexity over time."
  },
  kotlin: {
    title: "Kotlin",
    description: "Modern language running on the JVM, built for Android and beyond.",
    features: ["Concise", "Safe (null-safety)", "Great Interoperability"],
    useCases: "Android Development, Server-side Backend, Multiplatform",
    longDescription: "Kotlin is a modern, statically typed language that runs on the Java Virtual Machine. Developed by JetBrains, it was created to improve upon Java's verbose syntax while guaranteeing null safety—a source of countless bugs, crashes, and maintenance nightmares in older JVM languages. Kotlin is highly expressive, concise, and fully interoperable with existing Java codebases, making it easier to adopt or integrate into large, legacy enterprise systems. While it has become the standard language for Android development, Kotlin’s reach extends deep into the server-side backend world and increasingly into multiplatform development projects. Within our terminal environment, Kotlin supports developers needing to build backend-heavy logic or multiplatform applications that share code across devices. Its balance of safety, modern language ergonomics, and performance makes it a favorite for engineers working in modern enterprise ecosystems."
  },
  dart: {
    title: "Dart",
    description: "Client-optimized language for fast UI development across all platforms.",
    features: ["Fast UI Rendering", "Strongly Typed", "Productive"],
    useCases: "Mobile App Development (Flutter), Web Dev",
    longDescription: "Dart is a language optimized specifically for building fast, beautiful, and interactive user interfaces across desktop, mobile, and web. It is the language that powers the Flutter framework, which allows developers to build consistent, high-performance UI across multiple platforms from a single codebase. Dart’s development experience is top-tier, focusing on fast build-reload cycles and strong, static type systems that ensure application stability as the codebase grows. It provides a highly productive environment for UI engineers who want to focus on pixel-perfect layouts and smooth interaction transitions. In our terminal OS, Dart is used for developers focused on client-side application design and building tools that emphasize visual consistency and high-speed execution. Whether you are creating a responsive web tool or a complex mobile-like dashboard in the browser, Dart gives you the modern syntax and the performance characteristics needed for the job."
  },
  swift: {
    title: "Swift",
    description: "High-performance language from Apple for modern systems.",
    features: ["Type Safety", "Fast & Secure", "Expressive"],
    useCases: "iOS Development, macOS Systems Programming",
    longDescription: "Swift is the modern, powerful, and safe programming language from Apple. Designed to replace older languages like Objective-C, Swift is built for performance and safety from the ground up, utilizing modern compiler technologies to create optimized binaries. It is highly expressive, encouraging clean, readable code with robust features such as type inference, optionals, and safe memory management. Swift's design goal is to make programming enjoyable while guaranteeing the highest level of stability and security. It is the primary language used for the entire Apple software ecosystem, but its utility extends far beyond just mobile and desktop apps. Within our terminal, Swift is supported for developers interested in low-level systems programming and application-layer software development that demand high performance, secure memory models, and modern language syntax. Its combination of speed, safety, and modern design makes it an indispensable tool for systems engineers working within and outside the Apple environment."
  },
  sql: {
    title: "SQL",
    description: "The standard for relational database management and querying.",
    features: ["Declarative", "Highly Efficient Querying", "Relational Model"],
    useCases: "Database Management, Data Analysis, Backend Support",
    longDescription: "SQL is not merely a language; it is the industry standard for interacting with relational databases and managing data. Its declarative nature allows developers to specify *what* data they need, rather than *how* the computer should go about retrieving it, delegating the complex optimization work to the database engine. SQL is incredibly powerful, enabling efficient querying, transformation, and structural management of massive datasets across virtually every industry. In this terminal environment, SQL is integrated as a core tool for engineers who need to perform deep data analysis, manage relational data, and construct support backends for their applications. Mastery of SQL is vital for any engineering role that touches on data persistence, analytics, or complex system modeling. It empowers you to perform surgical data operations, ensure referential integrity, and build reliable backend foundations for complex applications that scale."
  }
};

