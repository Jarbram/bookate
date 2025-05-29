'use client';
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Menu as MenuIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkFilledIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Send as SendIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';

const THEME = {
  background: {
    primary: '#FFFFFF',
    secondary: '#ded1e7',
    accent: '#7182bb',
  },
  text: {
    primary: '#36314c',
    secondary: '#36314c99',
  },
  typography: {
    fontFamily: "'League Spartan', sans-serif",
  }
};

// Añadimos array de citas literarias
const LITERARY_QUOTES = [
  {
    quote: "Un libro es un sueño que tienes en las manos",
    author: "Neil Gaiman"
  },
  {
    quote: "Siempre imaginé que el Paraíso sería algún tipo de biblioteca",
    author: "Jorge Luis Borges"
  },
  {
    quote: "Leer es vivir dos veces",
    author: "Umberto Eco"
  },
  {
    quote: "Las palabras son nuestra más inagotable fuente de magia",
    author: "J.K. Rowling"
  },
  {
    quote: "Los libros son espejos: solo ves en ellos lo que ya llevas dentro",
    author: "Carlos Ruiz Zafón"
  },
  {
    quote: "Dormir no es nada comparado con leer",
    author: "John Green"
  },
  {
    quote: "Somos lo que elegimos ser",
    author: "Patrick Rothfuss"
  },
  {
    quote: "El tiempo no es infinito para los lectores",
    author: "Stephen King"
  },
  {
    quote: "Todo lo que necesitas es la historia correcta",
    author: "Haruki Murakami"
  },
  {
    quote: "Los buenos amigos, los buenos libros y una conciencia tranquila",
    author: "Brandon Sanderson"
  },
  {
    quote: "Vivir mil vidas a través de los libros",
    author: "George R.R. Martin"
  },
  {
    quote: "Los libros son puertas a mundos infinitos",
    author: "Leigh Bardugo"
  },
  {
    quote: "La lectura es un acto de resistencia",
    author: "Cassandra Clare"
  },
  {
    quote: "Entre las páginas de un libro siempre hay luz",
    author: "Victoria Schwab"
  },
  {
    quote: "Los mejores momentos son los que pasas leyendo",
    author: "Rainbow Rowell"
  }
];

export default function Header({ currentPath }) {
  const [mounted, setMounted] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isQuoteChanging, setIsQuoteChanging] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeDrawerOpen, setSubscribeDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setElevated(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedArticles');
      if (saved) {
        setSavedArticles(JSON.parse(saved));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const changeQuote = () => {
        setIsQuoteChanging(true);
        setTimeout(() => {
          setCurrentQuoteIndex(prev => {
            const nextIndex = Math.floor(Math.random() * LITERARY_QUOTES.length);
            return nextIndex === prev ? 
              (nextIndex + 1) % LITERARY_QUOTES.length : 
              nextIndex;
          });
          setIsQuoteChanging(false);
        }, 500);
      };

      const interval = setInterval(changeQuote, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const navigationItems = [
    { title: 'Inicio', path: '/' },
    { title: 'Categorías', path: '/categorias' },
  ];

  const handleSaveArticle = () => {
    if (!currentPath) return;
    const newSavedArticles = savedArticles.includes(currentPath)
      ? savedArticles.filter(path => path !== currentPath)
      : [...savedArticles, currentPath];

    setSavedArticles(newSavedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(newSavedArticles));

    setSnackbarMessage(
      savedArticles.includes(currentPath)
        ? 'Artículo removido de guardados'
        : 'Artículo guardado para leer después'
    );
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage('Enlace copiado al portapapeles');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      return;
    }

    try {
      await navigator.share({
        title: document.title,
        url: window.location.href,
      });
      setSnackbarMessage('¡Contenido compartido!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Error al compartir');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSnackbarMessage('Por favor, ingresa un email válido');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setSubscribing(true);
    try {
      const response = await axios.post('/api/subscribe', { email });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity(response.data.success ? 'success' : 'error');
      if (response.data.success) {
        setEmail('');
        setSubscribeDrawerOpen(false);
      }
    } catch (error) {
      setSnackbarMessage('Error al procesar tu suscripción');
      setSnackbarSeverity('error');
    } finally {
      setSubscribing(false);
      setSnackbarOpen(true);
    }
  };

  const currentQuote = LITERARY_QUOTES[currentQuoteIndex];

  const SubscribeForm = ({ isMobile = false }) => (
    <Box 
      component="form" 
      onSubmit={handleSubscribe}
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 1,
        p: isMobile ? 2 : 0
      }}
    >
      {isMobile && (
        <Typography variant="h6" sx={{ mb: 1 }}>
          Suscríbete al newsletter
        </Typography>
      )}
      <TextField
        fullWidth
        size={isMobile ? "medium" : "small"}
        placeholder="Ingresa tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: THEME.typography.fontFamily,
            borderRadius: '20px',
            bgcolor: 'background.paper',
            '&:hover fieldset': {
              borderColor: THEME.background.accent,
            },
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                type="submit"
                disabled={subscribing}
                sx={{ 
                  color: THEME.background.accent,
                  '&:hover': { bgcolor: 'rgba(113, 130, 187, 0.1)' }
                }}
              >
                {subscribing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <SendIcon />
                  </motion.div>
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {isMobile && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Recibe las últimas actualizaciones directamente en tu correo
        </Typography>
      )}
    </Box>
  );

  if (!mounted) return null;

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={elevated ? 4 : 0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Barra superior con citas */}
        <Box
          sx={{
            bgcolor: THEME.background.accent,
            color: '#fff',
            height: '40px',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          <Container maxWidth="lg">
            <Box
              component={motion.div}
              initial={{ opacity: 1, y: 0 }}
              animate={{ 
                opacity: isQuoteChanging ? 0 : 1,
                y: isQuoteChanging ? 20 : 0
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily: THEME.typography.fontFamily,
                  fontStyle: 'italic',
                  fontSize: '0.95rem',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                "{currentQuote.quote}"
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontFamily: THEME.typography.fontFamily,
                  fontSize: '0.95rem',
                  opacity: 0.9,
                  fontWeight: 500
                }}
              >
                — {currentQuote.author}
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg">
          <Toolbar sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            py: 2,
            gap: 2
          }}>
            {/* Logo centrado */}
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'center'
              }}
            >
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <MenuBookIcon sx={{ 
                  fontSize: { xs: 32, md: 40 }, 
                  color: THEME.background.accent 
                }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: THEME.typography.fontFamily,
                    fontWeight: 800,
                    color: THEME.text.primary,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Bookate
                </Typography>
              </Link>
            </Box>

            {/* Formulario de suscripción desktop */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              minWidth: 300
            }}>
              <SubscribeForm />
            </Box>

            {/* Acciones - Lado derecho */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1
            }}>
              {/* Elementos visibles solo en desktop */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                <Tooltip title="Inicio">
                  <IconButton 
                    component={Link} 
                    href="/"
                    sx={{
                      '&:hover': {
                        color: THEME.background.accent
                      }
                    }}
                  >
                    <HomeIcon />
                  </IconButton>
                </Tooltip>

                {currentPath && (
                  <Tooltip title="Guardar para leer después">
                    <IconButton onClick={handleSaveArticle}>
                      {savedArticles.includes(currentPath) 
                        ? <BookmarkFilledIcon color="primary" />
                        : <BookmarkBorderIcon />
                      }
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Sobre Nosotros">
                  <IconButton 
                    component={Link} 
                    href="/sobre-nosotros"
                    sx={{
                      '&:hover': {
                        color: THEME.background.accent
                      }
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Botones siempre visibles */}
              <Tooltip title="Compartir">
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>

              {/* Botón de suscripción solo en mobile */}
              <Tooltip title="Suscribirse">
                <IconButton
                  sx={{ 
                    display: { xs: 'flex', md: 'none' },
                    color: THEME.background.accent
                  }}
                  onClick={() => setSubscribeDrawerOpen(true)}
                >
                  <EmailIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer de suscripción para móvil */}
      <Drawer
        anchor="bottom"
        open={subscribeDrawerOpen}
        onClose={() => setSubscribeDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            py: 2
          }
        }}
      >
        <SubscribeForm isMobile />
      </Drawer>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
} 