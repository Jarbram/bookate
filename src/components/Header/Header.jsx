'use client';
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  alpha,
  useScrollTrigger,
  TextField,
  IconButton,
  Collapse,
  InputAdornment,
  Tooltip,
  Zoom
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

export default function Header({ darkMode = false }) {
  const [elevated, setElevated] = useState(false);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // Colores primarios del tema (para coincidir con el Footer)
  const primaryLight = '#6200ea';
  const primaryDark = '#bb86fc';
  const bgColor = darkMode ? '#121212' : '#ffffff';
  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a';
  const accentColor = darkMode ? '#bb86fc' : '#6200ea';
  
  // Detectar scroll para agregar efecto de elevación
  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 20);
      
      // Cerrar input móvil al hacer scroll
      if (showMobileInput && window.scrollY > 100) {
        setShowMobileInput(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showMobileInput]);
  
  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      
      // Resetear después de mostrar el mensaje
      setTimeout(() => {
        setSubscribed(false);
        setShowMobileInput(false);
      }, 2500);
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={elevated ? 4 : 0}
      sx={{ 
        bgcolor: bgColor,
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#eaeaea'}`,
        transition: 'all 0.3s ease',
        backdropFilter: elevated ? 'blur(10px)' : 'none',
        backgroundImage: elevated
          ? darkMode 
            ? `linear-gradient(to bottom, rgba(18, 18, 18, 0.95), rgba(26, 26, 26, 0.95))`
            : `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.95))`
          : 'none',
        // Ajustar altura cuando el input móvil está visible
        maxHeight: showMobileInput ? '120px' : '70px',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: '70px' }}>
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            {/* Elemento decorativo */}
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                left: -50,
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(accentColor, 0.05)} 0%, transparent 70%)`,
                zIndex: 0,
                display: { xs: 'none', md: 'block' }
              }}
            />
            
            {/* Logo con icono */}
            <Box 
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                zIndex: 1
              }}
            >
              <MenuBookIcon 
                sx={{ 
                  mr: 1.5, 
                  fontSize: '1.8rem', 
                  color: accentColor,
                  transform: 'rotate(-5deg)'
                }} 
              />
              <Typography
                variant="h5"
                component="div"
                sx={{ 
                  fontWeight: 800,
                  color: textColor,
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  letterSpacing: '-0.02em'
                }}
              >
                Bookate
              </Typography>
            </Box>
            
            {/* Versión Desktop: Campo de email + botón */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1
              }}
              component={motion.div}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: accentColor, 
                      fontWeight: 600,
                      px: 2
                    }}
                  >
                    ¡Gracias por suscribirte!
                  </Typography>
                </motion.div>
              ) : (
                <>
                  <TextField
                    placeholder="Tu email"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      sx: {
                        borderRadius: '8px',
                        bgcolor: darkMode ? alpha('#fff', 0.06) : alpha('#000', 0.02),
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.1),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: darkMode ? alpha('#fff', 0.2) : alpha('#000', 0.2),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: accentColor,
                        }
                      }
                    }}
                    sx={{ 
                      width: '220px',
                      mr: 1
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSubscribe}
                    sx={{ 
                      bgcolor: accentColor,
                      color: 'white',
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      boxShadow: darkMode 
                        ? '0 4px 10px rgba(187, 134, 252, 0.2)' 
                        : '0 4px 10px rgba(98, 0, 234, 0.15)',
                      transition: 'all 0.3s',
                      '&:hover': { 
                        bgcolor: darkMode ? '#c89dfd' : '#5000d3',
                        boxShadow: darkMode 
                          ? '0 6px 15px rgba(187, 134, 252, 0.3)' 
                          : '0 6px 15px rgba(98, 0, 234, 0.2)',
                      }
                    }}
                  >
                    Suscribirme
                  </Button>
                </>
              )}
            </Box>
            
            {/* Versión Mobile: Botón con animación */}
            <Box 
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                zIndex: 2
              }}
            >
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: accentColor, 
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    ¡Gracias!
                  </Typography>
                </motion.div>
              ) : (
                <Tooltip 
                  title={showMobileInput ? "Cerrar" : "Suscríbete al newsletter"} 
                  arrow 
                  TransitionComponent={Zoom}
                >
                  <IconButton
                    component={motion.button}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: darkMode 
                        ? '0 4px 15px rgba(187, 134, 252, 0.3)' 
                        : '0 4px 15px rgba(98, 0, 234, 0.2)'
                    }}
                    onClick={() => setShowMobileInput(!showMobileInput)}
                    sx={{ 
                      bgcolor: showMobileInput ? alpha(accentColor, 0.15) : accentColor,
                      color: showMobileInput ? accentColor : 'white',
                      p: 1,
                      borderRadius: '8px',
                      boxShadow: showMobileInput ? 'none' : (darkMode 
                        ? '0 4px 10px rgba(187, 134, 252, 0.2)' 
                        : '0 4px 10px rgba(98, 0, 234, 0.15)'),
                      transition: 'all 0.3s',
                    }}
                  >
                    {showMobileInput ? (
                      <CloseIcon fontSize="small" />
                    ) : (
                      <NotificationsIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Toolbar>
        
        {/* Input animado móvil */}
        <Collapse in={showMobileInput}>
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              px: 1,
              pb: 2,
              pt: 0.5
            }}
            component={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TextField
              fullWidth
              placeholder="Escribe tu email para suscribirte"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      edge="end"
                      onClick={handleSubscribe}
                      sx={{ 
                        color: accentColor
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  bgcolor: darkMode ? alpha('#fff', 0.06) : alpha('#000', 0.02),
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.1),
                  }
                }
              }}
            />
          </Box>
        </Collapse>
      </Container>
    </AppBar>
  );
} 