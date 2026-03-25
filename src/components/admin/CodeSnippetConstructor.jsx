import React, { useState, useRef } from 'react';
import { 
  Download, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  X,
  FileText,
  Palette
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { 
  vscDarkPlus, 
  solarizedlight,
  nord,
  dracula,
  coldarkDark,
  oneDark,
  atomDark
} from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeSnippetConstructor = () => {
  // Initial slide state
  const createNewSlide = (index) => ({
    id: Date.now() + index,
    title: `Architectural Step ${index + 1}`,
    code: `// Slide ${index + 1}\nfunction processRequest(req) {\n  console.log("Optimizing step ${index + 1}...");\n  return { success: true, timestamp: Date.now() };\n}`,
    filename: `module_v${index + 1}.ts`,
    tags: 'Architecture Design Scaling',
  });

  const [slides, setSlides] = useState([createNewSlide(0)]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const [author, setAuthor] = useState('Ihor Solomianyi');
  const [role, setRole] = useState('Software Engineer');
  const [padding, setPadding] = useState(48);
  const [currentTheme, setCurrentTheme] = useState('minimalist');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const themes = {
    minimalist: {
      name: 'Minimalist Dark',
      bg: 'bg-[#0f172a]',
      card: 'bg-[#1e293b]',
      editor: 'bg-[#0d1117]',
      accent: 'bg-indigo-400',
      text: 'text-white',
      border: 'border-white/10',
      prism: vscDarkPlus
    },
    oceanic: {
      name: 'Oceanic Depth',
      bg: 'bg-[#002b36]',
      card: 'bg-[#073642]',
      editor: 'bg-[#00212b]',
      accent: 'bg-cyan-400',
      text: 'text-cyan-50',
      border: 'border-cyan-500/20',
      prism: coldarkDark
    },
    crimson: {
      name: 'Crimson Night',
      bg: 'bg-[#1a0505]',
      card: 'bg-[#2d0a0a]',
      editor: 'bg-[#140202]',
      accent: 'bg-red-400',
      text: 'text-red-50',
      border: 'border-red-900/30',
      prism: dracula
    },
    cyberpunk: {
      name: 'Cyberpunk',
      bg: 'bg-[#020617]',
      card: 'bg-[#1e1b4b]',
      editor: 'bg-[#0c0a09]',
      accent: 'bg-pink-500',
      text: 'text-white',
      border: 'border-pink-500/50',
      prism: dracula
    },
    nord: {
      name: 'Nordic Frost',
      bg: 'bg-[#2e3440]',
      card: 'bg-[#3b4252]',
      editor: 'bg-[#242933]',
      accent: 'bg-cyan-300',
      text: 'text-[#eceff4]',
      border: 'border-slate-500/20',
      prism: nord
    },
    sepia: {
      name: 'Retro Paper',
      bg: 'bg-[#f4ebd0]',
      card: 'bg-[#eee0b1]',
      editor: 'bg-[#fdf6e3]',
      accent: 'bg-amber-800',
      text: 'text-amber-950',
      border: 'border-amber-900/10',
      prism: solarizedlight
    },
    emerald: {
      name: 'Forest Zen',
      bg: 'bg-[#061e16]',
      card: 'bg-[#0b2b1f]',
      editor: 'bg-[#04140f]',
      accent: 'bg-emerald-400',
      text: 'text-emerald-50',
      border: 'border-emerald-500/10',
      prism: oneDark
    },
    midnight: {
      name: 'Deep Midnight',
      bg: 'bg-black',
      card: 'bg-[#121212]',
      editor: 'bg-black',
      accent: 'bg-indigo-600',
      text: 'text-white',
      border: 'border-white/5',
      prism: atomDark
    }
  };

  const theme = themes[currentTheme];
  const cardRef = useRef(null);
  const currentSlide = slides[currentSlideIndex];

  // Slide management methods
  const addSlide = () => {
    const newSlide = createNewSlide(slides.length);
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const removeSlide = (index) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  const updateCurrentSlide = (field, value) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...newSlides[currentSlideIndex], [field]: value };
    setSlides(newSlides);
  };

  const handleDownloadAll = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className="bg-transparent space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Control Panel */}
        <div className="xl:col-span-4 space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 h-fit">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Slide Deck</h2>
            </div>
            <button 
              onClick={addSlide}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all shadow-lg shadow-indigo-500/20 hover:scale-110 active:scale-95"
              title="Add Slide"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Slide Navigation List */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`flex-none w-12 h-12 rounded-2xl font-black text-xs transition-all flex items-center justify-center border-2 ${
                  currentSlideIndex === idx 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 scale-105' 
                  : 'bg-gray-50 dark:bg-slate-800 border-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                {String(idx + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          
          <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Settings: Slide {currentSlideIndex + 1}</span>
              <button 
                disabled={slides.length <= 1}
                onClick={() => removeSlide(currentSlideIndex)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-30 disabled:hover:text-gray-300"
                title="Remove Slide"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <Palette size={12} /> Theme Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(themes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setCurrentTheme(key)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all group ${
                      currentTheme === key 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' 
                      : 'border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full shadow-inner ${t.bg}`} />
                    <span className={`text-[10px] font-black uppercase tracking-tight truncate ${currentTheme === key ? 'text-indigo-600' : 'text-gray-500'}`}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Step Title</label>
              <input 
                type="text" 
                value={currentSlide.title} 
                onChange={(e) => updateCurrentSlide('title', e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">File</label>
                <input 
                  type="text" 
                  value={currentSlide.filename} 
                  onChange={(e) => updateCurrentSlide('filename', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-xs font-mono font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Tags</label>
                <input 
                  type="text" 
                  value={currentSlide.tags} 
                  onChange={(e) => updateCurrentSlide('tags', e.target.value)}
                  placeholder="Space separated"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center justify-between">
                Code Snippet
                <span className="text-[8px] opacity-60">Markdown support enabled</span>
              </label>
              <textarea 
                value={currentSlide.code} 
                onChange={(e) => updateCurrentSlide('code', e.target.value)}
                rows={8}
                className="w-full p-6 bg-[#0d1117] text-indigo-50 border border-slate-700 rounded-3xl font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed shadow-inner"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Frame Padding</label>
                <span className="text-[10px] font-black text-indigo-600">{padding}px</span>
              </div>
              <input 
                type="range" 
                min="32" 
                max="120" 
                value={padding} 
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-6 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Author</label>
                  <input 
                    value={author} 
                    onChange={e => setAuthor(e.target.value)} 
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-gray-100 dark:border-slate-800 focus:border-indigo-500 outline-none text-sm font-bold transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Role</label>
                  <input 
                    value={role} 
                    onChange={e => setRole(e.target.value)} 
                    className="w-full px-4 py-2 bg-transparent border-b-2 border-gray-100 dark:border-slate-800 focus:border-indigo-500 outline-none text-sm font-bold transition-colors" 
                  />
                </div>
             </div>
            
            <button 
              onClick={handleDownloadAll}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-500/30 active:scale-[0.98] group"
            >
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> 
              Export Collection ({slides.length})
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="xl:col-span-8 flex flex-col items-center justify-start p-6 md:p-12 bg-gray-50 dark:bg-slate-900/50 rounded-[3.5rem] border-2 border-dashed border-gray-200 dark:border-slate-800 min-h-[800px] relative overflow-hidden">
          
          <div className="flex items-center gap-6 mb-10 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 z-10">
            <button 
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              className="p-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all disabled:opacity-20 active:scale-90"
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center px-4">
              <span className="font-black text-sm text-indigo-600 tabular-nums">
                {currentSlideIndex + 1} / {slides.length}
              </span>
              <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Current Step</span>
            </div>
            <button 
              onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
              className="p-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all disabled:opacity-20 active:scale-90"
              disabled={currentSlideIndex === slides.length - 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div 
            ref={cardRef}
            style={{ padding: `${padding}px` }}
            className={`${theme.bg} w-full max-w-[700px] flex flex-col items-center relative transition-all duration-700 ease-out rounded-[3rem] shadow-2xl shadow-black/60 h-auto my-auto ring-1 ring-white/10`}
          >
            {/* Ambient Background Glows */}
            <div className={`absolute -top-24 -right-24 w-96 h-96 blur-[120px] rounded-full opacity-30 ${theme.accent.replace('bg-', 'bg-')} animate-pulse`} />
            <div className={`absolute -bottom-24 -left-24 w-96 h-96 blur-[120px] rounded-full opacity-30 ${theme.accent.replace('bg-', 'bg-')} animate-pulse`} />

            <div className={`relative z-10 w-full flex flex-col items-center ${theme.text}`}>
              
              <div className="text-center mb-10 w-full">
                {/* Structural Label */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black mb-6 backdrop-blur-md border border-white/5 tracking-widest uppercase">
                  <div className={`w-1.5 h-1.5 rounded-full ${theme.accent} animate-pulse`} />
                  STEP {String(currentSlideIndex + 1).padStart(2, '0')}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-[1.1] px-4 drop-shadow-sm">
                  {currentSlide.title}
                </h1>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {currentSlide.tags.split(' ').map((tag, idx) => (
                    <span key={idx} className="text-[9px] font-black px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-white/5 opacity-60 uppercase tracking-[0.2em]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Editor Window */}
              <div className={`${theme.card} w-full flex-none rounded-3xl border ${theme.border} shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>
                <div className="flex items-center justify-between px-6 py-4 bg-black/30 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="opacity-30" />
                    <div className="text-[10px] font-mono font-bold text-white/40 tracking-tight">
                      {currentSlide.filename}
                    </div>
                  </div>
                  <div className="w-12" />
                </div>

                <div className={`${theme.editor} font-mono text-sm h-auto overflow-hidden`}>
                  <SyntaxHighlighter 
                    language="typescript" 
                    style={theme.prism}
                    customStyle={{ 
                      background: 'transparent', 
                      padding: '2rem',
                      margin: 0,
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{ 
                      minWidth: '2.5em', 
                      paddingRight: '1.5em', 
                      color: currentTheme === 'sepia' ? 'rgba(120, 50, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      textAlign: 'right',
                      userSelect: 'none'
                    }}
                    wrapLongLines={true}
                  >
                    {currentSlide.code}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Enhanced Footer */}
              <div className="mt-12 flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${theme.accent} flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-white/10`}>
                    {author.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-sm tracking-tight">{author}</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{role}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                   <div className="flex gap-1.5 p-1 bg-black/20 rounded-full backdrop-blur-sm">
                      {slides.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            i === currentSlideIndex 
                            ? `${theme.accent} w-4 shadow-[0_0_8px_rgba(129,140,248,0.5)]` 
                            : 'bg-white/10'
                          }`} 
                        />
                      ))}
                   </div>
                   <div className="text-[9px] font-black px-4 py-1.5 rounded-full bg-white/5 border border-white/10 opacity-60 uppercase tracking-[0.15em] tabular-nums">
                     Slide {currentSlideIndex + 1} of {slides.length}
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex items-center gap-2 group cursor-default">
            <span className="w-8 h-[1px] bg-gray-300 dark:bg-slate-700 group-hover:w-12 transition-all" />
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
              Use Arrows To Navigate Sequence
            </p>
            <span className="w-8 h-[1px] bg-gray-300 dark:bg-slate-700 group-hover:w-12 transition-all" />
          </div>
        </div>
      </div>

      {/* Export Stub Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-slate-800 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x" />
            
            <button 
               onClick={() => setIsExportModalOpen(false)}
               className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
               <X size={20} />
            </button>

            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
              <Download size={32} />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black uppercase tracking-tight">Exporting Deck</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed px-4">
                Preparing <span className="text-indigo-600 font-bold">{slides.length} high-resolution frames</span> for LinkedIn carousel export.
              </p>
            </div>

            <div className="pt-2">
               <div className="w-full h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                 <div className="w-1/3 h-full bg-indigo-600 rounded-full" />
               </div>
               
               <button 
                onClick={() => setIsExportModalOpen(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 transition-all hover:translate-y-[-2px]"
               >
                Begin Compilation
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSnippetConstructor;
