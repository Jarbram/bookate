'use client';
import { ThemeProvider } from '@/context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme';
import { League_Spartan } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Mover estos componentes fuera del componente principal
const HeaderComponent = dynamic(() => import('@/components/Header/Header'), {
  ssr: false,
  loading: () => <div style={{ height: '64px' }} /> // Placeholder mientras carga
});

const FooterComponent = dynamic(() => import('@/components/Footer/Footer'), {
  ssr: false,
  loading: () => <div style={{ height: '64px' }} /> // Placeholder mientras carga
});

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
});

// Crear el cliente fuera del componente para evitar recreaciones innecesarias
const queryClient = new QueryClient()

// Crear un componente separado para el contenido principal
function MainLayout({ children }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <HeaderComponent />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <FooterComponent />
    </div>
  );
}

export default function RootLayout({ children }) {
  useEffect(() => {
    try {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error al cargar AdSense:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="es" className={leagueSpartan.className}>
        <head>
          <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_CLIENT} />
        </head>
        <body>
          <ThemeProvider>
            <CssBaseline />
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}
