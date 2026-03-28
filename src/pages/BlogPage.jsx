import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import BlogCard from '../components/BlogCard';
import { Layers, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Section,
  Container,
  Grid,
  Stack,
  Display,
  Heading,
  Text,
  Badge,
  Card,
  IconBox
} from '../components/primitives/SystemicEngine';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, 'posts'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
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
    <Section py="12">
      <Helmet>
        <title>Architectural Registry | Ihor Solomianyi</title>
        <meta name="description" content="Technical deep-dives into LLM ecosystems, high-load infrastructure, and the physics of thought. Explore the registry of logic." />
      </Helmet>
      
      <Container>
        <Stack gap={12}>
          <header>
            <Stack gap={8}>
              <Stack vertical={false} align="end" justify="between" gap={6} wrap>
                <Stack gap={2}>
                   <Stack vertical={false} align="center" gap={4}>
                      <IconBox icon={Layers} color="red" />
                      <Heading level={2}>Architectural <span className="text-red-500">Registry</span></Heading>
                   </Stack>
                   <Text size="lg" muted maxWidth>
                      Technical deep-dives into LLM ecosystems, high-load infrastructure, and the physics of thought.
                   </Text>
                </Stack>
    
                <div className="relative group w-full md:w-80 mb-8 md:mb-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by topic or tag..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-white/10 text-white rounded-xl focus:outline-none focus:border-red-600/50 transition-all font-mono text-xs uppercase tracking-widest"
                  />
                </div>
              </Stack>
            </Stack>
          </header>
    
          {loading ? (
            <Section py="12" align="center">
              <Stack align="center" gap={4}>
                <Loader2 className="animate-spin text-red-600" size={40} />
                <Text mono muted>Optimizing logic stream...</Text>
              </Stack>
            </Section>
          ) : filteredPosts.length > 0 ? (
            <Grid cols={1} md={2} gap={8}>
              {filteredPosts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug || post.id}`}>
                  <BlogCard post={post} />
                </Link>
              ))}
            </Grid>
          ) : (
            <Card padding="12">
              <Stack align="center" gap={4} justify="center">
                <Text mono muted>No entries found in this logic sector.</Text>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-red-600 font-black text-xs uppercase tracking-widest hover:underline"
                >
                  RE-INITIALIZE SEARCH
                </button>
              </Stack>
            </Card>
          )}
        </Stack>
      </Container>
    </Section>
  );
}
