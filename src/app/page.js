'use client';
import { useEffect, useState, Suspense } from 'react';
import { Container, Typography, Box, Divider, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import airtable from '@/lib/airtable';

// Importar PostGrid de forma dinámica para evitar problemas de hidratación
const PostGrid = dynamic(() => import('@/components/Posts/PostGrid'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  )
});

// Componentes cargados dinámicamente con SSR:false para evitar errores de hidratación
const HeaderComponent = dynamic(() => import('@/components/Header/Header'), { ssr: false });
const FooterComponent = dynamic(() => import('@/components/Footer/Footer'), { ssr: false });
const SidebarComponent = dynamic(() => import('@/components/Sidebar/Sidebar'), { ssr: false });
const MobileSidebarContentComponent = dynamic(() => import('@/components/Sidebar/MobileSidebarContent'), { ssr: false });

// Componente estático para el esqueleto de carga
function LoadingSkeleton() {
  return (
    <Box sx={{ width: '100%', pt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    </Box>
  );
}

// Componente de la página principal
export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

// Componente cliente para el contenido principal
function HomeContent() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar datos solo en el cliente
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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden'
    }}>
      <HeaderComponent />
      <Container 
        maxWidth="lg" 
        sx={{ 
          my: { xs: 4, md: 6 }, 
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {/* Contenido de Sidebar para móvil - solo visible en xs */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4, width: '100%' }}>
          {!loading && <MobileSidebarContentComponent categories={categories} />}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4 },
          width: '100%'
        }}>
          {/* Sidebar - oculto en móvil */}
          <Box sx={{ 
            width: { xs: '100%', md: '25%' },
            flexShrink: 0,
            display: { xs: 'none', md: 'block' }
          }}>
            {!loading && <SidebarComponent categories={categories} />}
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
        {!loading && (
          <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 4 }}>
            <Divider sx={{ mb: 4 }} />
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
              Descubre más
            </Typography>
            <MobileSidebarContentComponent categories={categories} showSearchAndCategories={false} />
          </Box>
        )}
      </Container>
      
      <FooterComponent />
    </Box>
  );
}