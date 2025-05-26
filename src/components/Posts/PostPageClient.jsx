'use client';
import { Box } from '@mui/material';
import PostDetail from './PostDetail';
import { useEffect, useState } from 'react';

export default function PostPageClient({ initialPost, slug }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderizar un div vacío con la misma estructura básica
    return (
      <div className="MuiBox-root" style={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
      </div>
    );
  }

  return (
    <div className="MuiBox-root" style={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <PostDetail post={initialPost} />
    </div>
  );
} 