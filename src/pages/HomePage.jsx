import React from 'react';
import { 
  Network, 
  Box, 
  MessageSquare, 
  Terminal, 
  Rocket, 
  ArrowRight, 
  ExternalLink, 
  Cpu, 
  Database,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const cognitiveStats = [
  {
    title: "Systemic Constructor",
    icon: Network,
    color: "indigo",
    desc: "I perceive products as networks of interconnections, integrating solutions without disrupting system integrity."
  },
  {
    title: "Aphantasic Modeling",
    icon: Box,
    color: "emerald",
    desc: "Working in a clean space of logic, providing an advantage in complex Backend development and RAG data processing."
  },
  {
    title: "Verbal-Logical Focus",
    icon: MessageSquare,
    color: "blue",
    desc: "Operating with assertions and internal dialogue, strictly focused on the core algorithm and resilient to visual noise."
  },
  {
    title: "Kinesthetic Feedback",
    icon: Terminal,
    color: "amber",
    desc: "Validating ideas through real-time code interaction, ensuring rapid transition from hypothesis to working features."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
            <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-400">
              Senior Architect & AI Engineer
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
            Engineering <span className="text-indigo-600 dark:text-indigo-400">Insight</span> Through Logic.
          </h1>
          
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
            I document the intersection of systemic architecture, scalable AI ecosystems, and deterministic engineering practices. This is where I articulate the algorithms of my thinking process.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link to="/blog" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:translate-y-[-2px] transition-all flex items-center gap-2">
              Explore Blog <ArrowRight size={20} />
            </Link>
            <a href="https://np42.dev" target="_blank" rel="noreferrer" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-black text-lg hover:shadow-lg hover:translate-y-[-2px] transition-all flex items-center gap-2">
              Neuro Profile <ExternalLink size={20} className="text-indigo-600" />
            </a>
          </div>
        </div>

        <div className="hidden lg:block w-96 h-96 relative">
          <div className="absolute inset-0 bg-indigo-600/10 dark:bg-indigo-500/10 rounded-[4rem] rotate-6 border border-indigo-100 dark:border-indigo-900/30"></div>
          <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl relative z-10 border border-gray-100 dark:border-slate-800 p-8 flex items-center justify-center transition-all duration-700 hover:rotate-2 group">
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-4xl font-black">IS</div>
              <div className="space-y-2">
                <div className="h-1 shadow-sm w-12 bg-indigo-600 rounded-full mx-auto"></div>
                <div className="text-sm font-black text-gray-400 uppercase tracking-widest">Architectural Registry</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <section className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-12 md:p-20 border border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none relative overflow-hidden group text-center">
         <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight">The Architect's Journal</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
               Access my public registry of systemic solutions, technical deep-dives, and cognitive engineering insights.
            </p>
            <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-sm hover:gap-4 transition-all">
               Browse All Insights <ArrowRight size={18} />
            </Link>
         </div>
      </section>

      {/* Engineering Engine (About AI Persona) */}
      <section id="about" className="mb-32">
        <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-12 md:p-20 border border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-950/20 rounded-bl-[100%] -z-10 group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">The <span className="text-emerald-600">Engineering</span> Engine.</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
                  My approach is dictated by my cognitive architecture. I build systems that are not just working, but mathematically and logically sound.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-widest">Tech Stack</h4>
                    <p className="text-xs text-gray-500 font-medium">Laravel, React, LLM Ops, RAG Pipelines</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                    <Database size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-widest">Infrastructure</h4>
                    <p className="text-xs text-gray-500 font-medium">Docker, CI/CD, High-Load Architecture</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cognitiveStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-500 group/stat">
                    <div className={`mb-4 w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm transition-colors duration-500`}>
                      <Icon size={20} className="text-indigo-600" />
                    </div>
                    <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-2">{stat.title}</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{stat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Contact CTA */}
      <section id="contact" className="mt-48 text-center sm:text-left">
        <div className="bg-indigo-600 rounded-[3.5rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/40">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-2xl space-y-8">
              <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">Let's talk systemic architecture.</h2>
              <p className="text-indigo-100 text-lg font-medium opacity-80 leading-relaxed">
                Ready to architect scalable LLM pipelines or refine your high-load infrastructure? Connect for professional consulting or deep technical discussions.
              </p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <a href="mailto:ingvar.soloma@gmail.com" className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
                  Write to Ihor
                </a>
                <a href="https://linkedin.com/in/ingvar-soloma" target="_blank" rel="noreferrer" className="bg-indigo-700/50 backdrop-blur-md text-white border border-indigo-400/30 px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all">
                  LinkedIn Profile
                </a>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-64 h-64 border-4 border-indigo-500 rounded-[3rem] flex items-center justify-center p-8 bg-white/5 backdrop-blur-3xl rotate-6 hover:rotate-0 transition-transform duration-700">
                <Rocket size={80} className="text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
