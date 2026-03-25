import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostDetails from './pages/PostDetails';
import AdminDashboard from './pages/AdminDashboard';
import BlogPage from './pages/BlogPage';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-[#fafafa] dark:bg-slate-900 text-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-indigo-600 selection:text-white scroll-smooth overflow-x-hidden transition-colors duration-500">
              <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

              {/* Background decoration */}
              <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl opacity-40"></div>
              </div>

              <main className="relative z-10 pt-32 pb-24 max-w-6xl mx-auto px-6">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<PostDetails />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>

              <footer className="text-center py-12 text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.4em] transition-colors duration-500 mt-20">
                <p>© {new Date().getFullYear()} IHOR SOLOMIANYI • LOGIC-FIRST BLOG ENGINE • Gdansk, Poland</p>
              </footer>
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
