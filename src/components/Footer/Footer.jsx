'use client';
import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton,
  Stack,
  Fade,
  Divider,
  useScrollTrigger,
  Chip,
  alpha,
  TextField,
  Button
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BookIcon from '@mui/icons-material/Book';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PinterestIcon from '@mui/icons-material/Pinterest';
import { motion } from 'framer-motion';

export default function Footer({ darkMode = false }) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Colores primarios del tema (manteniendo coherencia con el Header)
  const primaryLight = '#6200ea';
  const primaryDark = '#bb86fc';
  const bgColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a';
  const accentColor = darkMode ? '#bb86fc' : '#6200ea';
  const secondaryBg = darkMode ? '#1a1a1a' : '#f8f9fa';
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.3;
      setIsVisible(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Variantes para animaciones
  const linkVariants = {
    hover: {
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundImage: darkMode 
          ? 'linear-gradient(to bottom, #121212, #1a1a1a)'
          : 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 10 },
        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eaeaea'}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos mejorados */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(accentColor, 0.08)} 0%, transparent 70%)`,
          zIndex: 0,
          display: { xs: 'none', md: 'block' }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-8%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(accentColor, 0.05)} 0%, transparent 70%)`,
          zIndex: 0,
          display: { xs: 'none', md: 'block' }
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Sección superior revisada */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'flex-start' },
          mb: { xs: 5, md: 7 },
          gap: { xs: 3, md: 4 }
        }}>
          <Box sx={{ 
            mb: { xs: 1, md: 0 },
            maxWidth: { xs: '100%', md: '45%' } 
          }}>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 800, 
                mb: 2.5,
                color: textColor,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <MenuBookIcon sx={{ 
                mr: 1.5, 
                fontSize: '2.2rem', 
                color: accentColor,
                filter: darkMode ? 'drop-shadow(0 0 2px rgba(187,134,252,0.3))' : 'drop-shadow(0 0 2px rgba(98,0,234,0.2))'
              }} />
              Bookate
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                fontWeight: 500,
                mb: 1,
                letterSpacing: 0.2
              }}
            >
              Un espacio donde las páginas cobran vida y las historias se comparten.
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                lineHeight: 1.6
              }}
            >
              Exploramos universos literarios a través de reseñas detalladas, entrevistas con autores y análisis de obras que inspiran y transforman.
            </Typography>
          </Box>

          {/* Sección de redes sociales (Instagram) */}
          <Box sx={{ 
            textAlign: { xs: 'left', md: 'left' },
            maxWidth: { xs: '100%', md: '25%' },
            order: { xs: 3, md: 2 }
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: textColor,
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                pl: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  display: 'inline-block',
                  width: '4px',
                  height: '20px',
                  borderRadius: '4px',
                  backgroundColor: accentColor,
                }
              }}
            >
              Síguenos
            </Typography>
            
            <Typography variant="body2" sx={{ 
              mb: 2.5, 
              color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              lineHeight: 1.5
            }}>
              Descubre nuestro contenido en Instagram
            </Typography>
            
            <Box sx={{ display: 'flex' }}>
              <IconButton 
                aria-label="Instagram"
                size="medium"
                sx={{ 
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                  color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                  p: 1.5,
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: accentColor,
                    color: 'white',
                    transform: 'translateY(-3px)',
                    boxShadow: darkMode 
                      ? '0 6px 15px rgba(187,134,252,0.3)' 
                      : '0 6px 15px rgba(98,0,234,0.2)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <InstagramIcon sx={{ fontSize: '1.6rem' }} />
              </IconButton>
            </Box>
          </Box>

          {/* Sección de newsletter revisada */}
          <Box sx={{ 
            maxWidth: { xs: '100%', md: '30%' },
            order: { xs: 2, md: 3 }
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: textColor,
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                pl: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  display: 'inline-block',
                  width: '4px',
                  height: '20px',
                  borderRadius: '4px',
                  backgroundColor: accentColor,
                }
              }}
            >
              Newsletter
            </Typography>
            
            <Typography variant="body2" sx={{ 
              mb: 3, 
              color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              lineHeight: 1.6
            }}>
              Suscríbete para recibir recomendaciones literarias, noticias sobre nuevos lanzamientos y contenido exclusivo directamente en tu bandeja de entrada.
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'column' },
              gap: 1.5
            }}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Tu email"
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '10px',
                    '& fieldset': {
                      borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: darkMode ? 'rgba(187,134,252,0.5)' : 'rgba(98,0,234,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: accentColor,
                      borderWidth: '1px',
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: textColor,
                    padding: '14px 16px',
                  }
                }}
              />
              <Button 
                variant="contained"
                fullWidth
                sx={{ 
                  backgroundColor: accentColor,
                  color: 'white',
                  borderRadius: '10px',
                  textTransform: 'none',
                  padding: '12px 20px',
                  fontWeight: 600,
                  letterSpacing: 0.3,
                  boxShadow: darkMode 
                    ? '0 4px 12px rgba(187,134,252,0.25)'
                    : '0 4px 12px rgba(98,0,234,0.15)',
                  '&:hover': {
                    backgroundColor: darkMode ? '#c89dfd' : '#5000d3',
                    transform: 'translateY(-2px)',
                    boxShadow: darkMode 
                      ? '0 6px 15px rgba(187,134,252,0.35)'
                      : '0 6px 15px rgba(98,0,234,0.25)',
                  },
                  transition: 'all 0.25s ease'
                }}
              >
                Suscribirme ahora
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      
      {/* Botón de scroll mejorado */}
      <Fade in={isVisible}>
        <Box
          onClick={scrollToTop}
          role="button"
          aria-label="Volver arriba"
          tabIndex={0}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: '45px',
            height: '45px',
            borderRadius: '12px',
            backgroundColor: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            zIndex: 10,
            boxShadow: darkMode 
              ? '0 4px 20px rgba(187, 134, 252, 0.35)' 
              : '0 4px 20px rgba(98, 0, 234, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: darkMode 
                ? '0 8px 25px rgba(187, 134, 252, 0.45)' 
                : '0 8px 25px rgba(98, 0, 234, 0.35)',
            },
            '&:focus': {
              outline: darkMode 
                ? '2px solid rgba(187, 134, 252, 0.5)'
                : '2px solid rgba(98, 0, 234, 0.5)',
              outlineOffset: '2px'
            }
          }}
        >
          <ArrowUpwardIcon fontSize="small" />
        </Box>
      </Fade>
      
      {/* Estilo global para animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Box>
  );
} 