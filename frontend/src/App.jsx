import React from 'react';
import { Shield, Sparkles, Cpu, Database, ChevronRight, Layers, FileText } from 'lucide-react';
import ProductList from './components/features/ProductList';

function App() {
  const team = [
    { name: 'Gabin', role: 'Lead Frontend & UI', desc: 'React architecture, UI design system, and global state.' },
    { name: 'Célestin', role: 'Lead Backend & Auth', desc: 'Pure PHP REST API core, DB operations, and user auth.' },
    { name: 'Paul', role: 'Logique des Enchères', desc: 'Real-time bidding controller, timers, and bid verification.' },
    { name: 'Nicolas', role: 'Logique des Négociations', desc: 'Offers negotiation workflow, counter-offers, and status states.' }
  ];

  const specs = [
    { title: 'Frontend', tech: 'React + Vite', status: 'Ready' },
    { title: 'Styling', tech: 'Tailwind CSS (Custom JDM Theme)', status: 'Ready' },
    { title: 'Backend DSN', tech: 'Pure PHP + PDO (MAMP Compatible)', status: 'Ready' },
    { title: 'MySQL Schema', tech: 'init.sql with JDM Seed Data', status: 'Ready' }
  ];

  return (
    <div className="min-h-screen bg-carbon-950 text-carbon-100 flex flex-col justify-between selection:bg-redline selection:text-white">

      {/* Decorative JDM Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-10 border-b border-carbon-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-redline flex items-center justify-center font-black tracking-tighter text-white text-xl">
            MN
          </div>
          <div>
            <span className="font-black text-xl tracking-wider font-sans uppercase">MERCATO <span className="text-redline">NOVA</span></span>
            <p className="text-[10px] text-carbon-300 font-mono tracking-widest uppercase">JDM Automotive Marketplace</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-carbon-900 px-3 py-1.5 rounded-full border border-carbon-700 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-zinc-400">Scaffolding V1.0.0</span>
        </div>
      </header>

      {/* Main Developer Welcome Area */}
      <main className="relative max-w-7xl mx-auto px-6 py-16 flex-grow flex flex-col justify-center z-10 w-full">

        {/* Hero Alert */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 bg-redline/10 text-redline px-3 py-1 rounded-full text-xs font-semibold mb-6 border border-redline/25">
            <Sparkles size={14} />
            <span>Environnement Initialisé avec Succès</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-gradient">Mercato Nova</span>
            <br />
            <span className="text-redline uppercase tracking-wider font-mono text-3xl sm:text-5xl">Japanese Domestic Market</span>
          </h1>
          <p className="text-carbon-300 text-lg max-w-2xl leading-relaxed">
            Le scaffolding technique est en place. La séparation stricte entre le **Front React (Vite)** et l'**API REST PHP (MAMP)** est configurée. Aucun code métier ou UI n'a été créé, conformément au plan.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Tech Stack Specs */}
          <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Cpu className="text-redline" size={20} />
                <h3 className="font-bold text-lg">System Specs</h3>
              </div>
              <div className="space-y-4">
                {specs.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-carbon-700/30">
                    <div>
                      <p className="text-xs text-carbon-300 uppercase tracking-wider font-mono">{spec.title}</p>
                      <p className="font-medium text-sm text-zinc-100">{spec.tech}</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold rounded border border-emerald-500/20">
                      {spec.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-carbon-700/50 flex items-center justify-between text-xs text-carbon-300 font-mono">
              <span>Host Port: 5173</span>
              <span>CORS: Enabled (*)</span>
            </div>
          </div>

          {/* Team Roles */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Layers className="text-driftgold" size={20} />
              <h3 className="font-bold text-lg">Organisation Technique de l'Équipe</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.map((member, i) => (
                <div key={i} className="p-4 rounded-xl bg-carbon-900 border border-carbon-700/50 hover:border-carbon-700 transition duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-zinc-200">{member.name}</h4>
                    <span className="px-2 py-0.5 bg-carbon-800 text-carbon-300 text-[10px] font-mono rounded border border-carbon-700">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-carbon-300 leading-relaxed">{member.desc}</p>
                </div>
              ))}
            </div>

            {/* Next Steps Hint */}
            <div className="mt-6 p-4 rounded-xl bg-driftgold/5 border border-driftgold/20 flex items-start space-x-3">
              <div className="text-driftgold mt-0.5">
                <Shield size={16} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-driftgold">Pre-loaded Seeds Available</h5>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Le fichier <code className="text-zinc-200 font-mono">database/init.sql</code> contient déjà des modèles JDM d'exception (Supra MK4, Skyline R34 GT-R V-Spec II, Mazda RX-7 FD3S, NSX-R NA2) prêts à peupler la base de données.
                </p>
              </div>
            </div>
          </div>

        </div>

        <ProductList />

      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-7xl mx-auto px-6 py-6 border-t border-carbon-700/50 flex flex-col sm:flex-row justify-between items-center text-xs text-carbon-300 font-mono z-10">
        <p>© 2026 Mercato Nova. ING2 ECE School Project.</p>
        <p className="mt-2 sm:mt-0 flex items-center space-x-1">
          <span>Decoupled API Scaffolding</span>
          <ChevronRight size={12} />
          <span className="text-redline font-bold">READY TO BUILD</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
