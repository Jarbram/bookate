'use client';
import { Box, Typography, alpha } from '@mui/material';

export default function AdPlaceholder({ location = 'post_top' }) {
  // Determinar el tamaño según la ubicación
  let height = '90px';
  let label = 'Anuncio';
  
  if (location === 'post_middle') {
    height = '250px';
    label = 'Anuncio - Contenido patrocinado';
  } else if (location === 'post_bottom') {
    height = '120px';
    label = 'Anuncio - Recomendación';
  } else if (location === 'sidebar') {
    height = '300px';
    label = 'Anuncio';
  }
  
  return (
    <Box 
      sx={{
        width: '100%',
        height,
        backgroundColor: alpha('#000', 0.03),
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed rgba(0,0,0,0.1)',
        position: 'relative'
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          color: alpha('#000', 0.4),
          fontWeight: 500,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          fontSize: '0.7rem'
        }}
      >
        {label}
      </Typography>
      
      {/* En el futuro se reemplazaría este placeholder con el código real del anuncio */}
    </Box>
  );
} 