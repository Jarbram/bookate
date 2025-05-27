'use client';
import { ThemeProvider } from '@/context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme';
import { League_Spartan } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
});

// Crear el cliente fuera del componente para evitar recreaciones innecesarias
const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="es" className={leagueSpartan.className}>
        <body>
          {children}
        </body>
      </html>
    </QueryClientProvider>
  );
}
