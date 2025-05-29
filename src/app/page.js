'use client';
import { Suspense } from 'react';
import { Container, Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Crear el cliente de Query
const queryClient = new QueryClient();

// Configuración del tema de MUI con League Spartan
const theme = createTheme({
  typography: {
    fontFamily: [
      'League Spartan',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

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
const SidebarComponent = dynamic(() => import('@/components/Sidebar/Sidebar'), { ssr: false });
const MobileSidebarContentComponent = dynamic(() => import('@/components/Sidebar/MobileSidebarContent'), { ssr: false });

// Componente estático para el esqueleto de carga
function LoadingSkeleton() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );
}

// Componente de la página principal
export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ my: { xs: 2, md: 2 } }}>
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
            <MobileSidebarContentComponent showSearchAndCategories={true} />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4 }
          }}>
            <Box sx={{ 
              width: { xs: '100%', md: '25%' },
              display: { xs: 'none', md: 'block' }
            }}>
              <SidebarComponent />
            </Box>
            
            <Box sx={{ 
              width: { xs: '100%', md: '75%' },
              flexGrow: 1
            }}>
              <Suspense fallback={<LoadingSkeleton />}>
                <PostGrid />
              </Suspense>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
}