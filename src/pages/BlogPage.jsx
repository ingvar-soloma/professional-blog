import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import BlogCard from '../components/BlogCard';
import { Layers, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(
          collection(db, 'posts'),
          orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(post => !post.is_hidden);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-4">
                <Layers className="text-indigo-600 w-10 h-10 md:w-16 md:h-16" /> Architectural <span className="text-indigo-600">Registry</span>
             </h1>
             <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                Technical deep-dives into LLM ecosystems, scalable infrastructure, and cognitive engineering.
             </p>
          </div>
          
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by topic or tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <span className="font-black text-xs uppercase tracking-widest text-gray-400">Optimizing logic stream...</span>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map(post => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <BlogCard post={post} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 space-y-4 bg-gray-50 dark:bg-slate-800/20 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800">
          <p className="font-black text-gray-400 uppercase tracking-widest">No entries found in this logic sector.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
