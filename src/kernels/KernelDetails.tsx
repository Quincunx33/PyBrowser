import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { KERNELS } from '../kernelData';
import { Terminal, ArrowLeft, Code } from 'lucide-react';

export default function KernelDetails({ kernelName }: { kernelName: string }) {
  const kernel = KERNELS[kernelName.toLowerCase()];

  if (!kernel) {
    return <div className="text-white">Kernel not found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-8">
      <Link to="/" className="flex items-center text-emerald-400 mb-8 hover:text-emerald-300">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
      
      <div className="max-w-4xl mx-auto bg-neutral-900 border border-white/10 rounded-3xl p-10">
        <div className="flex items-center gap-4 mb-6">
            <Terminal className="w-12 h-12 text-emerald-500" />
            <h1 className="text-5xl font-extrabold">{kernel.title}</h1>
        </div>
        <p className="text-2xl text-neutral-300 mb-8">{kernel.longDescription}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-neutral-950 p-6 rounded-xl border border-white/5">
            <h3 className="font-bold text-emerald-400 mb-4">Key Features</h3>
            <ul className="list-disc ml-6 space-y-2">
              {kernel.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
          <div className="bg-neutral-950 p-6 rounded-xl border border-white/5">
            <h3 className="font-bold text-emerald-400 mb-4">Common Use Cases</h3>
            <p className="text-neutral-300">{kernel.useCases}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
