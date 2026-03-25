import React from 'react';
import { ChevronRight, Calendar, User, Clock } from 'lucide-react';

export default function BlogCard({ post }) {
  const { title, date, excerpt, author, readTime, tags } = post;

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none hover:shadow-2xl dark:hover:border-indigo-900/50 hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={20} className="text-indigo-600" />
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight leading-tight">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
          {excerpt}
        </p>
      </div>

      <footer className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-indigo-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-indigo-400" />
            <span>{readTime} Read</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <User size={12} className="text-indigo-400" />
          <span>{author}</span>
        </div>
      </footer>
    </article>
  );
}
