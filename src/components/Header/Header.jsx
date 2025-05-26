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
  TextField,
  IconButton,
  Collapse,
  InputAdornment,
  Tooltip,
  Zoom,
  CircularProgress
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Definición del tema personalizado
const THEME = {
  background: {
    primary: '#FFFFFF',
    secondary: '#ded1e7',
    accent: '#7182bb',
  },
  text: {
    primary: '#36314c',
    secondary: '#36314c99', // alpha(0.6)
    light: '#FFFFFF',
  },
  typography: {
    fontFamily: 'League Spartan, sans-serif',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #7182bb 0%, rgba(113, 130, 187, 0.8) 100%)',
    secondary: 'linear-gradient(135deg, #ded1e7 0%, rgba(222, 209, 231, 0.6) 100%)',
  }
};

export default function Header({ darkMode = false }) {
  const [elevated, setElevated] = useState(false);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  
  const bgColor = darkMode ? alpha(THEME.background.secondary, 0.95) : THEME.background.primary;
  const textColor = THEME.text.primary;
  const accentColor = THEME.background.accent;
  
  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 20);
      if (showMobileInput && window.scrollY > 100) {
        setShowMobileInput(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showMobileInput]);
  
  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setSubscribeError('Por favor, introduce un email válido');
      setTimeout(() => setSubscribeError(''), 3000);
      return;
    }
    
    try {
      setSubscribing(true);
      setSubscribeError('');
      
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubscribed(true);
        setSubscribeMessage(data.message);
        setEmail('');
        
        setTimeout(() => {
          setSubscribed(false);
          setShowMobileInput(false);
          setSubscribeMessage('');
        }, 3000);
      } else {
        setSubscribeError(data.message || 'Error al procesar tu suscripción');
        setTimeout(() => setSubscribeError(''), 3000);
      }
    } catch (error) {
      setSubscribeError('Error al conectar con el servidor');
      setTimeout(() => setSubscribeError(''), 3000);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={elevated ? 4 : 0}
      sx={{ 
        bgcolor: bgColor,
        borderBottom: `1px solid ${darkMode ? alpha(THEME.background.secondary, 0.2) : THEME.background.secondary}`,
        transition: 'all 0.3s ease',
        backdropFilter: elevated ? 'blur(10px)' : 'none',
        backgroundImage: elevated
          ? darkMode 
            ? `linear-gradient(to bottom, ${alpha(THEME.background.secondary, 0.95)}, ${alpha(THEME.background.accent, 0.1)})`
            : THEME.gradients.secondary
          : 'none',
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
                background: `radial-gradient(circle, ${alpha(THEME.background.accent, 0.1)} 0%, transparent 70%)`,
                zIndex: 0,
                display: { xs: 'none', md: 'block' }
              }}
            />
            
            {/* Logo y título */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box 
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  zIndex: 1,
                  cursor: 'pointer'
                }}
              >
                <MenuBookIcon 
                  sx={{ 
                    mr: 1.5, 
                    fontSize: '1.8rem', 
                    color: THEME.background.accent,
                    transform: 'rotate(-5deg)'
                  }} 
                />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ 
                    fontWeight: 800,
                    color: THEME.text.primary,
                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                    letterSpacing: '-0.02em',
                    fontFamily: THEME.typography.fontFamily
                  }}
                >
                  Bookate
                </Typography>
              </Box>
            </Link>
            
            {/* Versión Desktop */}
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
                      color: THEME.background.accent, 
                      fontWeight: 600,
                      px: 2,
                      fontFamily: THEME.typography.fontFamily
                    }}
                  >
                    {subscribeMessage || '¡Gracias por suscribirte!'}
                  </Typography>
                </motion.div>
              ) : (
                <>
                  <TextField
                    placeholder="Tu email"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!subscribeError}
                    helperText={subscribeError}
                    disabled={subscribing}
                    InputProps={{
                      sx: {
                        borderRadius: '8px',
                        fontFamily: THEME.typography.fontFamily,
                        bgcolor: darkMode 
                          ? alpha(THEME.background.secondary, 0.1) 
                          : alpha(THEME.background.secondary, 0.05),
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: darkMode 
                            ? alpha(THEME.background.secondary, 0.2) 
                            : THEME.background.secondary,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: THEME.background.accent,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: THEME.background.accent,
                        },
                        color: THEME.text.primary
                      }
                    }}
                    sx={{ 
                      width: '220px', 
                      mr: 1,
                      '& .MuiInputBase-input': {
                        fontFamily: THEME.typography.fontFamily,
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: THEME.typography.fontFamily,
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    sx={{ 
                      bgcolor: THEME.background.accent,
                      color: THEME.text.light,
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      fontFamily: THEME.typography.fontFamily,
                      boxShadow: `0 4px 10px ${alpha(THEME.background.accent, 0.2)}`,
                      transition: 'all 0.3s',
                      '&:hover': { 
                        bgcolor: alpha(THEME.background.accent, 0.9),
                        boxShadow: `0 6px 15px ${alpha(THEME.background.accent, 0.3)}`,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {subscribing ? 'Enviando...' : 'Suscribirme'}
                  </Button>
                </>
              )}
            </Box>
            
            {/* Versión Mobile */}
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
                      color: THEME.background.accent, 
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      fontFamily: THEME.typography.fontFamily
                    }}
                  >
                    {subscribeMessage || '¡Gracias!'}
                  </Typography>
                </motion.div>
              ) : (
                <Tooltip 
                  title={showMobileInput ? "Cerrar" : "Suscríbete al newsletter"} 
                  arrow 
                  TransitionComponent={Zoom}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: THEME.typography.fontFamily,
                        fontSize: '0.85rem'
                      }
                    }
                  }}
                >
                  <IconButton
                    component={motion.button}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 4px 15px ${alpha(THEME.background.accent, 0.3)}`
                    }}
                    onClick={() => setShowMobileInput(!showMobileInput)}
                    sx={{ 
                      bgcolor: showMobileInput 
                        ? alpha(THEME.background.accent, 0.15) 
                        : THEME.background.accent,
                      color: showMobileInput ? THEME.background.accent : THEME.text.light,
                      p: 1,
                      borderRadius: '8px',
                      boxShadow: showMobileInput 
                        ? 'none' 
                        : `0 4px 10px ${alpha(THEME.background.accent, 0.2)}`,
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
        
        {/* Input móvil expandible */}
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
            {subscribeError && (
              <Typography 
                variant="caption" 
                color="error" 
                sx={{ mb: 1, width: '100%', textAlign: 'center', fontFamily: THEME.typography.fontFamily }}
              >
                {subscribeError}
              </Typography>
            )}
            
            <TextField
              fullWidth
              placeholder="Escribe tu email para suscribirte"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              disabled={subscribing}
              error={!!subscribeError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      edge="end"
                      onClick={handleSubscribe}
                      disabled={subscribing}
                      sx={{ color: THEME.background.accent }}
                    >
                      {subscribing ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SendIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  fontFamily: THEME.typography.fontFamily,
                  bgcolor: darkMode 
                    ? alpha(THEME.background.secondary, 0.1) 
                    : alpha(THEME.background.secondary, 0.05),
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode 
                      ? alpha(THEME.background.secondary, 0.2) 
                      : THEME.background.secondary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: THEME.background.accent,
                  },
                  color: THEME.text.primary
                }
              }}
            />
          </Box>
        </Collapse>
      </Container>
    </AppBar>
  );
} 