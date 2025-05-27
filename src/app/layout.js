'use client';
import { ThemeProvider } from '@/context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme';
import { League_Spartan } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react';

import { Providers } from './providers';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
});

// Crear el cliente fuera del componente para evitar recreaciones innecesarias
const queryClient = new QueryClient()

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
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </QueryClientProvider>
  );
}
