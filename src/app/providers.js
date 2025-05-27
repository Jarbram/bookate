'use client';
import { ThemeProvider } from '@/context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
} 