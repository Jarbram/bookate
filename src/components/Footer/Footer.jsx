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
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BookIcon from '@mui/icons-material/Book';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
      // Mostrar cuando se ha desplazado más del 30% de la página
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
        py: { xs: 6, md: 8 },
        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eaeaea'}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos */}
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          right: -20,
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(accentColor, 0.08)} 0%, transparent 70%)`,
          zIndex: 0,
          display: { xs: 'none', md: 'block' }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          left: -30,
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(accentColor, 0.05)} 0%, transparent 70%)`,
          zIndex: 0,
          display: { xs: 'none', md: 'block' }
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo y descripción en la parte superior */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 6
        }}>
          <Box sx={{ mb: { xs: 3, md: 0 } }}>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 800, 
                mb: 2,
                color: textColor,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <MenuBookIcon sx={{ mr: 1, fontSize: '2rem', color: accentColor }} />
              Bookate
            </Typography>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                maxWidth: '500px'
              }}
            >
              Un espacio donde las páginas cobran vida y las historias se comparten.
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
              maxWidth: { md: '400px' },
              textAlign: { xs: 'left', md: 'right' }
            }}
          >
            Exploramos universos literarios a través de reseñas detalladas, entrevistas con autores y análisis de obras que inspiran y transforman.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Columna Explora */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: textColor,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '4px',
                  height: '18px',
                  borderRadius: '2px',
                  backgroundColor: accentColor,
                  marginRight: '10px'
                }
              }}
            >
              Explora
            </Typography>
            
            <Box component="ul" sx={{ pl: 0, listStyle: 'none', mb: 0 }}>
              {['Reseñas Recientes', 'Autores del Mes', 'Clásicos Literarios', 'Novedades Editoriales'].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <Box component="li" sx={{ mb: 2 }}>
                    <Link 
                      href="#" 
                      color="inherit" 
                      underline="none"
                      sx={{ 
                        color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        '&:hover': {
                          color: accentColor,
                        }
                      }}
                    >
                      <Box 
                        component="span" 
                        sx={{ 
                          width: '5px', 
                          height: '5px', 
                          borderRadius: '50%', 
                          bgcolor: 'currentColor',
                          display: 'inline-block',
                          mr: 1.5,
                          opacity: 0.8
                        }} 
                      />
                      {item}
                    </Link>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Grid>

          {/* Columna Géneros */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: textColor,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '4px',
                  height: '18px',
                  borderRadius: '2px',
                  backgroundColor: accentColor,
                  marginRight: '10px'
                }
              }}
            >
              Géneros Literarios
            </Typography>
            
            <Box component="ul" sx={{ pl: 0, listStyle: 'none', mb: 0 }}>
              {['Fantasía y Ciencia Ficción', 'Novela Histórica', 'Misterio y Suspense', 'Literatura Contemporánea'].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <Box component="li" sx={{ mb: 2 }}>
                    <Link 
                      href="#" 
                      color="inherit" 
                      underline="none"
                      sx={{ 
                        color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        '&:hover': {
                          color: accentColor,
                        }
                      }}
                    >
                      <Box 
                        component="span" 
                        sx={{ 
                          width: '5px', 
                          height: '5px', 
                          borderRadius: '50%', 
                          bgcolor: 'currentColor',
                          display: 'inline-block',
                          mr: 1.5,
                          opacity: 0.8
                        }} 
                      />
                      {item}
                    </Link>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Grid>

          {/* Columna Contact us */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: textColor,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: '4px',
                  height: '18px',
                  borderRadius: '2px',
                  backgroundColor: accentColor,
                  marginRight: '10px'
                }
              }}
            >
              Contáctanos
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    mr: 2, 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '12px',
                    backgroundColor: darkMode ? 'rgba(187, 134, 252, 0.1)' : 'rgba(98, 0, 234, 0.06)',
                    color: accentColor
                  }}
                >
                  <EmailIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: '0.75rem' }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ color: textColor, fontWeight: 500 }}>
                    lectura@bookate.com
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    mr: 2, 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '12px',
                    backgroundColor: darkMode ? 'rgba(187, 134, 252, 0.1)' : 'rgba(98, 0, 234, 0.06)',
                    color: accentColor
                  }}
                >
                  <LocalLibraryIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: '0.75rem' }}>
                    Club de Lectura
                  </Typography>
                  <Typography variant="body1" sx={{ color: textColor, fontWeight: 500 }}>
                    Jueves 18:00h (Online)
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    mr: 2, 
                    width: '36px', 
                    height: '36px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '12px',
                    backgroundColor: darkMode ? 'rgba(187, 134, 252, 0.1)' : 'rgba(98, 0, 234, 0.06)',
                    color: accentColor
                  }}
                >
                  <LocationOnIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: '0.75rem' }}>
                    Librería Asociada
                  </Typography>
                  <Typography variant="body1" sx={{ color: textColor, fontWeight: 500 }}>
                    Librería Páginas, Ciudad de México
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2, color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
              Síguenos para descubrir nuevas historias
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small"
                sx={{ 
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  '&:hover': {
                    backgroundColor: accentColor,
                    color: 'white',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small"
                sx={{ 
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  '&:hover': {
                    backgroundColor: accentColor,
                    color: 'white',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small"
                sx={{ 
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  '&:hover': {
                    backgroundColor: accentColor,
                    color: 'white',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small"
                sx={{ 
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  '&:hover': {
                    backgroundColor: accentColor,
                    color: 'white',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <PinterestIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1.5, color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                Suscríbete a nuestra newsletter literaria
              </Typography>
              
              <Box sx={{ display: 'flex' }}>
                <TextField
                  size="small"
                  placeholder="Tu email"
                  variant="outlined"
                  sx={{ 
                    mr: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: textColor,
                      fontSize: '0.875rem',
                    }
                  }}
                />
                <Button 
                  variant="contained"
                  size="small"
                  sx={{ 
                    backgroundColor: accentColor,
                    color: 'white',
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: darkMode ? '#c89dfd' : '#5000d3',
                    }
                  }}
                >
                  Suscribir
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'center' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
            © 2023 Bookate - Todos los derechos literarios reservados
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Términos', 'Privacidad', 'Política Editorial'].map((item, index) => (
              <Typography 
                key={index}
                variant="body2" 
                component={Link} 
                href="#"
                sx={{ 
                  color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  textDecoration: 'none',
                  '&:hover': {
                    color: accentColor,
                    textDecoration: 'none'
                  }
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
      
      <Fade in={isVisible}>
        <Box
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            zIndex: 10,
            boxShadow: darkMode 
              ? '0 4px 20px rgba(187, 134, 252, 0.3)' 
              : '0 4px 20px rgba(98, 0, 234, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: darkMode 
                ? '0 6px 20px rgba(187, 134, 252, 0.4)' 
                : '0 6px 20px rgba(98, 0, 234, 0.3)',
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