import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Terminal, Code, Cpu, Zap, Globe, ArrowRight, ShieldCheck, Database, Info, Layers, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { KERNELS } from './kernelData';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
];

const translations: Record<string, any> = {
  en: {
    heroTitle: "The Next Generation Browser Terminal",
    heroSubtitle: "WASM-powered, AI-ready, completely browser-based terminal OS for developers, data scientists, and engineers.",
    launchBtn: "Launch Terminal OS",
    featuresTitle: "Unparalleled Features in the Browser",
    features: [
      { icon: 'cpu', title: "WASM Architecture", desc: "Run Python, Rust, C, C++, and more directly in your browser. No server required. Zero latency execution with local filesystem access." },
      { icon: 'ai', title: "Embedded AI Tools", desc: "Integrated Machine Learning training, predictions, and Computer Vision capabilities directly on your local device." },
      { icon: 'data', title: "Advanced Data Science", desc: "Analyze datasets, render complex charts, and utilize Pandas-like functionality without installing dependencies." }
    ],
    detailsTitle: "Why Choose Terminal OS?",
    details: [
      "Privacy First: Everything runs locally. No data is sent to external servers unless you explicitly request it.",
      "Instant Environment: Stop wrestling with Docker, virtual environments, and package managers. Start writing code in seconds.",
      "Cross-Platform: Works on Windows, Mac, Linux, iOS, and Android through modern browser APIs.",
      "Integrated Workflows: Combines code execution, file management, image processing, and AI in a single cohesive interface."
    ],
    faqTitle: "Frequently Asked Questions",
    faq: [
      { q: "Is this a real Operating System?", a: "Terminal OS is a browser-based environment that emulates the behavior of a Unix system. It leverages WebAssembly (WASM) to run real language binaries like Python and C directly in your browser's dedicated thread." },
      { q: "Do I need an internet connection?", a: "Once the initial core is loaded, most functions work offline. However, for AI integration or loading remote kernels, a temporary connection is required." },
      { q: "Is my data secure?", a: "Yes. Since the execution happens client-side, your source code and data never leave your computer unless you use a cloud-sync feature." }
    ],
    roadmapTitle: "Development Roadmap 2026",
    roadmap: [
      { stage: "Q1", task: "Multi-kernel parallel execution and shared memory support." },
      { stage: "Q2", task: "Full GUI support for legacy X11 applications via WASM." },
      { stage: "Q3", task: "Decentralized workspace sharing and collaborative terminal sessions." },
      { stage: "Q4", task: "Integration with next-gen multimodal AI for automatic script generation." }
    ],
    footer: "© 2026 Terminal OS. Built for modern engineers."
  },
  bn: {
    heroTitle: "পরবর্তী প্রজন্মের ব্রাউজার টার্মিনাল",
    heroSubtitle: "ডেভেলপার, ডেটা সায়েন্টিস্ট এবং ইঞ্জিনিয়ারদের জন্য WASM-চালিত, এআই-রেডি, সম্পূর্ণ ব্রাউজার-ভিত্তিক টার্মিনাল ওএস।",
    launchBtn: "টার্মিনাল ওএস চালু করুন",
    featuresTitle: "ব্রাউজারে অতুলনীয় বৈশিষ্ট্য",
    features: [
      { icon: 'cpu', title: "WASM আর্কিটেকচার", desc: "আপনার ব্রাউজারেই পাইথন, রাস্ট, সি, সি++ এবং আরও অনেক কিছু চালান। কোনো সার্ভারের প্রয়োজন নেই।" },
      { icon: 'ai', title: "এমবেডেড এআই টুলস", desc: "লোকাল ডিভাইসে সরাসরি মেশিন লার্নিং ট্রেনিং, প্রেডিকশন এবং কম্পিউটার ভিশন ক্ষমতা।" },
      { icon: 'data', title: "অ্যাডভান্সড ডেটা সায়েন্স", desc: "নির্ভরতা ইনস্টল না করেই ডেটাসেট বিশ্লেষণ, চার্ট তৈরি এবং পান্ডাস-এর মতো কাজ করুন।" }
    ],
    detailsTitle: "টার্মিনাল ওএস কেন বেছে নেবেন?",
    details: [
      "প্রাইভেসি ফাস্ট: সবকিছু লোকালি চালিত হয়। আপনার ডেটা অন্য কোথাও যায় না।",
      "ইনস্ট্যান্ট এনভায়রনমেন্ট: ভার্চুয়াল এনভায়রনমেন্ট, ডকার ছাড়াই নিমেষে কোডিং শুরু করুন।",
      "ক্রস-প্ল্যাটফর্ম: উইন্ডোজ, ম্যাক, লিনাক্স এবং মোবাইলে কাজ করে।",
      "ইন্টিগ্রেটেড ওয়ার্কফ্লো: কোড, ফাইল, ইমেজ এবং এআই সবকিছু এক জায়গায়।"
    ],
    faqTitle: "সচরাচর জিজ্ঞাসিত প্রশ্ন",
    faq: [
      { q: "এটি কি একটি আসল অপারেটিং সিস্টেম?", a: "টার্মিনাল ওএস একটি ব্রাউজার-ভিত্তিক পরিবেশ যা একটি ইউনিক্স সিস্টেমের আচরণ অনুকরণ করে। এটি আপনার ব্রাউজারে সরাসরি পাইথন এবং সি এর মতো রানটাইম চালানোর জন্য WebAssembly (WASM) ব্যবহার করে।" },
      { q: "আমার কি ইন্টারনেট সংযোগ প্রয়োজন?", a: "একবার কোর ফাইলগুলো লোড হয়ে গেলে, বেশিরভাগ ফাংশন অফলাইনে কাজ করে। তবে এআই ব্যবহারের জন্য ইন্টারনেটের প্রয়োজন হতে পারে।" },
      { q: "আমার ডেটা কি নিরাপদ?", a: "হ্যাঁ। যেহেতু সবকিছুই আপনার ব্রাউজারে চলে, তাই আপনার কোড বা ডেটা আমাদের সার্ভারে পৌঁছায় না।" }
    ],
    roadmapTitle: "ডেভেলপমেন্ট রোডম্যাপ ২০২৬",
    roadmap: [
      { stage: "Q1", task: "মাল্টি-কার্নেল প্যারালাল এক্সিকিউশন এবং শেয়ারেড মেমরি সাপোর্ট।" },
      { stage: "Q2", task: "WASM-এর মাধ্যমে লিগ্যাসি X11 অ্যাপ্লিকেশনের জন্য সম্পূর্ণ GUI সাপোর্ট।" },
      { stage: "Q3", task: "ডেসেন্ট্রালাইজড ওয়ার্কস্পেস শেয়ারিং এবং কোলাবোরেটিভ সেশন।" },
      { stage: "Q4", task: "অটোমেটিক স্ক্রিপ্ট জেনারেশনের জন্য পরবর্তী প্রজন্মের মাল্টিমোডাল এআই ইন্টিগ্রেশন।" }
    ],
    footer: "© ২০২৬ টার্মিনাল ওএস। আধুনিক ইঞ্জিনিয়ারদের জন্য তৈরি।"
  },
  es: {
    heroTitle: "Terminal de Navegador de Nueva Generación",
    heroSubtitle: "SO de terminal basado en WASM, listo para IA y completamente en el navegador para desarrolladores, científicos de datos e ingenieros.",
    launchBtn: "Iniciar Terminal OS",
    featuresTitle: "Características inigualables en el navegador",
    features: [
      { icon: 'cpu', title: "Arquitectura WASM", desc: "Ejecuta Python, Rust, C, C++ y más directamente en tu navegador. No se requiere servidor." },
      { icon: 'ai', title: "Herramientas de IA integradas", desc: "Capacidades integradas de entrenamiento de aprendizaje automático, predicciones y visión por computadora." },
      { icon: 'data', title: "Ciencia de datos avanzada", desc: "Analiza conjuntos de datos, renderiza gráficos complejos y utiliza funcionalidades similares a Pandas." }
    ],
    detailsTitle: "¿Por qué elegir Terminal OS?",
    details: [
      "Privacidad primero: Todo se ejecuta localmente.",
      "Entorno instantáneo: Sin Docker ni entornos virtuales costosos.",
      "Multiplataforma: Funciona en Windows, Mac, Linux, iOS y Android.",
      "Flujos de trabajo integrados: Todo en un solo lugar."
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Es un sistema operativo real?", a: "Terminal OS emula el comportamiento de un sistema Unix usando WebAssembly." },
      { q: "¿Necesito internet?", a: "La mayor parte funciona sin conexión una vez cargado el núcleo." },
      { q: "¿Mis datos están seguros?", a: "Sí, la ejecución es totalmente del lado del cliente." }
    ],
    roadmapTitle: "Hoja de ruta 2026",
    roadmap: [
      { stage: "Q1", task: "Ejecución paralela multinúcleo y memoria compartida." },
      { stage: "Q2", task: "Soporte GUI para aplicaciones X11 heredadas." },
      { stage: "Q3", task: "Colaboración descentralizada en tiempo real." },
      { stage: "Q4", task: "Generación automática de scripts basada en IA multimodal." }
    ],
    footer: "© 2026 Terminal OS. Creado para ingenieros modernos."
  },
  fr: {
    heroTitle: "Le terminal de navigateur de nouvelle génération",
    heroSubtitle: "Système d'exploitation de terminal basé sur WASM, prêt pour l'IA, entièrement dans le navigateur pour les développeurs, les data scientists et les ingénieurs.",
    launchBtn: "Lancer Terminal OS",
    featuresTitle: "Fonctionnalités inégalées dans le navigateur",
    features: [
      { icon: 'cpu', title: "Architecture WASM", desc: "Exécutez Python, Rust, C, C++ et plus directement dans votre navigateur." },
      { icon: 'ai', title: "Outils d'IA intégrés", desc: "Entraînement ML, prédictions et vision par ordinateur directement sur votre appareil." },
      { icon: 'data', title: "Science des données avancée", desc: "Analysez vos jeux de données et générez des graphiques complexes sans dépendances." }
    ],
    detailsTitle: "Pourquoi choisir Terminal OS ?",
    details: [
      "Confidentialité : Tout s'exécute localement.",
      "Environnement instantané : Fini Docker et les environnements complexes.",
      "Multiplateforme : Fonctionne sur Windows, Mac, Linux, iOS et Android.",
      "Workflows intégrés : Tout est centralisé."
    ],
    faqTitle: "Questions fréquentes",
    faq: [
      { q: "Est-ce un vrai système d'exploitation ?", a: "Terminal OS émule un système Unix via WebAssembly." },
      { q: "Ai-je besoin d'Internet ?", a: "Le noyau fonctionne majoritairement hors ligne." },
      { q: "Mes données sont-elles sécurisées ?", a: "Oui, tout tourne en local." }
    ],
    roadmapTitle: "Feuille de route 2026",
    roadmap: [
      { stage: "Q1", task: "Exécution parallèle multicœur." },
      { stage: "Q2", task: "Support GUI pour applications X11." },
      { stage: "Q3", task: "Collaboration décentralisée." },
      { stage: "Q4", task: "Génération de scripts par IA multimodale." }
    ],
    footer: "© 2026 Terminal OS. Conçu pour les ingénieurs modernes."
  },
  de: {
    heroTitle: "Die Browser-Terminal der nächsten Generation",
    heroSubtitle: "WASM-basiertes, KI-bereites, vollständig browserbasiertes Terminal-Betriebssystem für Entwickler, Datenwissenschaftler und Ingenieure.",
    launchBtn: "Terminal OS starten",
    featuresTitle: "Unvergleichliche Funktionen im Browser",
    features: [
      { icon: 'cpu', title: "WASM-Architektur", desc: "Führen Sie Python, Rust, C, C++ direkt im Browser aus. Kein Server erforderlich." },
      { icon: 'ai', title: "Integrierte KI-Tools", desc: "ML-Training, Vorhersagen und Computer Vision direkt auf Ihrem Gerät." },
      { icon: 'data', title: "Erweiterte Datenwissenschaft", desc: "Analysieren Sie Datensätze und erstellen Sie komplexe Diagramme ohne Abhängigkeiten." }
    ],
    detailsTitle: "Warum Terminal OS wählen?",
    details: [
      "Datenschutz zuerst: Alles läuft lokal.",
      "Sofortige Umgebung: Keine Docker- oder Virtual-Environment-Probleme mehr.",
      "Plattformübergreifend: Läuft auf Windows, Mac, Linux, iOS und Android.",
      "Integrierte Workflows: Alles an einem Ort."
    ],
    faqTitle: "Häufig gestellte Fragen",
    faq: [
      { q: "Ist das ein echtes Betriebssystem?", a: "Terminal OS emuliert ein Unix-System mittels WebAssembly." },
      { q: "Brauche ich Internet?", a: "Der Großteil funktioniert offline." },
      { q: "Sind meine Daten sicher?", a: "Ja, die Ausführung erfolgt rein lokal." }
    ],
    roadmapTitle: "Entwicklungs-Roadmap 2026",
    roadmap: [
      { stage: "Q1", task: "Multi-Kern-Parallelisierung." },
      { stage: "Q2", task: "GUI-Unterstützung für X11-Apps." },
      { stage: "Q3", task: "Dezentrale Zusammenarbeit." },
      { stage: "Q4", task: "KI-basierte Skriptgenerierung." }
    ],
    footer: "© 2026 Terminal OS. Für moderne Ingenieure gebaut."
  },
  zh: {
    heroTitle: "下一代浏览器终端",
    heroSubtitle: "基于 WASM、支持 AI、完全基于浏览器的终端操作系统，专为开发者、数据科学家和工程师打造。",
    launchBtn: "启动终端操作系统",
    featuresTitle: "浏览器中无与伦比的功能",
    features: [
      { icon: 'cpu', title: "WASM 架构", desc: "直接在浏览器中运行 Python、Rust、C、C++ 等。无需服务器。" },
      { icon: 'ai', title: "内置 AI 工具", desc: "直接在本地设备上进行机器学习训练、预测和计算机视觉。" },
      { icon: 'data', title: "高级数据科学", desc: "分析数据集、渲染复杂图表，无需安装任何依赖项。" }
    ],
    detailsTitle: "为什么选择 Terminal OS？",
    details: [
      "隐私优先：所有内容都在本地运行。",
      "即时环境：告别 Docker 和繁琐的虚拟环境设置。",
      "跨平台：支持 Windows、Mac、 Linux、 iOS 和 Android。",
      "集成工作流：将代码执行、文件管理和 AI 整合在一个界面中。"
    ],
    faqTitle: "常见问题解答",
    faq: [
      { q: "这是一个真正的操作系统吗？", a: "Terminal OS 通过 WebAssembly 模拟 Unix 系统的行为。" },
      { q: "我需要联网吗？", a: "加载核心后，大多数功能可以离线工作。" },
      { q: "我的数据安全吗？", a: "是的，所有执行都在客户端完成。" }
    ],
    roadmapTitle: "2026 开发路线图",
    roadmap: [
      { stage: "Q1", task: "多核并行执行及共享内存支持。" },
      { stage: "Q2", task: "为旧版 X11 应用提供 GUI 支持。" },
      { stage: "Q3", task: "去中心化工作空间共享。" },
      { stage: "Q4", task: "集成多模态 AI，实现自动脚本生成。" }
    ],
    footer: "© 2026 Terminal OS. 为现代工程师而生。"
  },
  ja: {
    heroTitle: "次世代ブラウザターミナル",
    heroSubtitle: "開発者、データサイエンティスト、エンジニア向けのWASM駆動、AI対応、完全ブラウザベースのターミナルOS。",
    launchBtn: "ターミナルOSを起動",
    featuresTitle: "ブラウザにおける比類なき機能",
    features: [
      { icon: 'cpu', title: "WASMアーキテクチャ", desc: "Python, Rust, C, C++などをブラウザで直接実行。サーバー不要。" },
      { icon: 'ai', title: "組み込みAIツール", desc: "ローカルデバイス上で機械学習、予測、コンピュータビジョンを実行。" },
      { icon: 'data', title: "高度なデータサイエンス", desc: "依存関係のインストールなしでデータ分析やチャート生成。" }
    ],
    detailsTitle: "Terminal OSを選ぶ理由",
    details: [
      "プライバシー第一：すべてローカル実行。",
      "即時環境：Dockerの手間を排除。",
      "クロスプラットフォーム：全OSで動作。",
      "統合ワークフロー：すべてが一箇所に。"
    ],
    faqTitle: "FAQ",
    faq: [
      { q: "本物のOSですか？", a: "WebAssemblyによるUnixシステムのシミュレーションです。" },
      { q: "インターネット接続は必須ですか？", a: "コア読み込み後はオフラインで動作します。" },
      { q: "データは安全ですか？", a: "はい、クライアント側で完結します。" }
    ],
    roadmapTitle: "2026ロードマップ",
    roadmap: [
      { stage: "Q1", task: "マルチコア並列実行。" },
      { stage: "Q2", task: "レガシーX11アプリのGUIサポート。" },
      { stage: "Q3", task: "分散ワークスペース共有。" },
      { stage: "Q4", task: "マルチモーダルAIによる自動スクリプト生成。" }
    ],
    footer: "© 2026 Terminal OS. 現代のエンジニアのために。"
  },
  ru: {
    heroTitle: "Браузерный терминал нового поколения",
    heroSubtitle: "Терминальная ОС на базе WASM с поддержкой ИИ для разработчиков, аналитиков и инженеров.",
    launchBtn: "Запустить Terminal OS",
    featuresTitle: "Уникальные возможности в браузере",
    features: [
      { icon: 'cpu', title: "Архитектура WASM", desc: "Запускайте Python, Rust, C, C++ напрямую в браузере." },
      { icon: 'ai', title: "Встроенные ИИ-инструменты", desc: "Обучение ML, предсказания и компьютерное зрение локально." },
      { icon: 'data', title: "Продвинутая аналитика", desc: "Анализ данных и сложные графики без установки зависимостей." }
    ],
    detailsTitle: "Почему стоит выбрать Terminal OS?",
    details: [
      "Приватность: все данные локальны.",
      "Мгновенный старт: нет Docker и виртуальных сред.",
      "Кроссплатформенность: Windows, Mac, Linux.",
      "Интегрированный рабочий процесс."
    ],
    faqTitle: "Часто задаваемые вопросы",
    faq: [
      { q: "Это настоящая ОС?", a: "Эмуляция системы Unix средствами WebAssembly." },
      { q: "Нужен ли интернет?", a: "Работает в основном оффлайн." },
      { q: "Данные защищены?", a: "Да, всё в клиенте." }
    ],
    roadmapTitle: "Дорожная карта 2026",
    roadmap: [
      { stage: "Q1", task: "Многоядерное параллельное выполнение." },
      { stage: "Q2", task: "Поддержка GUI для X11 приложений." },
      { stage: "Q3", task: "Децентрализованный обмен рабочими пространствами." },
      { stage: "Q4", task: "ИИ-генерация скриптов." }
    ],
    footer: "© 2026 Terminal OS. Создана для современных инженеров."
  },
  pt: {
    heroTitle: "Terminal de Navegador de Nova Geração",
    heroSubtitle: "SO de terminal baseado em WASM, pronto para IA, totalmente no navegador para desenvolvedores, cientistas de dados e engenheiros.",
    launchBtn: "Iniciar Terminal OS",
    featuresTitle: "Recursos inigualáveis no navegador",
    features: [
      { icon: 'cpu', title: "Arquitetura WASM", desc: "Execute Python, Rust, C, C++ e mais diretamente no navegador. Sem servidor." },
      { icon: 'ai', title: "Ferramentas de IA integradas", desc: "Treinamento de ML, predições e visão computacional diretamente no dispositivo." },
      { icon: 'data', title: "Ciência de Dados Avançada", desc: "Analise conjuntos de dados e renderize gráficos complexos sem dependências." }
    ],
    detailsTitle: "Por que escolher o Terminal OS?",
    details: [
      "Privacidade primeiro: Tudo roda localmente.",
      "Ambiente instantâneo: Chega de problemas com Docker.",
      "Multiplataforma: Funciona em Windows, Mac, Linux, iOS e Android.",
      "Fluxos de trabalho integrados: Tudo em um só lugar."
    ],
    faqTitle: "Perguntas Frequentes",
    faq: [
      { q: "É um sistema operacional real?", a: "O Terminal OS emula o comportamento de um sistema Unix via WebAssembly." },
      { q: "¿Preciso de internet?", a: "A maior parte funciona offline após o carregamento inicial." },
      { q: "Meus dados estão seguros?", a: "Sim, toda a execução é local no cliente." }
    ],
    roadmapTitle: "Roteiro de Desenvolvimento 2026",
    roadmap: [
      { stage: "Q1", task: "Execução paralela multinúcleo." },
      { stage: "Q2", task: "Suporte GUI para aplicativos X11 legados." },
      { stage: "Q3", task: "Compartilhamento de espaço de trabalho descentralizado." },
      { stage: "Q4", task: "Integração de IA multimodal para geração automática de scripts." }
    ],
    footer: "© 2026 Terminal OS. Construído para engenheiros modernos."
  },
  hi: {
    heroTitle: "अगली पीढ़ी का ब्राउज़र टर्मिनल",
    heroSubtitle: "डेवलपर्स, डेटा वैज्ञानिकों और इंजीनियरों के लिए WASM-संचालित, AI-तैयार, पूरी तरह से ब्राउज़र-आधारित टर्मिनल OS।",
    launchBtn: "Terminal OS लॉन्च करें",
    featuresTitle: "ब्राउज़र में अद्वितीय सुविधाएँ",
    features: [
      { icon: 'cpu', title: "WASM आर्किटेक्चर", desc: "Python, Rust, C, C++ को सीधे ब्राउज़र में चलाएं। कोई सर्वर नहीं।" },
      { icon: 'ai', title: "एम्बेडेड AI उपकरण", desc: "स्थानीय डिवाइस पर सीधे ML ट्रेनिंग, भविष्यवाणियां और कंप्यूटर विज़न।" },
      { icon: 'data', title: "उन्नत डेटा साइंस", desc: "निर्भरता इंस्टॉल किए बिना डेटासेट विश्लेषण और ग्राफ़ रेंडरिंग।" }
    ],
    detailsTitle: "Terminal OS क्यों चुनें?",
    details: [
      "गोपनीयता पहले: सब कुछ स्थानीय रूप से चलता है।",
      "तत्काल वातावरण: Docker और वर्चुअल वातावरण की समस्या नहीं।",
      "क्रॉस-प्लेटफ़ॉर्म: Windows, Mac, Linux, iOS और Android पर काम करता है।",
      "एकीकृत वर्कफ़्लो: सब कुछ एक ही जगह पर।"
    ],
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faq: [
      { q: "क्या यह एक वास्तविक ऑपरेटिंग सिस्टम है?", a: "Terminal OS WebAssembly का उपयोग करके Unix सिस्टम को अनुकरण करता है।" },
      { q: "क्या मुझे इंटरनेट की आवश्यकता है?", a: "कोर लोड होने के बाद अधिकतर ऑफ़लाइन काम करता है।" },
      { q: "क्या मेरा डेटा सुरक्षित है?", a: "हाँ, पूरा निष्पादन स्थानीय है।" }
    ],
    roadmapTitle: "विकास रोडमैप 2026",
    roadmap: [
      { stage: "Q1", task: "मल्टी-कोर समानांतर निष्पादन।" },
      { stage: "Q2", task: "X11 ऐप्स के लिए GUI समर्थन।" },
      { stage: "Q3", task: "विकेंद्रीकृत कार्यक्षेत्र साझाकरण।" },
      { stage: "Q4", task: "ऑटोमैटिक स्क्रिप्ट जेनरेशन के लिए मल्टीमॉडल AI।" }
    ],
    footer: "© 2026 Terminal OS. आधुनिक इंजीनियरों के लिए बनाया गया।"
  },
  it: {
    heroTitle: "Il terminale browser di prossima generazione",
    heroSubtitle: "OS terminale basato su WASM, pronto per l'IA, completamente nel browser per sviluppatori, data scientist e ingegneri.",
    launchBtn: "Avvia Terminal OS",
    featuresTitle: "Funzionalità impareggiabili nel browser",
    features: [
      { icon: 'cpu', title: "Architettura WASM", desc: "Esegui Python, Rust, C, C++ direttamente nel browser. Nessun server richiesto." },
      { icon: 'ai', title: "Strumenti AI integrati", desc: "Training ML, previsioni e computer vision direttamente sul tuo dispositivo." },
      { icon: 'data', title: "Data Science avanzata", desc: "Analisi di dataset e rendering di grafici complessi senza dipendenze." }
    ],
    detailsTitle: "Perché scegliere Terminal OS?",
    details: [
      "Privacy prima di tutto: tutto viene eseguito localmente.",
      "Ambiente istantaneo: niente più problemi con Docker.",
      "Multipiattaforma: funziona su Windows, Mac, Linux, iOS e Android.",
      "Flussi di lavoro integrati: tutto in un unico posto."
    ],
    faqTitle: "Domande frequenti",
    faq: [
      { q: "È un vero sistema operativo?", a: "Terminal OS emula il comportamento di un sistema Unix tramite WebAssembly." },
      { q: "Ho bisogno di internet?", a: "La maggior parte funziona offline dopo il caricamento iniziale." },
      { q: "I miei dati sono al sicuro?", a: "Sì, tutto viene eseguito sul lato client." }
    ],
    roadmapTitle: "Roadmap di sviluppo 2026",
    roadmap: [
      { stage: "Q1", task: "Esecuzione parallela multi-core." },
      { stage: "Q2", task: "Supporto GUI per app X11 legacy." },
      { stage: "Q3", task: "Condivisione decentralizzata dell'area di lavoro." },
      { stage: "Q4", task: "Integrazione AI multimodale per la generazione di script." }
    ],
    footer: "© 2026 Terminal OS. Costruito per ingegneri moderni."
  }
};

const getIcon = (name: string) => {
  switch (name) {
    case 'cpu': return <Cpu className="w-8 h-8 text-emerald-400" />;
    case 'ai': return <Zap className="w-8 h-8 text-purple-400" />;
    case 'data': return <Database className="w-8 h-8 text-blue-400" />;
    default: return <Code className="w-8 h-8 text-emerald-400" />;
  }
};

export default function LandingPage() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();

  const [isKernelsOpen, setIsKernelsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const kernelsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (kernelsRef.current && !kernelsRef.current.contains(event.target as Node)) {
        setIsKernelsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentLangCode = lang || 'en';
  const content = translations[currentLangCode] || translations['en'];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <span className="font-mono font-bold text-lg tracking-wider text-emerald-50">Terminal OS</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Kernels Dropdown */}
              <div className="relative" ref={kernelsRef}>
                <button 
                  onClick={() => { setIsKernelsOpen(!isKernelsOpen); setIsLangOpen(false); }}
                  className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                >
                  <Code className="w-4 h-4" />
                  <span>Kernels</span>
                </button>
                <div className={`absolute right-0 md:left-0 mt-2 w-56 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl transition-all duration-200 z-[60] ${isKernelsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  <div className="py-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {Object.entries(KERNELS).map(([key, k]) => (
                      <Link 
                        key={key}
                        to={`/kernel/${key}?lang=${currentLangCode}`}
                        className="block px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-emerald-400 capitalize transition-colors"
                        onClick={() => setIsKernelsOpen(false)}
                      >
                        {key === 'terminalos' ? '⭐ Terminal OS' : k.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Language Selector */}
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => { setIsLangOpen(!isLangOpen); setIsKernelsOpen(false); }}
                  className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{currentLangCode}</span>
                </button>
                <div className={`absolute right-0 mt-2 w-40 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl transition-all duration-200 z-[60] ${isLangOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  <div className="py-2">
                    {languages.map(l => (
                      <Link 
                        key={l.code}
                        to={`/${l.code}`}
                        className={`block px-4 py-2 text-sm ${l.code === currentLangCode ? 'text-emerald-400 bg-emerald-500/5' : 'text-neutral-300 hover:bg-white/5'}`}
                        onClick={() => setIsLangOpen(false)}
                      >
                        {l.native}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/terminal')}
                className="hidden md:block px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-full transition-all"
              >
                {content.launchBtn}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-mono mb-8"
          >
            <Activity className="w-3 h-3" />
            V2.0.4 PRODUCTION STABLE
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tight text-white mb-8"
          >
            {content.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto text-xl md:text-2xl text-neutral-400 leading-relaxed"
          >
            {content.heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/terminal')}
              className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all flex items-center gap-3 text-lg shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1"
            >
              <Terminal className="w-6 h-6" />
              {content.launchBtn}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-neutral-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">{content.featuresTitle}</h2>
            <p className="text-neutral-500">Advanced computational capabilities delivered through WebAssembly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.features.map((f: any, i: number) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-neutral-900 border border-white/5 p-10 rounded-3xl group hover:border-emerald-500/30 transition-all"
              >
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:bg-emerald-500/10 transition-colors">
                  {getIcon(f.icon)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-lg">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kernels Showcase */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Supported Programming Kernels</h2>
              <p className="text-lg text-neutral-400">16+ Language runtimes optimized for browser execution.</p>
            </div>
            <Link to="/terminal" className="text-emerald-400 font-bold hover:underline flex items-center gap-2 justify-center">
              Explore All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {Object.entries(KERNELS).map(([key, k], i) => (
              <Link key={key} to={`/kernel/${key}?lang=${currentLangCode}`}>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="aspect-square bg-neutral-900 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-neutral-400 hover:text-white group"
                >
                  <Code className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-bold uppercase tracking-widest">{key}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Commands Showcase */}
      <section className="py-24 bg-neutral-900 border-y border-white/5 text-center">
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-black text-white mb-8 tracking-tight">Essential Shell Commands</h2>
            <div className="bg-black border border-white/10 rounded-2xl p-8 font-mono text-left font-sm">
                <div className="space-y-4">
                  <div className="flex gap-4"><span className="text-emerald-500">$</span><span className="text-white">py-run script.py</span><span className="text-neutral-500">// Run Python scripts</span></div>
                  <div className="flex gap-4"><span className="text-emerald-500">$</span><span className="text-white">wasm-compile app.zig</span><span className="text-neutral-500">// Build WASM binaries</span></div>
                  <div className="flex gap-4"><span className="text-emerald-500">$</span><span className="text-white">ai-generate --query "find memory leaks"</span><span className="text-neutral-500">// Invoke AI helper</span></div>
                  <div className="flex gap-4"><span className="text-emerald-500">$</span><span className="text-white">vfs-mount --persist</span><span className="text-neutral-500">// Mount persistent IndexedDB</span></div>
                </div>
            </div>
        </div>
      </section>

      {/* Roadmap & FAQ Split */}
      <section className="py-24 bg-neutral-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Roadmap */}
            <div>
              <h2 className="text-3xl font-black text-white mb-12 flex items-center gap-3">
                <Layers className="w-8 h-8 text-emerald-500" />
                {content.roadmapTitle}
              </h2>
              <div className="space-y-10">
                {content.roadmap.map((item: any, i: number) => (
                  <div key={i} className="flex gap-8 relative group">
                    {i !== content.roadmap.length - 1 && <div className="absolute left-6 top-12 bottom-[-40px] w-[2px] bg-white/5" />}
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0 font-black text-emerald-400 z-10 group-hover:border-emerald-500 transition-colors">
                      {item.stage}
                    </div>
                    <div className="pt-2">
                       <p className="text-xl text-neutral-200 leading-tight font-medium">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-3xl font-black text-white mb-12 flex items-center gap-3">
                <Info className="w-8 h-8 text-emerald-500" />
                {content.faqTitle}
              </h2>
              <div className="space-y-6">
                {content.faq.map((item: any, i: number) => (
                  <div key={i} className="bg-neutral-900/30 border border-white/5 rounded-3xl p-8 hover:bg-neutral-900/50 transition-colors">
                    <h3 className="text-xl font-bold text-emerald-50 mb-4 tracking-tight">Q: {item.q}</h3>
                    <p className="text-neutral-400 text-lg leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-black border-t border-white/5 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <Terminal className="w-12 h-12 text-neutral-800 mx-auto mb-8" />
          <p className="text-neutral-500 text-lg mb-12 leading-relaxed">
            Designed for the next generation of cloud-native engineering. 
            Terminal OS is a product of intensive research into browser performance and sandboxed environment security.
          </p>
          <div className="flex flex-justify-center mb-12">
            <a href="https://github.com/Quincunx33/PyBrowser" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-full text-white font-bold transition-all hover:text-emerald-400">
               GitHub Repository
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-neutral-600 uppercase tracking-widest">
            <span>Terminal OS v2.0</span>
            <span>WASM Runtime</span>
            <span>AI Integrated</span>
            <span>POSIX Compliant</span>
          </div>
          <p className="mt-12 text-neutral-700 text-xs">
            {content.footer}
          </p>
        </div>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
