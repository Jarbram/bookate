'use client';
import { useEffect } from 'react';
import { Box } from '@mui/material';

export default function AdUnit({ slot, format = 'auto', responsive = true, style = {} }) {
  useEffect(() => {
    // Asegurarse de que el contenedor tenga dimensiones antes de cargar el anuncio
    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Error al cargar el anuncio:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        my: 3,
        overflow: 'hidden',
        width: '100%', // Asegurar que tenga ancho
        minHeight: '250px', // Altura mínima por defecto
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          textAlign: 'center',
          width: '100%',
          height: '250px', // Altura explícita
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </Box>
  );
} 