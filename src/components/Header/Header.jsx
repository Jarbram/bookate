'use client';
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container
} from '@mui/material';

export default function Header() {
  // Variables de estilo (simplificadas)
  const bgColor = '#ffffff';
  const textColor = '#303030';
  const accentColor = '#2e7d32';

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: bgColor,
        borderBottom: `1px solid #eaeaea`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: '64px' }}>
          {/* Layout simplificado para móvil y desktop */}
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Logo */}
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: 700,
                color: textColor,
                fontSize: { xs: '1.2rem', md: '1.3rem' },
              }}
            >
              <Box component="span" sx={{ color: accentColor }}>BOOK</Box>ATE
            </Typography>
            
            {/* Botón de suscripción */}
            <Button
              variant="contained"
              sx={{ 
                bgcolor: accentColor,
                color: 'white',
                fontWeight: 500,
                px: { xs: 1.5, md: 2 },
                py: { xs: 0.5, md: 0.8 },
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              Suscribirse
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 