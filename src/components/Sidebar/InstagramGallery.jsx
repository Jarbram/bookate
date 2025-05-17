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

export default function InstagramGallery({ compact = false }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  
  // Referencias para optimizaciones
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const inView = useInView(containerRef, { once: true, amount: 0.2 });
  
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
        mb: 3, 
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
        transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        },
        height: compact ? 'auto' : 'auto',
      }}
      component={motion.div}
      initial={{ y: 15, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 15, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Barra de título con diseño mejorado */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1.8,
        background: bgGradient,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2), rgba(255,255,255,0) 70%)',
          zIndex: 1
        }
      }}>
        <motion.div
          initial={{ x: -15, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: -15, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              textShadow: '0 1px 2px rgba(0,0,0,0.15)',
              zIndex: 2,
              position: 'relative'
            }}
          >
            <InstagramIcon sx={{ 
              mr: 1, 
              fontSize: '1.2rem',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
            }} />
            @{instagramUser}
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ x: 15, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: 15, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
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
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.25s ease',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: '20px',
              padding: '4px 12px',
              backdropFilter: 'blur(4px)',
              zIndex: 2,
              position: 'relative',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.25)',
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
              },
              '&:active': {
                transform: 'translateY(0) scale(0.98)',
              }
            }}
          >
            Seguir
            <LaunchIcon sx={{ ml: 0.5, fontSize: '0.8rem' }} />
          </Link>
        </motion.div>
      </Box>
      
      {/* Área de contenido con altura adaptable */}
      <Box sx={{ 
        position: 'relative', 
        height: compact ? 340 : 380, 
        backgroundColor: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Estado de carga mejorado */}
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
            backgroundColor: '#fafafa',
            zIndex: 10
          }}>
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.08, 1] 
              }}
              transition={{ 
                rotate: { duration: 1.2, ease: 'linear', repeat: Infinity },
                scale: { duration: 1.5, ease: 'easeInOut', repeat: Infinity }
              }}
            >
              <Box sx={{
                borderRadius: '50%',
                p: 1.5,
                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                boxShadow: '0 4px 15px rgba(225, 48, 108, 0.2)'
              }}>
                <InstagramIcon 
                  sx={{ 
                    fontSize: '2rem', 
                    color: 'white',
                  }} 
                />
              </Box>
            </motion.div>
            <Typography 
              variant="body2"
              sx={{ 
                color: '#555', 
                fontWeight: 500,
                mt: 2,
                animation: 'pulse 2s infinite ease-in-out',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.6 }
                }
              }}
            >
              Conectando con Instagram...
            </Typography>
          </Box>
        )}
        
        {/* Estado de error mejorado */}
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
            backgroundColor: '#fafafa',
            zIndex: 10,
            p: 3
          }}>
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: '50%',
                background: bgGradient,
                mb: 2,
                boxShadow: '0 4px 15px rgba(225, 48, 108, 0.15)'
              }}
            >
              <InstagramIcon 
                sx={{ 
                  fontSize: '1.8rem', 
                  color: 'white'
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
                mb: 2.5,
                textAlign: 'center',
                maxWidth: '90%'
              }}
            >
              Intenta visitar directamente nuestro perfil para ver nuestras últimas publicaciones.
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
                  py: 0.8,
                  px: 2,
                  borderRadius: '8px',
                  background: bgGradient,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 3px 10px rgba(225, 48, 108, 0.15)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(225, 48, 108, 0.25)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
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
                    backgroundColor: alpha('#e1306c', 0.08)
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
        
        {/* Widget incrustado de Instagram */}
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
              transition: 'opacity 0.4s ease',
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