'use client';
import { useEffect } from 'react';
import { Box } from '@mui/material';

export default function AdUnit({ slot, format = 'auto', responsive = true, style = {} }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error al cargar el anuncio:', error);
    }
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        my: 3,
        overflow: 'hidden',
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </Box>
  );
} 