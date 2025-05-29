'use client';
import { motion } from 'framer-motion';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  Button,
  alpha,
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

// Tema actualizado
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

const stats = [
  { 
    number: "1.2M", 
    label: "Páginas devoradas con colmillos", 
    icon: <AutoStoriesIcon />,
    color: '#FFB4A2'
  },
  { 
    number: "8,742", 
    label: "Libros digeridos enteritos", 
    icon: <EmojiObjectsIcon />,
    color: '#B5E48C'
  },
  { 
    number: "∞", 
    label: "Historias por engullir", 
    icon: <LocalLibraryIcon />,
    color: '#A2D2FF'
  }
];

function AboutContent() {
  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 8 }, pb: 12 }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ 
          position: 'relative',
          mb: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'League Spartan',
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 3,
                background: `linear-gradient(135deg, ${THEME.primary.main}, ${THEME.primary.dark})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              ¡La guarida del monstruo devorador de libros!
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'League Spartan',
                color: THEME.text.secondary,
                maxWidth: '800px',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 500
              }}
            >
              Donde devoramos historias página a página y escupimos las reseñas más jugosas
            </Typography>
          </Box>
          <Box 
            sx={{ 
              flex: 1,
              height: { xs: '300px', md: '400px' },
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden'
            }}
          >
            <img 
              src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg"
              alt="Libros apilados en una biblioteca"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Box>
      </motion.div>

      {/* Stats Section */}
      <Box sx={{ mb: 12 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: '24px',
                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px) rotate(-3deg)',
                      boxShadow: `0 20px 40px ${alpha(stat.color, 0.2)}`,
                      '& .icon-container': {
                        transform: 'rotate(10deg) scale(1.1)',
                      }
                    }
                  }}
                >
                  <Box
                    className="icon-container"
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '16px',
                      bgcolor: alpha(stat.color, 0.2),
                      color: stat.color,
                      mb: 3,
                      transform: 'rotate(-5deg)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 800,
                    color: THEME.text.primary,
                    mb: 1
                  }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" sx={{
                    fontFamily: 'League Spartan',
                    color: THEME.text.secondary,
                    fontWeight: 500
                  }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Historia Section */}
      <Box sx={{ mb: 12 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: '30px',
              background: `linear-gradient(135deg, ${alpha(THEME.primary.main, 0.05)} 0%, ${alpha(THEME.accent.main, 0.1)} 100%)`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Typography variant="h4" sx={{
              fontFamily: 'League Spartan',
              fontWeight: 700,
              mb: 4,
              color: THEME.text.primary
            }}>
              El origen de nuestra hambre literaria
            </Typography>
            <Typography variant="body1" sx={{
              fontFamily: 'League Spartan',
              color: THEME.text.secondary,
              fontSize: '1.1rem',
              lineHeight: 1.8,
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              textAlign: 'left'
            }}>
              <span style={{ fontWeight: 600, color: THEME.primary.main }}>Ingredientes del monstruo:</span>
              <br />• 3 kilos de hambre insaciable por historias
              <br />• 2 frascos de saliva ácida para digerir tramas complejas
              <br />• 1 par de colmillos afilados para críticas constructivas
              <br />• Toneladas de curiosidad monstruosa
              <br /><br />
              <span style={{ fontWeight: 600, color: THEME.primary.main }}>La transformación:</span>
              <br />Todo comenzó en 2020, cuando un grupo de monstruos bibliófagos decidimos 
              salir de debajo de nuestras camas literarias para compartir nuestra 
              voracidad por los buenos libros. Desde entonces, devoramos historias día 
              y noche, masticamos cada página con cuidado, y regurgitamos las reseñas 
              más jugosas que encontrarás en internet. ¡ÑAAM!
            </Typography>
          </Paper>
        </motion.div>
      </Box>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: '30px',
            background: `linear-gradient(135deg, ${THEME.primary.main} 0%, ${THEME.primary.dark} 100%)`,
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Typography variant="h4" sx={{ 
            mb: 3, 
            fontWeight: 700,
            fontFamily: 'League Spartan'
          }}>
            ¿Te atreves a unirte a nuestra manada de devoradores?
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 4, 
            opacity: 0.9, 
            maxWidth: '600px', 
            mx: 'auto',
            fontFamily: 'League Spartan'
          }}>
            Prometemos mordiscos literarios jugosos, digestiones profundas de cada libro 
            y rugidos de emoción con cada nueva historia. ¡GRRRR!
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              fontFamily: 'League Spartan',
              bgcolor: 'white',
              color: THEME.primary.main,
              px: 6,
              py: 2,
              borderRadius: '15px',
              fontWeight: 600,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: THEME.accent.light,
                transform: 'translateY(-2px) rotate(-2deg)',
                boxShadow: `0 8px 20px ${alpha('#000', 0.2)}`
              }
            }}
          >
            ¡Quiero ser un monstruo lector! 👾📚
          </Button>
        </Paper>
      </motion.div>
    </Container>
  );
}

export default function AboutUs() {
  return (
    <Box 
      component="main"
      sx={{ 
        bgcolor: THEME.background.default,
        minHeight: '100vh',
        fontFamily: 'League Spartan'
      }}
    >
      <AboutContent />
    </Box>
  );
} 