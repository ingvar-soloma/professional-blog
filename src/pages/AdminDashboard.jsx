import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Save,
  X,
  LogOut,
  Settings,
  Layers,
  Search,
  Loader2,
  Lock,
  Calendar,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import CodeSnippetConstructor from '../components/admin/CodeSnippetConstructor';
import { z } from 'zod';
import ReactMarkdown from 'react-markdown';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters for quality research"),
  tags: z.array(z.string()),
  date: z.string(),
  read_time: z.string(),
  is_hidden: z.boolean(),
  created_at: z.any().optional()
});

export default function AdminDashboard() {
  const { user, isOwner, login, logout, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    read_time: '',
    is_hidden: false
  });
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'generator'
  const [isPreview, setIsPreview] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      const imageMarkdown = `\n\n![${file.name}](${url})\n\n`;
      setFormData(prev => ({
        ...prev,
        content: prev.content + imageMarkdown
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload architecture asset.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'posts'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchPosts();
    }
  }, [isOwner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = postSchema.parse({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        created_at: editingPost ? editingPost.created_at : serverTimestamp()
      });

      if (editingPost) {
        await updateDoc(doc(db, 'posts', editingPost.id), postData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          views: 0
        });
      }
      setIsFormOpen(false);
      setEditingPost(null);
      setFormData({ title: '', excerpt: '', content: '', tags: '', date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), read_time: '', is_hidden: false });
      fetchPosts();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map(e => e.message).join(", ");
        alert("Validation error: " + messages);
      }
 else {
        alert("Error saving post!");
        console.error(error);
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(', '),
      date: post.date,
      read_time: post.read_time,
      is_hidden: post.is_hidden || false
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this architectural entry?")) {
      await deleteDoc(doc(db, 'posts', id));
      fetchPosts();
    }
  };

  const toggleVisibility = async (post) => {
    await updateDoc(doc(db, 'posts', post.id), {
      is_hidden: !post.is_hidden
    });
    fetchPosts();
  };

  if (authLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-2xl text-center space-y-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white">
          <Lock size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight">Engineering Engine Access</h2>
          <p className="text-gray-500 font-medium">Authentication required to manage architectural insights.</p>
        </div>
        <button
          onClick={login}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20 transition-all hover:translate-y-[-2px]"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="text-center py-24 space-y-4">
        <Lock size={48} className="mx-auto text-amber-500" />
        <h2 className="text-2xl font-black uppercase tracking-tight">Access Restricted</h2>
        <p className="text-gray-500 font-medium">Only the System Architect can access the Registry Dashboard.</p>
        <button onClick={logout} className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">Switch Account</button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 rounded-full w-fit border border-indigo-100 dark:border-indigo-900/50">
            <Settings size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Registry Management</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-500/20 transition-all hover:translate-y-[-2px]"
          >
            <Plus size={20} /> Create Entry
          </button>
          <button
            onClick={logout}
            className="p-3 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
            title="Log out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-3xl w-fit">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'posts' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
        >
          Posts Management
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'generator' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
        >
          Code Generator
        </button>
      </div>

      {activeTab === 'posts' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Entries</p>
              <p className="text-4xl font-black text-indigo-600">{posts.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Views</p>
              <p className="text-4xl font-black text-emerald-600">{posts.reduce((acc, p) => acc + (p.views || 0), 0)}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hidden Entries</p>
              <p className="text-4xl font-black text-amber-500">{posts.filter(p => p.is_hidden).length}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-6">Title</th>
                    <th className="px-8 py-6 hidden md:table-cell">Metrics</th>
                    <th className="px-8 py-6 hidden sm:table-cell">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {posts.map(post => (
                    <tr key={post.id} className="group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="font-extrabold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{post.title}</p>
                          <p className="text-[10px] font-medium text-gray-400">{post.date}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 hidden md:table-cell">
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 transition-colors">
                          <div className="flex items-center gap-1.5"><Eye size={12} className="text-indigo-400" /> {post.views || 0}</div>
                        </div>
                      </td>
                      <td className="px-8 py-6 hidden sm:table-cell">
                        {post.is_hidden ? (
                          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full">Hidden</span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full">Published</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => toggleVisibility(post)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title='Toggle Visibility'>
                            {post.is_hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button onClick={() => handleEdit(post)} className="p-2 text-gray-400 hover:text-emerald-600 transition-colors" title='Edit'>
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title='Delete'>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <CodeSnippetConstructor />
      )}

      {/* Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-[95vw] max-h-[95vh] overflow-y-auto rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-10 relative">
            <button
              onClick={() => { setIsFormOpen(false); setEditingPost(null); }}
              className="absolute top-8 right-8 p-3 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight">{editingPost ? 'Refine Insight' : 'Commit New Architectural Entry'}</h2>
                <p className="text-gray-500 font-medium">Drafting the algorithmic foundations of technical excellence.</p>
              </div>
              <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setIsPreview(false)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isPreview ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreview(true)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isPreview ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Preview
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Insight title..."
                    className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Read Time (e.g. 10 min)</label>
                  <input
                    type="text"
                    required
                    value={formData.read_time}
                    onChange={e => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="12 min"
                    className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Excerpt (Brief summary)</label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="The gist of this insight..."
                  className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    Content (Markdown supported)
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload').click()}
                      disabled={isUploadingImage}
                      className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isUploadingImage ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                      <span className="text-[8px] font-black uppercase">Attach Asset</span>
                    </button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {isPreview && <span className="text-indigo-600 font-bold animate-pulse text-[8px]">LIVE PREVIEW ARCHITECTED</span>}
                </label>
                {isPreview ? (
                  <div className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 px-8 py-8 rounded-[2rem] min-h-[400px] overflow-y-auto prose prose-indigo dark:prose-invert prose-headings:font-black prose-headings:uppercase max-w-none">
                    <ReactMarkdown>{formData.content || "_No content architected yet._"}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    required
                    rows={15}
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder="# Markdown here..."
                    className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 px-6 py-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm leading-relaxed"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="AI, RAG, Architecture"
                    className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Status</label>
                  <div className="flex items-center gap-4 mt-2 h-14">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_hidden: false })}
                      className={`flex-1 h-full rounded-2xl uppercase text-[10px] font-black tracking-widest transition-all ${!formData.is_hidden ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 text-gray-400'}`}
                    >
                      Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_hidden: true })}
                      className={`flex-1 h-full rounded-2xl uppercase text-[10px] font-black tracking-widest transition-all ${formData.is_hidden ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-gray-100 text-gray-400'}`}
                    >
                      Hide (Draft)
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditingPost(null); }}
                  className="px-8 py-4 text-gray-400 font-bold uppercase text-xs hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-3xl font-black uppercase text-sm shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <Save size={20} /> {editingPost ? 'Commit Changes' : 'Commit Insight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
