import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import CodeSlide from '../components/common/CodeSlide';
import { Helmet } from 'react-helmet-async';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Eye, 
  ChevronLeft,
  Loader2,
  Share2,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Section,
  Container,
  Stack,
  Heading,
  Text,
  Badge,
  Card,
  IconBox,
  Button
} from '../components/primitives/SystemicEngine';

// Fingerprint utility for unique views
const getFingerprint = async () => {
  try {
    const data = navigator.userAgent + screen.width + Intl.DateTimeFormat().resolvedOptions().timeZone;
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return btoa(navigator.userAgent).substring(0, 32);
  }
};

const LinkedinIcon = ({ size = 16, ...props }) => (
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
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        let postData = null;
        let postId = null;
        const q = query(collection(db, 'posts'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRes = querySnapshot.docs[0];
          postData = docRes.data();
          postId = docRes.id;
        } else {
          const docRef = doc(db, 'posts', slug);
          const docRes = await getDoc(docRef);
          if (docRes.exists()) {
            postData = docRes.data();
            postId = docRes.id;
          }
        }
        
        if (postData) {
          setPost({ id: postId, ...postData });
          const docRef = doc(db, 'posts', postId);
          try {
            const fingerprint = await getFingerprint();
            const viewLogRef = doc(db, 'view_logs', `${postId}_${fingerprint}`);
            const viewLogSnap = await getDoc(viewLogRef);
            if (!viewLogSnap.exists()) {
              await setDoc(viewLogRef, { postId, fingerprint, timestamp: serverTimestamp() });
              await updateDoc(docRef, { views: increment(1) });
              setPost(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : null);
            }
          } catch (trackError) { console.warn("Track err:", trackError); }
        } else { navigate('/blog'); }
      } catch (error) { console.error("Fetch err:", error); } finally { setLoading(false); }
    }
    fetchPost();
  }, [slug, navigate]);

  const handleShareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (loading) {
    return (
      <Section py="32" align="center">
        <Stack align="center" gap={4}>
          <Loader2 className="animate-spin text-red-600" size={40} />
          <Text mono muted>Loading neural architecture...</Text>
        </Stack>
      </Section>
    );
  }

  if (!post) return null;
  const postDate = parseISO(post.date);
  const isDateValid = isValid(postDate);

  return (
    <Section py="12">
      <Helmet>
        <title>{post.title} | Ihor Solomianyi</title>
        <meta name="description" content={post.excerpt || post.content.substring(0, 160)} />
        <link rel="canonical" href={`https://ingvarsoloma.dev/blog/${post.slug || post.id}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${post.title} | Ihor Solomianyi`} />
        <meta property="og:description" content={post.excerpt || post.content.substring(0, 160)} />
        <meta property="og:url" content={`https://ingvarsoloma.dev/blog/${post.slug || post.id}`} />
        <meta property="og:image" content={post.image || "https://ingvarsoloma.dev/og-image.png"} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | Ihor Solomianyi`} />
        <meta name="twitter:description" content={post.excerpt || post.content.substring(0, 160)} />
        <meta name="twitter:image" content={post.image || "https://ingvarsoloma.dev/og-image.png"} />
      </Helmet>

      <Container>
        <Stack gap={12}>
          <Stack gap={8}>
            <Button 
               label="Back to Registry" 
               icon={ChevronLeft} 
               variant="ghost" 
               as={Link} 
               to="/blog" 
               style={{ paddingLeft: 0 }}
            />
    
            <Stack gap={8}>
              <Heading level={1}>{post.title}</Heading>
    
              <Stack vertical={false} align="center" gap={6} fullWidth wrap className="pt-6 border-t border-white/5">
                <Stack vertical={false} align="center" gap={2}>
                  <Calendar size={14} className="text-red-900" />
                  <Text size="sm" mono muted>
                    {isDateValid ? formatDistanceToNow(postDate, { addSuffix: true }) : post.date}
                  </Text>
                </Stack>
                <Stack vertical={false} align="center" gap={2}>
                  <Clock size={14} className="text-red-900" />
                  <Text size="sm" mono muted>{post.read_time} read</Text>
                </Stack>
                <Stack vertical={false} align="center" gap={2}>
                  <Eye size={14} className="text-red-900" />
                  <Text size="sm" mono muted>{post.views || 0} views</Text>
                </Stack>
                
                <div className="flex-1" />
                
                <Button 
                   label="Share Insight" 
                   icon={LinkedinIcon} 
                   variant="outline" 
                   size="sm"
                   onClick={handleShareOnLinkedIn} 
                />
              </Stack>
            </Stack>
          </Stack>
    
          {/* ── NANO TERMINAL EMULATION ── */}
          <NanoTerminal post={post} />

          {/* ── TAGS SECTION ── */}
          <Stack gap={4}>
            <Text mono muted size="xs" uppercase tracking="widest">Neural Index Tags</Text>
            <Stack vertical={false} wrap gap={2}>
              {post.tags?.map((tag, i) => (
                <Badge key={i} variant="outline" className="opacity-60 hover:opacity-100 transition-opacity cursor-default">
                  {tag}
                </Badge>
              ))}
            </Stack>
          </Stack>

          {/* ── FOOTER CTA ── */}
          <footer className="mt-14 pt-14 border-t border-white/5">
            <Card interactive padding="8">
               <Stack vertical={false} align="center" justify="between" gap={8} wrap>
                  <Stack gap={2}>
                     <Heading level={3}>Enjoyed this architecture?</Heading>
                     <Text muted size="sm">Share it with your network to bridge the systemic gap.</Text>
                  </Stack>
                  <Button label="Share via LinkedIn" icon={LinkedinIcon} onClick={handleShareOnLinkedIn} />
               </Stack>
            </Card>
          </footer>
        </Stack>
      </Container>
    </Section>
  );
}

const CodeBlock = ({ language, codeString, className }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card padding="0" className="rounded-xl border-red-900/30 overflow-hidden relative group my-6" contentEditable={false}>
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-red-900/30">
        <span className="text-xs font-mono text-gray-400 font-bold uppercase tracking-widest">{language || 'text'}</span>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="text-sm">
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </Card>
  );
};

const SlideDeckBlock = ({ rawContent }) => {
  const [copied, setCopied] = useState(false);
  
  const getConfig = () => {
    try {
      const jsonStr = rawContent.match(/\{[\s\S]*\}/)?.[0] || rawContent;
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  };

  const config = getConfig();

  const handleCopy = () => {
    if (config && config.code) {
      navigator.clipboard.writeText(config.code);
    } else {
      navigator.clipboard.writeText(rawContent);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!config) {
    return (
      <Card padding="6" className="rounded-none border-red-900/50" contentEditable={false}>
        <Stack gap={4}>
           <Badge>Architecture Error</Badge>
           <pre className="overflow-x-auto text-xs opacity-70"><code>{rawContent}</code></pre>
        </Stack>
      </Card>
    );
  }

  return (
    <div className="my-14 w-full flex flex-col items-center select-none relative group" contentEditable={false}>
       <button 
          onClick={handleCopy}
          className="absolute -top-4 -right-4 z-50 p-3 bg-black/80 hover:bg-black text-gray-300 backdrop-blur-md rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
          title="Copy Code"
       >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
       </button>
       <div className="w-full max-w-[850px] transform scale-[0.85] sm:scale-100 origin-center transition-all duration-500">
         <CodeSlide {...config} />
       </div>
    </div>
  );
};

const markdownComponents = {
  pre: ({ children }) => {
    if (React.isValidElement(children)) {
       const codeProps = children.props;
       if (codeProps) {
         const className = codeProps.className || '';
         const match = /language-([\w-]+)/.exec(className);
         const language = match ? match[1] : '';
         const rawContent = String(codeProps.children).replace(/\n$/, '');

         if (language === 'slide-deck' || language === 'slidedeck') {
           return <SlideDeckBlock rawContent={rawContent} />;
         }

         return <CodeBlock language={language} codeString={rawContent} className={className} />;
       }
    }
    return <pre>{children}</pre>;
  },
  code: ({ className, children, ...props }) => {
    return <code className={`text-red-500 font-mono text-[0.8em] font-black px-1.5 py-0.5 bg-red-600/10 rounded-md border border-red-600/20 ${className || ''}`} {...props}>{children}</code>;
  },
  a: ({ node, children, ...props }) => {
    return (
      <a 
        {...props} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-red-500 hover:text-red-400 underline decoration-red-500/30 underline-offset-4 transition-colors font-bold"
        contentEditable={false}
      >
        {children}
      </a>
    );
  }
};

function NanoTerminal({ post }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [cursorRect, setCursorRect] = useState({ top: 0, left: 0, height: 0 });
  const [status, setStatus] = useState('');
  const [allSlugs, setAllSlugs] = useState([]);

  useEffect(() => {
    async function loadSlugs() {
      try {
        const q = query(collection(db, 'posts'));
        const snap = await getDocs(q);
        const slugs = snap.docs.map(d => d.data().slug).sort();
        setAllSlugs(slugs);
      } catch (e) { console.error("Slug load err:", e); }
    }
    loadSlugs();
  }, []);

  const updateCursor = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    const rect = rects.length > 0 ? rects[0] : range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    if (rect && containerRect) {
      setCursorRect({
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
        height: rect.height || 20
      });
    }
  };

  const handleShortcuts = (e) => {
    const key = e.key?.toLowerCase();
    const isControl = e.ctrlKey || e.metaKey;

    if (isControl) {
      if (key === 's') { e.preventDefault(); e.stopPropagation(); setStatus('[ ACCESS VIOLATION ] Root privileges required to save architecture_manifesto.'); setTimeout(() => setStatus(''), 4000); }
      if (key === 'x') { e.preventDefault(); e.stopPropagation(); setStatus('[ SYSTEM ] Terminating session. Returning to registry...'); setTimeout(() => navigate('/blog'), 400); }
      if (key === 'o') { e.preventDefault(); e.stopPropagation(); const others = allSlugs.filter(s => s !== post.slug); if (others.length > 0) { const randomSlug = others[Math.floor(Math.random() * others.length)]; setStatus(`[ SECTOR LOAD ] Initializing sequence: ${randomSlug}...`); setTimeout(() => navigate(`/blog/${randomSlug}`), 600); } }
      if (key === 'v') { e.preventDefault(); e.stopPropagation(); const currentIndex = allSlugs.indexOf(post.slug); const nextIndex = (currentIndex + 1) % allSlugs.length; const nextSlug = allSlugs[nextIndex]; setStatus(`[ FEED ] Next sector detected: ${nextSlug}...`); setTimeout(() => navigate(`/blog/${nextSlug}`), 400); }
      if (key === 'y') { e.preventDefault(); e.stopPropagation(); const currentIndex = allSlugs.indexOf(post.slug); const prevIndex = (currentIndex - 1 + allSlugs.length) % allSlugs.length; const prevSlug = allSlugs[prevIndex]; setStatus(`[ FEED ] Previous sector detected: ${prevSlug}...`); setTimeout(() => navigate(`/blog/${prevSlug}`), 400); }
      if (key === 'g') { e.preventDefault(); e.stopPropagation(); setStatus('[ HELP ] ARROWS: move | ^X: EXIT | ^O: RANDOM | ^V: NEXT | ^Y: PREV | ^L: SHARE'); setTimeout(() => setStatus(''), 6000); }
      if (key === 'l') { e.preventDefault(); e.stopPropagation(); setStatus('[ RELAY ] Forwarding architectural insight to external network...'); const url = encodeURIComponent(window.location.href); setTimeout(() => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank'); setStatus(''); }, 500); }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleShortcuts, { capture: true });
    window.addEventListener('resize', updateCursor);
    const timeout = setTimeout(updateCursor, 100);
    return () => {
      window.removeEventListener('keydown', handleShortcuts, { capture: true });
      window.removeEventListener('resize', updateCursor);
      clearTimeout(timeout);
    };
  }, [allSlugs, post.slug]);

  return (
    <Card padding="0" className="bg-[#050505] border-white/10 rounded-none relative shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-white/10 text-black px-4 py-1 flex justify-between font-mono text-[10px] sm:text-xs font-bold uppercase select-none z-30 shrink-0">
        <span>UW-Terminal 7.2</span>
        <span>File: {post.slug || 'untitled.md'}</span>
        <span>Modified</span>
      </div>
      {status && (
        <div className="bg-red-600 text-white px-6 py-1 font-mono text-[10px] uppercase tracking-tighter animate-pulse z-30 shrink-0">
          {status}
        </div>
      )}
      <div 
        ref={containerRef} contentEditable suppressContentEditableWarning spellCheck={false}
        onKeyUp={updateCursor} onKeyDown={handleShortcuts} onMouseUp={updateCursor} onFocus={updateCursor} onClick={updateCursor} onScroll={updateCursor}
        className="flex-1 overflow-visible prose prose-invert prose-red max-w-none relative outline-none py-10 px-6 sm:px-12 md:px-16 font-mono caret-transparent prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-gray-400 prose-p:leading-relaxed prose-p:font-light prose-pre:p-0 prose-pre:bg-transparent prose-strong:text-white prose-strong:font-black prose-code:text-red-500 z-10"
      >
        <div className="absolute w-2.5 bg-red-600 animate-pulse z-20 shadow-[0_0_15px_rgba(220,38,38,0.7)] pointer-events-none transition-all duration-75"
          style={{ left: `${cursorRect.left}px`, top: `${cursorRect.top}px`, height: `${cursorRect.height}px` }}
        />
        <ReactMarkdown
          components={markdownComponents}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      <div className="border-t border-white/10 bg-black/50 p-4 font-mono text-[9px] sm:text-[10px] tracking-tight text-gray-500 select-none z-30 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2">
           <div className="flex gap-1.5"><span className="bg-white/10 px-1 text-white">^G</span> Get Help</div>
           <div className="flex gap-1.5"><span className="bg-white/10 px-1 text-white">^X</span> Exit</div>
           <div className="flex gap-1.5"><span className="bg-white/10 px-1 text-white">^V</span> Next Post</div>
           <div className="flex gap-1.5"><span className="bg-white/10 px-1 text-white">^Y</span> Prev Post</div>
           <div className="flex gap-1.5"><span className="bg-white/10 px-1 text-white">^L</span> Share</div>
           <div className="flex gap-1.5"><span className="bg-white/10 px-1 text-white">^O</span> Random</div>
           <div className="flex gap-1.5"><span className="bg-white/10 px-1 text-white">^S</span> Save</div>
        </div>
      </div>
    </Card>
  );
}
