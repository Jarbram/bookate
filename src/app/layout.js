'use client';
import { ThemeProvider } from '@/context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme';
import { League_Spartan } from 'next/font/google';

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={leagueSpartan.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
