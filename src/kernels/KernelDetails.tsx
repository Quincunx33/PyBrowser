import React from 'react';
import { Link } from 'react-router-dom';
import { KERNELS } from '../kernelData';
import { Terminal, ArrowLeft, History, Cpu, Globe, Database, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KernelDetails({ kernelName }: { kernelName: string }) {
  const kernel = KERNELS[kernelName.toLowerCase()];

  if (!kernel) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-4xl font-bold mb-4">Kernel Not Found</h1>
        <p className="text-neutral-500 mb-8 text-center max-w-md">The specific runtime kernel you are looking for does not exist in our current documentation index.</p>
        <Link to="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all">Return to Global Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
             <Terminal className="w-5 h-5 text-emerald-500" />
             <span className="font-mono text-[10px] text-neutral-500 hidden md:block uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Doc v2.4.0</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" />
              Runtime Protocol Verified
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-br from-white via-white to-neutral-600 bg-clip-text text-transparent">
              {kernel.title}
            </h1>
            <p className="text-xl md:text-3xl text-neutral-400 max-w-4xl leading-tight font-medium">
              {kernel.longDescription}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* History Section */}
              <section id="history" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <History className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight">Origin & Evolution</h2>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none">
                  <p className="text-lg md:text-xl text-neutral-300 leading-relaxed">
                    {kernel.history}
                  </p>
                </div>
              </section>

              {/* Architecture Section */}
              <section id="architecture" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Cpu className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight">Architecture & Logic</h2>
                </div>
                <p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-10">
                  {kernel.architecture}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {kernel.features.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 bg-neutral-900 border border-white/5 p-6 rounded-2xl hover:border-emerald-500/40 transition-colors"
                    >
                      <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                      <span className="font-bold text-neutral-100">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Ecosystem Section */}
              <section id="ecosystem" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Globe className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight">Global Ecosystem</h2>
                </div>
                <p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-10">
                  {kernel.ecosystem}
                </p>
                <div className="bg-gradient-to-br from-emerald-950/40 to-neutral-900 p-10 rounded-3xl border border-emerald-500/10">
                   <h4 className="text-xl font-bold mb-4 text-emerald-50">Industrial Adoption</h4>
                   <p className="text-neutral-400">Trusted by major technology organizations worldwide for critical infrastructure, production services, and high-performance engineering tasks. This kernel provides the stability needed for long-term project viability and rapid scaling.</p>
                </div>
              </section>

            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-32">
                {/* Use Case Card */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-b from-emerald-500 to-emerald-800 rounded-[32px] opacity-25 blur-xl group-hover:opacity-40 transition-opacity" />
                  <div className="relative bg-emerald-500 rounded-3xl p-8 text-black overflow-hidden shadow-2xl">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-black/5 rounded-full blur-2xl" />
                    <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                       Primary Use Cases
                    </h3>
                    <p className="text-lg font-bold leading-snug">
                      {kernel.useCases}
                    </p>
                  </div>
                </div>

                {/* Technical Specs Card */}
                <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl mt-8">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <Database className="w-6 h-6 text-emerald-500" />
                    Runtime Specs
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Compiler</span>
                      <span className="text-sm font-mono text-neutral-200">LLVM Edge</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Efficiency</span>
                      <span className="text-sm font-mono text-emerald-400">99.8% Optimized</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Interface</span>
                      <span className="text-sm font-mono text-neutral-200">POSIX Compliant</span>
                    </div>
                  </div>
                  
                  <Link to="/terminal" className="mt-10 w-full flex items-center justify-center gap-2 py-5 bg-white text-black hover:bg-neutral-200 rounded-2xl transition-all font-black text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1">
                     Launch Terminal <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-24 bg-neutral-950 mt-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
            <Terminal className="w-10 h-10 text-neutral-800 mx-auto mb-6" />
            <p className="text-neutral-600 text-xs font-mono uppercase tracking-[0.3em]">Advanced TerminalOS Documentation Infrastructure</p>
            <p className="text-neutral-500 text-sm mt-4">© 2026 Comprehensive Kernel Language Index System. Detailed specification available via API.</p>
        </div>
      </footer>
    </div>
  );
}
