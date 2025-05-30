'use client';
import { motion } from 'framer-motion';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  alpha,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import SendIcon from '@mui/icons-material/Send';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useState } from 'react';

const THEME = {
  primary: {
    main: '#7182bb',
    light: '#8b99c7',
    dark: '#5b6b9e',
  },
  text: {
    primary: '#36314c',
    secondary: alpha('#36314c', 0.7),
  },
  accent: {
    main: '#ded1e7',
    light: '#e8dff0',
  },
  background: {
    default: '#f5f3f7',
    paper: '#FFFFFF',
  }
};

function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    message: '',
    error: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: false });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }

      setStatus({
        loading: false,
        message: '¡Mensaje enviado con éxito!',
        error: false
      });
      setFormData({ name: '', email: '', message: '' });

    } catch (error) {
      setStatus({
        loading: false,
        message: error.message,
        error: true
      });
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      py: { xs: 6, md: 8 },
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Fondo decorativo */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        zIndex: 0,
        opacity: 0.4,
        background: `
          radial-gradient(circle at 20% 30%, ${alpha(THEME.primary.light, 0.15)} 0%, transparent 30%),
          radial-gradient(circle at 80% 70%, ${alpha(THEME.accent.main, 0.15)} 0%, transparent 30%),
          radial-gradient(circle at 50% 50%, ${alpha(THEME.primary.main, 0.1)} 0%, transparent 50%)
        `
      }}/>

      <Container maxWidth="lg" sx={{ 
        position: 'relative', 
        zIndex: 1,
        my: { xs: 2, md: 3 }
      }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {/* Sección de título y descripción */}
          <Grid item xs={12} md={10} lg={8} sx={{ textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" sx={{
                fontFamily: 'League Spartan',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
                mb: 3,
                background: `linear-gradient(135deg, ${THEME.text.primary}, ${THEME.primary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ¡Alimenta nuestra curiosidad literaria! 📚
              </Typography>

              <Typography variant="body1" sx={{
                color: THEME.text.secondary,
                fontSize: '1.1rem',
                mb: 6,
                lineHeight: 1.8,
                maxWidth: '700px',
                mx: 'auto'
              }}>
                ¿Tienes una historia jugosa que contarnos? ¿Una recomendación que hará rugir 
                nuestros estómagos literarios? ¡Este monstruo está hambriento de tus palabras!
              </Typography>

              <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={5}>
                  <Paper elevation={0} sx={{
                    p: 3,
                    borderRadius: '20px',
                    background: alpha(THEME.primary.main, 0.05),
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      background: alpha(THEME.primary.main, 0.1),
                    }
                  }}>
                    <EmailIcon sx={{ color: THEME.primary.main, mb: 1 }}/>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                      monstruo@bookate.com
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={5}>
                  <Paper elevation={0} sx={{
                    p: 3,
                    borderRadius: '20px',
                    background: alpha(THEME.primary.main, 0.05),
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      background: alpha(THEME.primary.main, 0.1),
                    }
                  }}>
                    <InstagramIcon sx={{ color: THEME.primary.main, mb: 1 }}/>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Instagram
                    </Typography>
                    <Typography variant="body2" sx={{ color: THEME.text.secondary }}>
                      @bookate_monster
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          </Grid>

          {/* Sección del formulario */}
          <Grid item xs={12} md={8} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Paper elevation={0} sx={{
                p: { xs: 3, md: 5 },
                borderRadius: '30px',
                background: 'white',
                boxShadow: `0 20px 40px ${alpha(THEME.primary.main, 0.1)}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: `linear-gradient(90deg, ${THEME.primary.main}, ${THEME.primary.light})`
                }}/>

                <Typography variant="h5" sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 700,
                  mb: 4,
                  textAlign: 'center',
                  color: THEME.text.primary
                }}>
                  ¡Cuéntanos tu historia! 📖✨
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    label="Tu nombre de aventurero"
                    variant="outlined"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: THEME.primary.main,
                        },
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    label="Tu pergamino digital (email)"
                    variant="outlined"
                    required
                    type="email"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: THEME.primary.main,
                        },
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    label="Tu mensaje mágico"
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: THEME.primary.main,
                        },
                      }
                    }}
                  />
                  
                  {status.message && (
                    <Typography 
                      color={status.error ? 'error' : 'success'} 
                      textAlign="center"
                    >
                      {status.message}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={status.loading}
                    endIcon={status.loading ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: '12px',
                      backgroundColor: THEME.primary.main,
                      fontFamily: 'League Spartan',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: THEME.primary.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 10px 20px ${alpha(THEME.primary.main, 0.3)}`,
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {status.loading ? 'Enviando...' : 'Enviar mensaje mágico ✨'}
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default function Contact() {
  return (
    <Box 
      component="main"
      sx={{ 
        bgcolor: THEME.background.default,
        minHeight: '100vh',
        fontFamily: 'League Spartan',
        py: { xs: 2, md: 3 }
      }}
    >
      <ContactContent />
    </Box>
  );
} 