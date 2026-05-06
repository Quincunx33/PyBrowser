import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Terminal, Code, Cpu, Zap, Globe, ArrowRight, ShieldCheck, Database, Layout } from 'lucide-react';
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
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
];

const translations: Record<string, any> = {
  en: {
    heroTitle: "The Next Generation Browser Terminal",
    heroSubtitle: "WASM-powered, AI-ready, completely browser-based terminal OS for developers, data scientists, and engineers.",
    launchBtn: "Launch Terminal OS",
    featuresTitle: "Unparalleled Features in the Browser",
    features: [
      {
        icon: 'cpu',
        title: "WASM Architecture",
        desc: "Run Python, Rust, C, C++, and more directly in your browser. No server required. Zero latency execution with local filesystem access."
      },
      {
        icon: 'ai',
        title: "Embedded AI Tools",
        desc: "Integrated Machine Learning training, predictions, and Computer Vision capabilities directly on your local device."
      },
      {
        icon: 'data',
        title: "Advanced Data Science",
        desc: "Analyze datasets, render complex charts, and utilize Pandas-like functionality without installing dependencies."
      }
    ],
    detailsTitle: "Why Choose PyBrowser OS?",
    details: [
      "Privacy First: Everything runs locally. No data is sent to external servers unless you explicitly request it.",
      "Instant Environment: Stop wrestling with Docker, virtual environments, and package managers. Start writing code in seconds.",
      "Cross-Platform: Works on Windows, Mac, Linux, iOS, and Android through modern browser APIs.",
      "Integrated Workflows: Combines code execution, file management, image processing, and AI in a single cohesive interface."
    ],
    footer: "© 2026 PyBrowser OS. Built for modern engineers."
  },
  bn: {
    heroTitle: "পরবর্তী প্রজন্মের ব্রাউজার টার্মিনাল",
    heroSubtitle: "ডেভেলপার, ডেটা সায়েন্টিস্ট এবং ইঞ্জিনিয়ারদের জন্য WASM-চালিত, এআই-রেডি, সম্পূর্ণ ব্রাউজার-ভিত্তিক টার্মিনাল ওএস।",
    launchBtn: "টার্মিনাল ওএস চালু করুন",
    featuresTitle: "ব্রাউজারে অতুলনীয় বৈশিষ্ট্য",
    features: [
      {
        icon: 'cpu',
        title: "WASM আর্কিটেকচার",
        desc: "আপনার ব্রাউজারেই পাইথন, রাস্ট, সি, সি++ এবং আরও অনেক কিছু চালান। কোনো সার্ভারের প্রয়োজন নেই।"
      },
      {
        icon: 'ai',
        title: "এমবেডেড এআই টুলস",
        desc: "লোকাল ডিভাইসে সরাসরি মেশিন লার্নিং ট্রেনিং, প্রেডিকশন এবং কম্পিউটার ভিশন ক্ষমতা।"
      },
      {
        icon: 'data',
        title: "অ্যাডভান্সড ডেটা সায়েন্স",
        desc: "নির্ভরতা ইনস্টল না করেই ডেটাসেট বিশ্লেষণ, চার্ট তৈরি এবং পান্ডাস-এর মতো কাজ করুন।"
      }
    ],
    detailsTitle: "পাইব্রোউজার ওএস কেন বেছে নেবেন?",
    details: [
      "প্রাইভেসি ফাস্ট: সবকিছু লোকালি চালিত হয়। আপনার ডেটা অন্য কোথাও যায় না।",
      "ইনস্ট্যান্ট এনভায়রনমেন্ট: ভার্চুয়াল এনভায়রনমেন্ট, ডকার ছাড়াই নিমেষে কোডিং শুরু করুন।",
      "ক্রস-প্ল্যাটফর্ম: উইন্ডোজ, ম্যাক, লিনাক্স এবং মোবাইলে কাজ করে।",
      "ইন্টিগ্রেটেড ওয়ার্কফ্লো: কোড, ফাইল, ইমেজ এবং এআই সবকিছু এক জায়গায়।"
    ],
    footer: "© 2026 PyBrowser OS. আধুনিক ইঞ্জিনিয়ারদের জন্য তৈরি।"
  },
  es: {
    heroTitle: "El Terminal de Navegador de Próxima Generación",
    heroSubtitle: "SO de terminal impulsado por WASM, listo para IA, completamente basado en navegador.",
    launchBtn: "Iniciar Terminal OS",
    featuresTitle: "Funciones Inigualables en el Navegador",
    features: [
      { icon: 'cpu', title: "Arquitectura WASM", desc: "Ejecute Python, Rust, C directamente. Sin necesidad de servidor." },
      { icon: 'ai', title: "Herramientas de IA Integradas", desc: "Aprendizaje automático y visión artificial en su dispositivo." },
      { icon: 'data', title: "Ciencia de Datos", desc: "Analice conjuntos de datos y gráficos sin instalar dependencias." }
    ],
    detailsTitle: "¿Por qué elegir PyBrowser OS?",
    details: [
      "Privacidad: Todo se ejecuta localmente. Sus datos no se envían a servidores.",
      "Entorno Instantáneo: Comience a codificar en segundos sin gestionar docker.",
      "Multiplataforma: Funciona en Windows, Mac, Linux, y móviles.",
      "Flujos de Trabajo Integrados: Código, archivos, imágenes e IA en uno solo."
    ],
    footer: "© 2026 PyBrowser OS. Construido para ingenieros modernos."
  },
  fr: {
    heroTitle: "Le terminal de navigateur de nouvelle génération",
    heroSubtitle: "Système d'exploitation de terminal propulsé par WASM, prêt pour l'IA, entièrement basé sur le navigateur.",
    launchBtn: "Lancer Terminal OS",
    featuresTitle: "Fonctionnalités inégalées dans le navigateur",
    features: [
      { icon: 'cpu', title: "Architecture WASM", desc: "Exécutez Python, Rust, C directement. Aucun serveur requis." },
      { icon: 'ai', title: "Outils d'IA intégrés", desc: "Apprentissage automatique et vision par ordinateur sur votre appareil." },
      { icon: 'data', title: "Science des données", desc: "Analysez vos données sans installer de dépendances." }
    ],
    detailsTitle: "Pourquoi choisir PyBrowser OS ?",
    details: [
      "Confidentialité : tout s'exécute localement.",
      "Environnement instantané : codez en quelques secondes.",
      "Multiplateforme : fonctionne partout.",
      "Flux intégrés : code, fichiers, images et IA en un seul endroit."
    ],
    footer: "© 2026 PyBrowser OS. Conçu pour les ingénieurs modernes."
  },
  de: {
    heroTitle: "Das Browser-Terminal der nächsten Generation",
    heroSubtitle: "WASM-betriebenes, KI-bereites, vollständig browserbasiertes Terminal-Betriebssystem.",
    launchBtn: "Terminal OS Starten",
    featuresTitle: "Beispiellose Funktionen im Browser",
    features: [
      { icon: 'cpu', title: "WASM-Architektur", desc: "Führen Sie Python, Rust, C direkt aus. Kein Server erforderlich." },
      { icon: 'ai', title: "Eingebettete KI", desc: "Machine Learning und Computer Vision auf Ihrem Gerät." },
      { icon: 'data', title: "Data Science", desc: "Analysieren Sie Daten ohne Abhängigkeitsinstallation." }
    ],
    detailsTitle: "Warum PyBrowser OS wählen?",
    details: [
      "Datenschutz: Alles läuft lokal.",
      "Sofort-Umgebung: Programmieren in Sekunden.",
      "Plattformübergreifend: Funktioniert überall.",
      "Integrierte Workflows: Code, Dateien, Bilder, KI an einem Ort."
    ],
    footer: "© 2026 PyBrowser OS. Gebaut für moderne Ingenieure."
  },
  zh: {
    heroTitle: "下一代浏览器终端",
    heroSubtitle: "基于WASM、拥抱AI、完全基于浏览器的终端操作系统。",
    launchBtn: "启动终端操作系统",
    featuresTitle: "浏览器中无与伦比的功能",
    features: [
      { icon: 'cpu', title: "WASM 架构", desc: "直接运行 Python, Rust, C 等。无需服务器。" },
      { icon: 'ai', title: "嵌入式AI工具", desc: "在本地设备上进行机器学习和计算机视觉操作。" },
      { icon: 'data', title: "高级数据科学", desc: "分析数据集、生成图表，无需安装依赖项。" }
    ],
    detailsTitle: "为什么选择 PyBrowser OS？",
    details: [
      "隐私优先：一切都在本地运行。没有数据泄露风险。",
      "即时环境：几秒钟内即可开始编写代码。",
      "跨平台：支持多种设备和操作系统。",
      "集成工作流：代码执行、文件管理、图像处理等尽在一个界面。"
    ],
    footer: "© 2026 PyBrowser OS. 为现代工程师而构建。"
  },
  ja: {
    heroTitle: "次世代ブラウザターミナル",
    heroSubtitle: "WASM搭載、AI対応の完全なブラウザベースのターミナルOS。",
    launchBtn: "ターミナルOSを起動",
    featuresTitle: "ブラウザ上で比類のない機能",
    features: [
      { icon: 'cpu', title: "WASM アーキテクチャ", desc: "Python, Rust, Cなどを直接実行。サーバーは不要です。" },
      { icon: 'ai', title: "AIツール搭載", desc: "機械学習とコンピュータービジョンをローカルで。" },
      { icon: 'data', title: "データサイエンス", desc: "依存関係のインストールなしでデータを分析。" }
    ],
    detailsTitle: "PyBrowser OSを選ぶ理由",
    details: [
      "プライバシー重視：すべてはローカルで実行されます。",
      "即時環境：数秒でコーディングを開始できます。",
      "クロスプラットフォーム：どこでも動作します。",
      "統合ワークフロー：すべてが1つの場所に。"
    ],
    footer: "© 2026 PyBrowser OS. 現代のエンジニアのために。"
  },
  ar: {
    heroTitle: "الجيل القادم من محطات المتصفح",
    heroSubtitle: "نظام تشغيل محطة يعمل بالكامل في المتصفح ومدعوم بـ WASM ومجهز للذكاء الاصطناعي.",
    launchBtn: "تشغيل نظام المحطة",
    featuresTitle: "ميزات لا مثيل لها في المتصفح",
    features: [
      { icon: 'cpu', title: "بنية WASM", desc: "قم بتشغيل Python و Rust و C مباشرة في متصفحك. لا يوجد خادم مطلوب." },
      { icon: 'ai', title: "أدوات ذكاء اصطناعي مدمجة", desc: "قدرات التعلم الآلي والرؤية الحاسوبية على جهازك المحلي." },
      { icon: 'data', title: "علم بيانات متقدم", desc: "تحليل مجموعات البيانات دون تثبيت الاعتماديات." }
    ],
    detailsTitle: "لماذا تختار PyBrowser OS؟",
    details: [
      "الخصوصية أولاً: كل شيء يعمل محليًا.",
      "بيئة فورية: ابدأ في كتابة الكود في ثوانٍ.",
      "عبر منصات: يعمل على جميع الأجهزة.",
      "تدفقات عمل متكاملة: تجميع الكود وإدارة الملفات في واجهة واحدة."
    ],
    footer: "© 2026 PyBrowser OS. مُصمم للمهندسين المستقبليين."
  },
  hi: {
    heroTitle: "नेक्स्ट जनरेशन ब्राउज़र टर्मिनल",
    heroSubtitle: "WASM-संचालित, AI-रेडी, पूरी तरह से ब्राउज़र-आधारित टर्मिनल OS।",
    launchBtn: "टर्मिनल ओएस लॉन्च करें",
    featuresTitle: "ब्राउज़र में अद्वितीय विशेषताएं",
    features: [
      { icon: 'cpu', title: "WASM आर्किटेक्चर", desc: "बिना सर्वर के पायथन, रस्ट आदि चलाएं।" },
      { icon: 'ai', title: "अंतर्निहित AI टूल", desc: "आपके डिवाइस पर मशीन लर्निंग और विज़न।" },
      { icon: 'data', title: "उन्नत डेटा विज्ञान", desc: "आसानी से डेटा का विश्लेषण करें।" }
    ],
    detailsTitle: "PyBrowser OS क्यों चुनें?",
    details: [
      "गोपनीयता: सब कुछ स्थानीय रूप से चलता है।",
      "त्वरित वातावरण: सेकंड में कोडिंग शुरू करें।",
      "क्रॉस-प्लेटफॉर्म: हर जगह काम करता है।",
      "एकीकृत वर्कफ़्लो: सब कुछ एक जगह पर।"
    ],
    footer: "© 2026 PyBrowser OS."
  },
  ru: {
    heroTitle: "Браузерный терминал следующего поколения",
    heroSubtitle: "Терминальная ОС на базе WASM, готовая к ИИ, полностью в браузере.",
    launchBtn: "Запустить Terminal OS",
    featuresTitle: "Непревзойденные функции в браузере",
    features: [
      { icon: 'cpu', title: "Архитектура WASM", desc: "Запуск Python, Rust, C напрямую. Без серверов." },
      { icon: 'ai', title: "Встроенный ИИ", desc: "Машинное обучение на вашем устройстве." },
      { icon: 'data', title: "Data Science", desc: "Анализ данных без зависимостей." }
    ],
    detailsTitle: "Почему PyBrowser OS?",
    details: [
      "Приватность: все работает локально.",
      "Мгновенная среда: программируйте за секунды.",
      "Кроссплатформенность: работает везде.",
      "Интегрированные процессы: код, файлы и ИИ в одном."
    ],
    footer: "© 2026 PyBrowser OS."
  },
  pt: {
    heroTitle: "O Terminal de Navegador da Próxima Geração",
    heroSubtitle: "SO de terminal baseado em navegador, alimentado por WASM e pronto para IA.",
    launchBtn: "Iniciar Terminal OS",
    featuresTitle: "Recursos Incomparáveis no Navegador",
    features: [
      { icon: 'cpu', title: "Arquitetura WASM", desc: "Execute Python, Rust, C diretamente. Sem necessidade de servidor." },
      { icon: 'ai', title: "Ferramentas de IA", desc: "Aprendizado de máquina no seu dispositivo local." },
      { icon: 'data', title: "Ciência de Dados", desc: "Analise dados sem instalações." }
    ],
    detailsTitle: "Por que escolher o PyBrowser OS?",
    details: [
      "Privacidade: tudo roda localmente.",
      "Ambiente instantâneo: codifique em segundos.",
      "Multiplataforma: roda em qualquer lugar.",
      "Fluxos de trabalho integrados: código e IA juntos."
    ],
    footer: "© 2026 PyBrowser OS."
  },
  it: {
    heroTitle: "Il Terminale Browser di Nuova Generazione",
    heroSubtitle: "Sistema operativo per terminale basato su WASM, pronto per IA, nel browser.",
    launchBtn: "Avvia Terminal OS",
    featuresTitle: "Funzionalità senza precedenti nel browser",
    features: [
      { icon: 'cpu', title: "Architettura WASM", desc: "Esegui Python, Rust, C direttamente. Nessun server necessario." },
      { icon: 'ai', title: "Strumenti IA integrati", desc: "Machine learning sul tuo dispositivo." },
      { icon: 'data', title: "Scienza dei dati", desc: "Analizza i dati senza installazioni." }
    ],
    detailsTitle: "Perché scegliere PyBrowser OS?",
    details: [
      "Privacy: tutto viene eseguito localmente.",
      "Ambiente istantaneo: scrivi codice in pochi secondi.",
      "Multipiattaforma: funziona ovunque.",
      "Flussi di lavoro integrati: tutto in uno."
    ],
    footer: "© 2026 PyBrowser OS."
  },
  ko: {
    heroTitle: "차세대 브라우저 터미널",
    heroSubtitle: "WASM 기반, AI 지원, 완벽한 브라우저 기반 터미널 OS.",
    launchBtn: "Terminal OS 실행",
    featuresTitle: "브라우저 최고의 기능",
    features: [
      { icon: 'cpu', title: "WASM 아키텍처", desc: "서버 없이 Python 등 실행." },
      { icon: 'ai', title: "AI 도구 내장", desc: "디바이스에서 기계 학습." },
      { icon: 'data', title: "데이터 과학", desc: "설치 없이 데이터 분석." }
    ],
    detailsTitle: "PyBrowser OS를 선택하는 이유",
    details: [
      "개인 정보 보호: 모든 것이 로컬에서 실행.",
      "즉각적인 환경: 몇 초 만에 코딩 시작.",
      "크로스 플랫폼: 어디서나 작동.",
      "통합 워크플로우: 코드, 파일, AI 모두 하나로."
    ],
    footer: "© 2026 PyBrowser OS."
  },
  tr: {
    heroTitle: "Yeni Nesil Tarayıcı Terminali",
    heroSubtitle: "WASM destekli, yapay zeka hazır, tamamen tarayıcı tabanlı terminal işletim sistemi.",
    launchBtn: "Terminal OS'i Başlat",
    featuresTitle: "Tarayıcıda Eşsiz Özellikler",
    features: [
      { icon: 'cpu', title: "WASM Mimarisi", desc: "Python, Rust, C'yi doğrudan çalıştırın. Sunucu gerekmez." },
      { icon: 'ai', title: "Gömülü Yapay Zeka", desc: "Cihazınızda makine öğrenimi." },
      { icon: 'data', title: "Veri Bilimi", desc: "Bağımlılık kurmadan veri analizi." }
    ],
    detailsTitle: "Neden PyBrowser OS?",
    details: [
      "Gizlilik: Her şey yerel çalışır.",
      "Anında Ortam: Saniyeler içinde kod yazın.",
      "Çapraz Platform: Her yerde çalışır.",
      "Entegre İş Akışı: Kod ve yapay zeka bir arada."
    ],
    footer: "© 2026 PyBrowser OS."
  },
  nl: {
    heroTitle: "De Browser Terminal van de Volgende Generatie",
    heroSubtitle: "WASM-aangedreven, AI-ready, volledig browser-gebaseerd terminal OS.",
    launchBtn: "Start Terminal OS",
    featuresTitle: "Ongekende Functies in de Browser",
    features: [
      { icon: 'cpu', title: "WASM Architectuur", desc: "Draai Python, Rust direct. Geen server nodig." },
      { icon: 'ai', title: "Ingebouwde AI", desc: "Machine Learning op uw apparaat." },
      { icon: 'data', title: "Data Science", desc: "Analyseer data zonder installaties." }
    ],
    detailsTitle: "Waarom PyBrowser OS?",
    details: [
      "Privacy: Alles draait lokaal.",
      "Directe omgeving: Codeer in seconden.",
      "Cross-platform: Werkt overal.",
      "Geïntegreerde workflows: Alles op één plek."
    ],
    footer: "© 2026 PyBrowser OS."
  }
};

const getIcon = (name: string) => {
  switch (name) {
    case 'cpu': return <Cpu className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />;
    case 'ai': return <Zap className="w-8 h-8 md:w-12 md:h-12 text-purple-400" />;
    case 'data': return <Database className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />;
    default: return <Code className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />;
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
    <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <span className="font-mono font-bold text-lg tracking-wider text-emerald-50">PyBrowser OS</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative" ref={kernelsRef}>
                <button 
                  onClick={() => { setIsKernelsOpen(!isKernelsOpen); setIsLangOpen(false); }}
                  className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                >
                  <Code className="w-4 h-4" />
                  <span>Kernels</span>
                </button>
                <div className={`absolute left-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl transition-all duration-200 z-[60] ${isKernelsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {Object.entries(KERNELS).map(([key, k]) => (
                      <Link 
                        key={key}
                        to={`/kernel/${key}?lang=${currentLangCode}`}
                        className="block px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white"
                        onClick={() => setIsKernelsOpen(false)}
                      >
                        {k.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => { setIsLangOpen(!isLangOpen); setIsKernelsOpen(false); }}
                  className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{currentLangCode}</span>
                </button>
                <div className={`absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl transition-all duration-200 z-[60] ${isLangOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {languages.map(l => (
                      <Link 
                        key={l.code}
                        to={`/${l.code}`}
                        className={`block px-4 py-2 text-sm ${l.code === currentLangCode ? 'bg-emerald-500/10 text-emerald-400' : 'text-neutral-300 hover:bg-white/5 hover:text-white'}`}
                        onClick={() => setIsLangOpen(false)}
                      >
                        <span className="font-bold mr-2">{l.native}</span>
                        <span className="text-neutral-500 text-xs">({l.name})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/terminal')}
                className="hidden md:flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-full transition-all"
              >
                {content.launchBtn} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6"
          >
            {content.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-3xl mx-auto text-xl text-neutral-400"
          >
            {content.heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/terminal')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full transition-all flex items-center gap-2 text-lg shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1"
            >
              <Terminal className="w-5 h-5" />
              {content.launchBtn}
            </button>
          </motion.div>
        </div>
      </div>
      {/* Features Showcase */}
      <div className="py-20 bg-neutral-900/50 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white">{content.featuresTitle}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.features.map((feature: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-neutral-900 border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors group"
              >
                <div className="w-16 h-16 bg-neutral-950 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5">
                  {getIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Deep Dive / Details */}
      <div className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-900/20 to-neutral-900 border border-emerald-500/20 rounded-3xl p-10 md:p-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
              <h2 className="text-3xl font-bold text-white">{content.detailsTitle}</h2>
            </div>
            
            <ul className="space-y-6">
              {content.details.map((detail: string, index: number) => (
                <li key={index} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  </div>
                  <p className="text-lg text-neutral-300 leading-relaxed w-full">
                    <span className="font-bold text-emerald-50">{detail.split(':')[0]}:</span>
                    {detail.substring(detail.indexOf(':') + 1)}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <Terminal className="w-8 h-8 text-neutral-600 mb-4" />
          <p className="text-neutral-500">{content.footer}</p>
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
