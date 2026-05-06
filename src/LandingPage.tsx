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
