'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Link, 
  IconButton, 
  Zoom, 
  Skeleton,
  CircularProgress,
  alpha
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import LaunchIcon from '@mui/icons-material/Launch';
import { motion, useInView } from 'framer-motion';

export default function InstagramGallery() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  
  // Referencias para optimizaciones
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const inView = useInView(containerRef, { once: true, amount: 0.3 });
  
  // Colores y estilos
  const bgGradient = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
  const instagramUser = 'booke_ate';
  
  // Carga de iframe optimizada con IntersectionObserver
  useEffect(() => {
    // Solo cargar el iframe cuando el componente está en la vista
    if (inView) {
      // Retrasar ligeramente la carga para priorizar otros elementos críticos
      const timer = setTimeout(() => {
        setShowIframe(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [inView]);
  
  // Manejar eventos del iframe
  const handleIframeLoad = () => {
    setLoading(false);
  };
  
  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };
  
  // Reintentar carga en caso de error
  const handleRetry = () => {
    setLoading(true);
    setError(false);
    
    // Forzar recarga del iframe
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 50);
    }
  };
  
  return (
    <Box 
      ref={containerRef}
      sx={{ 
        mb: 4, 
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        }
      }}
      component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Barra de título mejorada con animación sutil */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        background: bgGradient,
        borderTopLeftRadius: '18px',
        borderTopRightRadius: '18px',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 1
        }
      }}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              zIndex: 2,
              position: 'relative'
            }}
          >
            <InstagramIcon sx={{ 
              mr: 1, 
              fontSize: '1.3rem',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
            }} />
            @{instagramUser}
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link 
            href={`https://www.instagram.com/${instagramUser}/`} 
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Seguir en Instagram"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50px',
              padding: '4px 12px',
              backdropFilter: 'blur(4px)',
              zIndex: 2,
              position: 'relative',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
              },
              '&:focus': {
                outline: '2px solid rgba(255,255,255,0.5)',
                outlineOffset: '2px'
              }
            }}
          >
            Seguir
            <LaunchIcon sx={{ ml: 0.5, fontSize: '0.9rem' }} />
          </Link>
        </motion.div>
      </Box>
      
      {/* Área de contenido con estado de carga y manejo de errores */}
      <Box sx={{ 
        position: 'relative', 
        height: 410, 
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Estado de carga */}
        {loading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            zIndex: 10
          }}>
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                rotate: { duration: 1.5, ease: 'linear', repeat: Infinity },
                scale: { duration: 2, ease: 'easeInOut', repeat: Infinity }
              }}
            >
              <InstagramIcon 
                sx={{ 
                  fontSize: '2.5rem', 
                  color: '#e1306c',
                  mb: 2,
                  filter: 'drop-shadow(0 2px 8px rgba(225, 48, 108, 0.3))'
                }} 
              />
            </motion.div>
            <Typography 
              variant="body2"
              sx={{ 
                color: '#555', 
                fontWeight: 500,
                mt: 1,
                animation: 'pulse 2s infinite ease-in-out',
                '@keyframes pulse': {
                  '0%': { opacity: 0.5 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.5 }
                }
              }}
            >
              Conectando con Instagram...
            </Typography>
          </Box>
        )}
        
        {/* Estado de error */}
        {error && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            zIndex: 10,
            p: 3
          }}>
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: '50%',
                bgcolor: alpha('#e1306c', 0.1),
                mb: 2
              }}
            >
              <InstagramIcon 
                sx={{ 
                  fontSize: '2rem', 
                  color: '#e1306c'
                }} 
              />
            </Box>
            <Typography 
              variant="body1"
              sx={{ 
                color: '#333', 
                fontWeight: 600,
                mb: 1,
                textAlign: 'center'
              }}
            >
              No pudimos conectar con Instagram
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                color: '#666', 
                mb: 3,
                textAlign: 'center'
              }}
            >
              Intenta visitar directamente nuestro perfil de Instagram.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Link 
                href={`https://www.instagram.com/${instagramUser}/`} 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: 500,
                  py: 1,
                  px: 2,
                  borderRadius: '8px',
                  background: bgGradient,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Ver en Instagram
              </Link>
              
              <IconButton 
                onClick={handleRetry}
                aria-label="Reintentar carga"
                sx={{ 
                  color: '#e1306c',
                  border: `1px solid ${alpha('#e1306c', 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha('#e1306c', 0.1)
                  }
                }}
              >
                <Box component="span" sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 500
                }}>
                  Reintentar
                </Box>
              </IconButton>
            </Box>
          </Box>
        )}
        
        {/* Widget incrustado de Instagram con optimizaciones */}
        {showIframe && (
          <Box
            component="iframe"
            ref={iframeRef}
            src={`https://www.instagram.com/${instagramUser}/embed`}
            width="100%"
            height="100%"
            sx={{
              border: 'none',
              display: 'block',
              overflowY: 'hidden',
              backgroundColor: '#ffffff',
              transition: 'opacity 0.3s ease',
              opacity: loading || error ? 0 : 1
            }}
            loading="lazy"
            title={`Perfil de Instagram @${instagramUser}`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            importance="low"
          />
        )}
      </Box>
    </Box>
  );
} 