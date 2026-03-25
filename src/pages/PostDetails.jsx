import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import CodeSlide from '../components/common/CodeSlide';
import { Helmet } from 'react-helmet-async';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Calendar as CalendarIcon, 
  ExternalLink,
  ChevronLeft,
  Share2,
  Loader2
} from 'lucide-react';

// Fingerprint utility for unique views
const getFingerprint = async () => {
  try {
    const data = navigator.userAgent + screen.width + Intl.DateTimeFormat().resolvedOptions().timeZone;
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback to simpler ID if crypto fails
    return btoa(navigator.userAgent).substring(0, 32);
  }
};

const LinkedinIcon = ({ size = 24, ...props }) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPost({ id: docSnap.id, ...data });
          
          // Unique View Tracking
          try {
            const fingerprint = await getFingerprint();
            const viewLogRef = doc(db, 'view_logs', `${id}_${fingerprint}`);
            const viewLogSnap = await getDoc(viewLogRef);
            
            if (!viewLogSnap.exists()) {
              await setDoc(viewLogRef, {
                postId: id,
                fingerprint,
                timestamp: serverTimestamp()
              });
              
              await updateDoc(docRef, {
                views: increment(1)
              });
              
              // Local update for immediate feedback
              setPost(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : null);
            }
          } catch (trackError) {
            console.warn("View tracking failed:", trackError);
          }
        } else {
          console.error("No such post!");
          navigate('/blog');
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, navigate]);

  const handleShareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <span className="font-black text-xs uppercase tracking-widest text-gray-400">Loading neural architecture...</span>
      </div>
    );
  }

  if (!post) return null;

  // Defensive date processing
  const postDate = parseISO(post.date);
  const isDateValid = isValid(postDate);

  return (
    <article className="max-w-4xl mx-auto space-y-12">
      <Helmet>
        <title>{post.title} | Ihor Solomianyi</title>
        <meta name="description" content={post.excerpt || post.content.substring(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content="Ihor Solomianyi" />
      </Helmet>

      <button 
        onClick={() => navigate('/blog')}
        className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-widest hover:gap-4 transition-all"
      >
        <ChevronLeft size={16} /> Back to Registry
      </button>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-2" title={post.date}>
            <CalendarIcon size={14} className="text-indigo-400" />
            <span>
              {isDateValid 
                ? formatDistanceToNow(postDate, { addSuffix: true }) 
                : post.date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-indigo-400" />
            <span>{post.read_time} read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-indigo-400" />
            <span>{post.views || 0} views</span>
          </div>
          
          <div className="flex-1" />
          
          <button 
            onClick={handleShareOnLinkedIn}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-indigo-500/20 active:translate-y-0"
          >
            <LinkedinIcon size={16} />
            <span className="hidden xs:inline">Share Insight</span>
          </button>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert prose-indigo prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-pre:p-0 max-w-none text-gray-600 dark:text-gray-300 font-medium">
        <ReactMarkdown
          components={{
            pre: ({ children }) => <>{children}</>,
            code({ node, inline, className, children, ...props }) {
              const match = /language-([\w-]+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (!inline && (language === 'slide-deck' || language === 'slidedeck')) {
                try {
                  const rawContent = String(children).trim();
                  // More robust JSON extraction in case of markdown artifacts
                  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
                  const config = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
                  
                  return (
                    <div className="my-14 w-full flex flex-col items-center overflow-x-visible">
                       <div className="w-full max-w-[850px] transform scale-[0.85] sm:scale-100 origin-center transition-all duration-500">
                         <CodeSlide {...config} />
                       </div>
                    </div>
                  );
                } catch (e) {
                  console.warn("Slide configuration error:", e);
                  return (
                    <div className="my-8 p-6 bg-red-50 dark:bg-red-900/10 border border-red-500/20 rounded-3xl">
                      <p className="text-red-500 text-xs font-black uppercase mb-4">Architecture Rendering Failed</p>
                      <pre className="overflow-x-auto text-[10px] opacity-70">
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    </div>
                  );
                }
              }
              
              return !inline ? (
                <pre className="p-3 bg-gray-50 dark:bg-slate-950 rounded-2xl overflow-x-auto text-xs">
                  <code className={className} {...props}>{children}</code>
                </pre>
              ) : (
                <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded font-bold text-indigo-600 dark:text-indigo-400" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <footer className="mt-20 pt-12 border-t border-gray-100 dark:border-slate-800 space-y-12">
        <div className="bg-indigo-600/5 dark:bg-indigo-950/20 p-8 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-center sm:text-left space-y-2">
            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Enjoyed this architecture?</h4>
            <p className="text-sm text-gray-500 font-medium">Share it with your network on LinkedIn to bridge the systemic gap.</p>
          </div>
          <button 
            onClick={handleShareOnLinkedIn}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3"
          >
            <LinkedinIcon size={20} /> Share via LinkedIn
          </button>
        </div>
      </footer>
    </article>
  );
}
