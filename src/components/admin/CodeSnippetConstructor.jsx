import React, { useRef } from 'react';
import { 
  Download, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  FileText,
  Palette,
  Loader2,
  ListOrdered,
  Hash,
  Copy,
  Check
} from 'lucide-react';
import CodeSlide, { slideThemes } from '../common/CodeSlide';

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Zustand Store
import { useSlideStore } from "@/hooks/use-slide-store";

import { toPng } from 'html-to-image';

const CodeSnippetConstructor = () => {
  const {
    slides,
    currentSlideIndex,
    author,
    role,
    padding,
    currentTheme,
    showLineNumbers,
    setShowLineNumbers,
    setAuthor,
    setRole,
    setPadding,
    setCurrentTheme,
    setCurrentSlideIndex,
    addSlide,
    removeSlide,
    updateCurrentSlide
  } = useSlideStore();

  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [exportProgress, setExportProgress] = React.useState(0);
  const [isExporting, setIsExporting] = React.useState(false);

  // ... rest of themes ...

  const handleBeginCompilation = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    const originalIndex = currentSlideIndex;
    
    try {
      for (let i = 0; i < slides.length; i++) {
        // Switch slide
        setCurrentSlideIndex(i);
        setExportProgress(Math.round(((i) / slides.length) * 100));
        
        // Wait for render and theme application
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        if (cardRef.current) {
          const dataUrl = await toPng(cardRef.current, { 
            quality: 0.95,
            pixelRatio: 3, // 3x for ultra high resolution
            style: {
              transform: 'scale(1)',
              margin: '0',
            },
            filter: (node) => {
              // Exclude the ambient glows that extend beyond the card boundaries
              if (node.classList && (node.classList.contains('blur-[120px]') || node.classList.contains('animate-pulse'))) return false;
              return true;
            }
          });
          
          const link = document.createElement('a');
          link.download = `slide-${String(i + 1).padStart(2, '0')}-${slides[i].title.toLowerCase().replace(/\s+/g, '-')}.png`;
          link.href = dataUrl;
          link.click();
        }
      }
      setExportProgress(100);
      setTimeout(() => {
        setIsExportModalOpen(false);
        setIsExporting(false);
        setCurrentSlideIndex(originalIndex);
      }, 1000);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to architect the final export.');
      setIsExporting(false);
    }
  };

  const [copied, setCopied] = React.useState(false);

  const handleCopyToClipboard = () => {
    const config = {
      title: currentSlide.title,
      code: currentSlide.code,
      filename: currentSlide.filename,
      tags: currentSlide.tags,
      themeKey: currentTheme,
      author: author,
      role: role,
      padding: padding[0],
      showLineNumbers: showLineNumbers,
      stepNumber: currentSlideIndex + 1,
      totalSteps: slides.length
    };

    const markdown = "```slide-deck\n" + JSON.stringify(config, null, 2) + "\n```";
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const theme = slideThemes[currentTheme];
  const cardRef = useRef(null);
  const currentSlide = slides[currentSlideIndex];

  const handleDownloadAll = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className="bg-transparent space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Control Panel */}
        <div className="xl:col-span-4 space-y-6 bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 h-fit">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Slide Deck</h2>
            </div>
            <Button 
              size="icon"
              onClick={addSlide}
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 w-12 h-12"
              title="Add Slide"
            >
              <Plus size={24} />
            </Button>
          </div>

          {/* Slide Navigation List */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {slides.map((_, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`flex-none w-12 h-12 rounded-2xl font-black text-xs transition-all flex items-center justify-center border-2 ${
                  currentSlideIndex === idx 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 scale-105' 
                  : 'bg-gray-50 dark:bg-slate-900 border-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {String(idx + 1).padStart(2, '0')}
              </Button>
            ))}
          </div>
          
          <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Settings: Slide {currentSlideIndex + 1}</span>
              <Button 
                variant="ghost"
                size="icon"
                disabled={slides.length <= 1}
                onClick={() => removeSlide(currentSlideIndex)}
                className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-30"
                title="Remove Slide"
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <Palette size={12} /> Theme Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(slideThemes).map(([key, t]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    onClick={() => setCurrentTheme(key)}
                    className={`flex items-center gap-3 px-4 py-8 rounded-2xl border-2 transition-all group h-auto justify-start ${
                      currentTheme === key 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10' 
                      : 'border-gray-50 dark:border-slate-950 bg-gray-50/50 dark:bg-slate-950/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full shadow-inner ${t.bg}`} />
                    <span className={`text-[10px] font-black uppercase tracking-tight truncate ${currentTheme === key ? 'text-indigo-600' : 'text-gray-500'}`}>{t.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <ListOrdered size={12} /> Code Configuration
              </label>
              <div className="flex p-1 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setShowLineNumbers(true)}
                  className={`flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest py-3 transition-all ${
                    showLineNumbers 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Line Numbers
                </button>
                <button
                  type="button"
                  onClick={() => setShowLineNumbers(false)}
                  className={`flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest py-3 transition-all ${
                    !showLineNumbers 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Pure Code
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Step Title</label>
              <Input 
                value={currentSlide.title} 
                onChange={(e) => updateCurrentSlide('title', e.target.value)}
                className="rounded-2xl bg-gray-50 dark:bg-slate-950 border-gray-100 dark:border-white/5 font-bold h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">File</label>
                <Input 
                  value={currentSlide.filename} 
                  onChange={(e) => updateCurrentSlide('filename', e.target.value)}
                  className="rounded-2xl bg-gray-50 dark:bg-slate-950 border-gray-100 dark:border-white/5 text-xs font-mono font-bold h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Tags</label>
                <Input 
                  value={currentSlide.tags} 
                  onChange={(e) => updateCurrentSlide('tags', e.target.value)}
                  placeholder="Space separated"
                  className="rounded-2xl bg-gray-50 dark:bg-slate-950 border-gray-100 dark:border-white/5 text-xs font-bold h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center justify-between">
                Code Snippet
                <span className="text-[8px] opacity-60">Syntax highlighting active</span>
              </label>
              <Textarea 
                value={currentSlide.code} 
                onChange={(e) => updateCurrentSlide('code', e.target.value)}
                rows={8}
                className="p-6 bg-[#0d1117] text-indigo-50 border-slate-700 rounded-3xl font-mono text-xs focus-visible:ring-indigo-500/20 leading-relaxed shadow-inner"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Frame Padding</label>
                <span className="text-[10px] font-black text-indigo-600">{padding[0]}px</span>
              </div>
              <Slider 
                value={padding} 
                onValueChange={setPadding} 
                min={32} 
                max={120} 
                step={1} 
                className="py-4"
              />
            </div>
          </div>

          <div className="pt-6 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Author</label>
                  <Input 
                    value={author} 
                    onChange={e => setAuthor(e.target.value)} 
                    className="bg-transparent border-0 border-b-2 border-gray-100 dark:border-white/5 rounded-none focus-visible:ring-0 focus-visible:border-indigo-500 p-0 h-8 text-sm font-bold transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Role</label>
                  <Input 
                    value={role} 
                    onChange={e => setRole(e.target.value)} 
                    className="bg-transparent border-0 border-b-2 border-gray-100 dark:border-white/5 rounded-none focus-visible:ring-0 focus-visible:border-indigo-500 p-0 h-8 text-sm font-bold transition-colors" 
                  />
                </div>
             </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleDownloadAll}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 group"
              >
                <Download size={16} className="mr-2 group-hover:translate-y-0.5 transition-transform" /> 
                PNG ({slides.length})
              </Button>
              <Button 
                onClick={handleCopyToClipboard}
                variant="outline"
                className={`font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl transition-all border-2 ${
                  copied 
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50' 
                  : 'border-gray-100 hover:border-indigo-600 hover:text-indigo-600'
                }`}
              >
                {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                {copied ? 'Copied' : 'MD Block'}
              </Button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="xl:col-span-8 flex flex-col items-center justify-start p-6 md:p-12 bg-gray-50 dark:bg-slate-950/50 rounded-[3.5rem] border-2 border-dashed border-gray-200 dark:border-white/5 min-h-[800px] relative overflow-hidden">
          
          <div className="flex items-center gap-6 mb-10 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 z-10">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              className="rounded-xl transition-all disabled:opacity-20 active:scale-90"
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="flex flex-col items-center px-4">
              <span className="font-black text-sm text-indigo-600 tabular-nums">
                {currentSlideIndex + 1} / {slides.length}
              </span>
              <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Current Step</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
              className="rounded-xl transition-all disabled:opacity-20 active:scale-90"
              disabled={currentSlideIndex === slides.length - 1}
            >
              <ChevronRight size={20} />
            </Button>
          </div>

          <CodeSlide 
            ref={cardRef}
            title={currentSlide.title}
            code={currentSlide.code}
            filename={currentSlide.filename}
            tags={currentSlide.tags}
            themeKey={currentTheme}
            author={author}
            role={role}
            padding={padding[0]}
            showLineNumbers={showLineNumbers}
            stepNumber={currentSlideIndex + 1}
            totalSteps={slides.length}
          />
          
          <div className="mt-10 flex items-center gap-2 group cursor-default">
            <span className="w-8 h-[1px] bg-gray-300 dark:bg-slate-700 group-hover:w-12 transition-all" />
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
              Use Arrows To Navigate Sequence
            </p>
            <span className="w-8 h-[1px] bg-gray-300 dark:bg-slate-700 group-hover:w-12 transition-all" />
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[3rem] p-10 border-gray-100 dark:border-white/5 bg-white dark:bg-slate-950 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          
          <DialogHeader className="space-y-6 pt-4">
            <div className={`w-20 h-20 ${isExporting ? 'bg-indigo-600 text-white animate-bounce' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'} rounded-3xl mx-auto flex items-center justify-center shadow-inner transition-all duration-500`}>
              <Download size={32} />
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                {isExporting ? `Compiling Deck (${exportProgress}%)` : 'Exporting Deck'}
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed px-4">
                {isExporting 
                  ? 'Switching neural nodes and capturing high-resolution frames...' 
                  : `Preparing architecture for ${slides.length} frames for LinkedIn. High-resolution PNG output.`
                }
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="pt-4 space-y-8">
             <div className="relative w-full h-3 bg-gray-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
               <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${exportProgress}%` }}
               />
               {isExporting && (
                 <div className="absolute inset-0 bg-white/20 animate-pulse" />
               )}
             </div>
             
             <Button 
              onClick={handleBeginCompilation}
              disabled={isExporting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-3"
             >
               {isExporting ? (
                 <>
                   <Loader2 size={18} className="animate-spin" /> ARCHITECTING...
                 </>
               ) : (
                 <>
                   <Download size={18} /> BEGIN COMPILATION
                 </>
               )}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodeSnippetConstructor;
