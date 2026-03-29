import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { FileText } from 'lucide-react';
import { 
  vscDarkPlus, 
  solarizedlight,
  nord,
  dracula,
  coldarkDark,
  oneDark,
  atomDark
} from 'react-syntax-highlighter/dist/esm/styles/prism';

export const slideThemes = {
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

const CodeSlide = React.forwardRef(({ 
  title, 
  code, 
  filename, 
  tags = '', 
  themeKey = 'minimalist', 
  author = 'Engineer', 
  role = 'Software Engineer', 
  padding = 36, 
  showLineNumbers = true,
  stepNumber = 1,
  totalSteps = 1
}, ref) => {
  const theme = slideThemes[themeKey] || slideThemes.minimalist;
  
  return (
    <div 
      ref={ref}
      style={{ padding: `${padding}px` }}
      className={`not-prose ${theme.bg} w-full max-w-[850px] flex flex-col items-center relative rounded-[3rem] shadow-2xl h-auto my-auto ring-1 ring-white/10 overflow-hidden`}
    >
      {/* Ambient Background Glows */}
      <div className={`absolute -top-24 -right-24 w-96 h-96 blur-[120px] rounded-full opacity-30 ${theme.accent.replace('bg-', 'bg-')} animate-pulse`} />
      <div className={`absolute -bottom-24 -left-24 w-96 h-96 blur-[120px] rounded-full opacity-30 ${theme.accent.replace('bg-', 'bg-')} animate-pulse`} />

      <div className={`relative z-10 w-full flex flex-col items-stretch ${theme.text}`}>
        <div className="text-center mb-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black mb-6 backdrop-blur-md border border-white/5 tracking-widest uppercase">
            <div className={`w-1.5 h-1.5 rounded-full ${theme.accent} animate-pulse`} />
            STEP {String(stepNumber).padStart(2, '0')}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-[1.1] px-4 drop-shadow-sm">
            {title}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-2">
            {tags.split(' ').map((tag, idx) => (
              tag && <span key={idx} className="text-[9px] font-black px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-white/5 opacity-60 uppercase tracking-[0.2em]">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className={`${theme.card} w-full flex-none rounded-3xl border ${theme.border} shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>
          <div className="flex items-center justify-between px-6 py-4 bg-black/30 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm" />
            </div>
            <div className="flex items-center gap-2">
              <FileText size={12} className="opacity-30" />
              <div className="text-[10px] font-mono font-bold text-white/60 tracking-tight">
                {filename}
              </div>
            </div>
            <div className="w-12" />
          </div>

          <div className={`${theme.editor} font-mono text-sm h-auto overflow-hidden`}>
            <SyntaxHighlighter 
              language="typescript" 
              style={theme.prism}
              customStyle={{ 
                backgroundColor: 'transparent', 
                padding: '0.3rem',
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.6'
              }}
              showLineNumbers={showLineNumbers}
              wrapLongLines={true}
              lineProps={{
                style: {
                  position: 'relative',
                  paddingLeft: showLineNumbers ? '3.5em' : '1.25em',
                  whiteSpace: 'pre-wrap',
                  display: 'block',
                }
              }}
              lineNumberStyle={{ 
                position: 'absolute',
                left: 0,
                width: '3em',
                textAlign: 'right',
                paddingRight: '0.5em',
                color: themeKey === 'sepia' ? 'rgba(120, 50, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                userSelect: 'none',
                display: showLineNumbers ? 'block' : 'none'
              }}
              codeTagProps={{
                style: {
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  display: 'inline',
                }
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${theme.accent} flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-white/10 overflow-hidden`}>
              <img 
                src="/avatar.jpg" 
                alt={author} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = author.charAt(0);
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight">{author}</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{role}</span>
            </div>
          </div>

          <div className="text-[9px] font-black px-4 py-1.5 rounded-full bg-white/5 border border-white/10 opacity-60 uppercase tracking-[0.15em] tabular-nums">
            Slide {stepNumber} of {totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CodeSlide;
