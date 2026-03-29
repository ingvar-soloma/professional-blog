import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostDetails from './pages/PostDetails';
import AdminDashboard from './pages/AdminDashboard';
import BlogPage from './pages/BlogPage';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import {
  Screen,
  Background,
  Section,
  Container,
  Stack,
  Text,
  GithubIcon
} from './components/primitives/SystemicEngine';

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Screen>
      <Background />
      <Navbar />

      <main className="pt-20 w-full flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<PostDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {!isAdminPage && (
        <Section border>
          <Container>
            <Stack vertical={false} justify="between" align="center" gap={8} wrap fullWidth>
              <Text mono muted>&copy; {new Date().getFullYear()} Ihor Solomianyi // Systemic Constructor</Text>
              <Stack vertical={false} gap={6}>
                <a href="https://github.com/ingvar-soloma" target="_blank" rel="noreferrer">
                   <GithubIcon size={18} className="text-gray-700 hover:text-white transition-colors" />
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://ingvarsoloma.dev" target="_blank" rel="noreferrer">
                   <ExternalLink size={18} className="text-gray-700 hover:text-white transition-colors" />
                </a>
              </Stack>
            </Stack>
          </Container>
        </Section>
      )}
    </Screen>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
