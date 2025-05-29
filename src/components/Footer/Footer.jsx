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

export default function Footer({ darkMode = false }) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Nueva paleta de colores
  const colors = {
    background: '#FFFFFF',
    text: '#36314c',
    primary: '#7182bb',
    secondary: '#ded1e7',
  };

  // Configuración de colores según modo oscuro/claro
  const theme = {
    bg: darkMode ? '#2a2438' : colors.background,
    text: colors.text,
    accent: colors.primary,
    secondary: colors.secondary,
    gradient: `linear-gradient(to bottom, ${darkMode ? '#2a2438' : colors.background}, ${darkMode ? '#36314c' : colors.secondary})`,
    fontFamily: "'League Spartan', sans-serif"
  };

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
        backgroundImage: theme.gradient,
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 10 },
        borderTop: `1px solid ${alpha(theme.accent, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.accent, 0.08)} 0%, transparent 70%)`,
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
          background: `radial-gradient(circle, ${alpha(theme.secondary, 0.1)} 0%, transparent 70%)`,
          zIndex: 0,
          display: { xs: 'none', md: 'block' }
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'flex-start' },
          mb: { xs: 5, md: 7 },
          gap: { xs: 3, md: 4 }
        }}>
          {/* Sección del logo */}
          <Box sx={{ 
            mb: { xs: 1, md: 0 },
            maxWidth: { xs: '100%', md: '45%' } 
          }}>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontFamily: theme.fontFamily,
                fontWeight: 800, 
                mb: 2.5,
                color: theme.text,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <MenuBookIcon sx={{ 
                mr: 1.5, 
                fontSize: '2.2rem', 
                color: theme.accent,
                filter: `drop-shadow(0 0 2px ${alpha(theme.accent, 0.3)})`
              }} />
              Bookate
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: alpha(theme.text, 0.9),
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
                color: alpha(theme.text, 0.7),
                lineHeight: 1.6
              }}
            >
              Exploramos universos literarios a través de reseñas detalladas, entrevistas con autores y análisis de obras que inspiran y transforman.
            </Typography>
          </Box>

          {/* Sección de redes sociales */}
          <Box sx={{ 
            textAlign: { xs: 'left', md: 'left' },
            maxWidth: { xs: '100%', md: '25%' },
            order: { xs: 3, md: 2 }
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: theme.fontFamily,
                fontWeight: 700,
                color: theme.text,
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
                  backgroundColor: theme.accent,
                }
              }}
            >
              Síguenos
            </Typography>
            
            <Typography variant="body2" sx={{ 
              mb: 2.5, 
              color: alpha(theme.text, 0.7),
              lineHeight: 1.5
            }}>
              Descubre nuestro contenido en Instagram
            </Typography>
            
            <Box sx={{ display: 'flex' }}>
              <IconButton 
                aria-label="Instagram"
                size="medium"
                sx={{ 
                  backgroundColor: alpha(theme.accent, 0.1),
                  color: theme.accent,
                  p: 1.5,
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: theme.accent,
                    color: theme.bg,
                    transform: 'translateY(-3px)',
                    boxShadow: `0 6px 15px ${alpha(theme.accent, 0.25)}`,
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <InstagramIcon sx={{ fontSize: '1.6rem' }} />
              </IconButton>
            </Box>
          </Box>

          {/* Sección de newsletter */}
          <Box sx={{ 
            maxWidth: { xs: '100%', md: '30%' },
            order: { xs: 2, md: 3 }
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: theme.fontFamily,
                fontWeight: 700,
                color: theme.text,
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
                  backgroundColor: theme.accent,
                }
              }}
            >
              Newsletter
            </Typography>
            
            <Typography variant="body2" sx={{ 
              mb: 3, 
              color: alpha(theme.text, 0.7),
              lineHeight: 1.6
            }}>
              Suscríbete para recibir recomendaciones literarias, noticias sobre nuevos lanzamientos y contenido exclusivo.
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
                    backgroundColor: alpha(theme.bg, 0.8),
                    borderRadius: '10px',
                    '& fieldset': {
                      borderColor: alpha(theme.accent, 0.2),
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.accent, 0.5),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.accent,
                      borderWidth: '1px',
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: theme.text,
                    padding: '14px 16px',
                  }
                }}
              />
              <Button 
                variant="contained"
                fullWidth
                sx={{ 
                  fontFamily: theme.fontFamily,
                  backgroundColor: theme.accent,
                  color: theme.bg,
                  borderRadius: '10px',
                  textTransform: 'none',
                  padding: '12px 20px',
                  fontWeight: 600,
                  letterSpacing: 0.3,
                  boxShadow: `0 4px 12px ${alpha(theme.accent, 0.25)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.accent, 0.9),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 15px ${alpha(theme.accent, 0.35)}`,
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
      
      {/* Botón de scroll */}
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
            backgroundColor: theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: theme.bg,
            zIndex: 10,
            boxShadow: `0 4px 20px ${alpha(theme.accent, 0.25)}`,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: `0 8px 25px ${alpha(theme.accent, 0.35)}`,
            },
            '&:focus': {
              outline: `2px solid ${alpha(theme.accent, 0.5)}`,
              outlineOffset: '2px'
            }
          }}
        >
          <ArrowUpwardIcon fontSize="small" />
        </Box>
      </Fade>
      
      {/* Enlaces legales */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mt: 6,
        pt: 3,
        borderTop: `1px solid ${alpha(theme.text, 0.1)}`,
        fontFamily: theme.fontFamily,
      }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1, sm: 2 }}
          alignItems="center"
        >
          <Link 
            href="/politica-privacidad"
            sx={{ 
              color: alpha(theme.text, 0.7),
              textDecoration: 'none',
              '&:hover': {
                color: theme.accent
              }
            }}
          >
            Política de Privacidad
          </Link>
          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              color: alpha(theme.text, 0.3)
            }}
          >
            •
          </Box>
          <Link 
            href="/terminos-condiciones"
            sx={{ 
              color: alpha(theme.text, 0.7),
              textDecoration: 'none',
              '&:hover': {
                color: theme.accent
              }
            }}
          >
            Términos y Condiciones
          </Link>
        </Stack>
      </Box>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Box>
  );
} 