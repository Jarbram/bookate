'use client';
import { useEffect, useState } from 'react';
import { Container, Typography, Box, Divider, CircularProgress } from '@mui/material';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import PostGrid from '@/components/Posts/PostGrid';
import Footer from '@/components/Footer/Footer';
import MobileSidebarContent from '@/components/Sidebar/MobileSidebarContent';
import airtable from '@/lib/airtable';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener datos de forma paralela
        const [postsData, categoriesData] = await Promise.all([
          airtable.getPosts({ limit: 12 }),
          airtable.getCategories()
        ]);
        
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ my: { xs: 6, md: 6 }, flex: 1 }}>
        {/* Contenido de Sidebar para móvil - solo visible en xs */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
          <MobileSidebarContent categories={categories} />
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4 }
        }}>
          {/* Sidebar - oculto en móvil */}
          <Box sx={{ 
            width: { xs: '100%', md: '25%' },
            flexShrink: 0,
            display: { xs: 'none', md: 'block' }
          }}>
            <Sidebar categories={categories} />
          </Box>
          
          {/* Posts Grid - ancho completo en móvil */}
          <Box sx={{ 
            width: { xs: '100%', md: '75%' },
            flexGrow: 1
          }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <PostGrid posts={posts} />
            )}
          </Box>
        </Box>
        
        {/* Contenido adicional del Sidebar en móvil (después de los posts) */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 4 }}>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Descubre más
          </Typography>
          <MobileSidebarContent categories={categories} showSearchAndCategories={false} />
        </Box>
      </Container>
      
      <Footer />
    </Box>
  );
}