'use client';
import { motion } from 'framer-motion';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CopyrightIcon from '@mui/icons-material/Copyright';
import SecurityIcon from '@mui/icons-material/Security';
import RuleIcon from '@mui/icons-material/Rule';
import WarningIcon from '@mui/icons-material/Warning';
import UpdateIcon from '@mui/icons-material/Update';
import BalanceIcon from '@mui/icons-material/Balance';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BrushIcon from '@mui/icons-material/Brush';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ShareIcon from '@mui/icons-material/Share';
import ChatIcon from '@mui/icons-material/Chat';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BlockIcon from '@mui/icons-material/Block';
import GroupIcon from '@mui/icons-material/Group';
import LinkIcon from '@mui/icons-material/Link';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';

// Tema actualizado
const theme = {
  bg: '#FFFFFF',
  text: '#36314c',
  accent: '#7182bb',
  secondary: '#ded1e7',
  fontFamily: "'League Spartan', sans-serif"
};

// Definición de secciones
const sections = [
  {
    title: "1. Objeto y Ámbito",
    content: (
      <Box component="div">
        <Typography variant="body1" sx={{ mb: 2 }}>
          Estos términos y condiciones regulan el uso del blog literario Bookate (https://bookatestore.com), 
          incluyendo todos sus contenidos, servicios y funcionalidades.
        </Typography>
        <List dense>
          {[
            "Acceso y uso del blog",
            "Participación en comentarios y discusiones",
            "Suscripción al newsletter",
            "Uso de contenidos y materiales"
          ].map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Box 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    bgcolor: theme.accent 
                  }} 
                />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>
    ),
    icon: <RuleIcon />
  },
  {
    title: "2. Propiedad Intelectual",
    content: (
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Todo el contenido de Bookate está protegido por derechos de autor:
        </Typography>
        <List dense>
          {[
            {
              icon: <CopyrightIcon />,
              primary: "Reseñas y Artículos",
              secondary: "Todas nuestras reseñas, análisis literarios y artículos son contenido original protegido"
            },
            {
              icon: <BrushIcon />,
              primary: "Elementos Visuales",
              secondary: "Diseños, logos, imágenes y elementos gráficos son propiedad de Bookate"
            },
            {
              icon: <AutoStoriesIcon />,
              primary: "Citas y Referencias",
              secondary: "Las citas de obras literarias se utilizan bajo el derecho de cita con fines de crítica y reseña"
            },
            {
              icon: <ShareIcon />,
              primary: "Compartir Contenido",
              secondary: "Puedes compartir nuestro contenido citando la fuente y enlazando a la publicación original"
            }
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40, color: theme.accent }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.primary}
                secondary={item.secondary}
                primaryTypographyProps={{
                  fontFamily: theme.fontFamily,
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
                secondaryTypographyProps={{
                  fontFamily: theme.fontFamily,
                  fontSize: '0.85rem'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    ),
    icon: <CopyrightIcon />
  },
  {
    title: "3. Normas de Participación",
    content: (
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Al participar en nuestra comunidad, te comprometes a:
        </Typography>
        <List dense>
          {[
            {
              icon: <ChatIcon />,
              primary: "Respeto Mutuo",
              secondary: "Mantener un diálogo constructivo y respetuoso con otros usuarios"
            },
            {
              icon: <ThumbUpIcon />,
              primary: "Contenido Apropiado",
              secondary: "Compartir comentarios relevantes y relacionados con la literatura"
            },
            {
              icon: <BlockIcon />,
              primary: "Contenido Prohibido",
              secondary: "No publicar contenido ofensivo, spam o publicidad no autorizada"
            }
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40, color: theme.accent }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.primary}
                secondary={item.secondary}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    ),
    icon: <GroupIcon />
  },
  {
    title: "4. Limitación de Responsabilidad",
    content: (
      <Box>
        <List dense>
          {[
            {
              icon: <LinkIcon />,
              primary: "Enlaces Externos",
              secondary: "No nos responsabilizamos del contenido de sitios externos enlazados"
            },
            {
              icon: <UpdateIcon />,
              primary: "Disponibilidad",
              secondary: "Nos esforzamos por mantener el sitio disponible, pero pueden ocurrir interrupciones técnicas"
            },
            {
              icon: <RateReviewIcon />,
              primary: "Opiniones",
              secondary: "Las reseñas y opiniones son subjetivas y no constituyen asesoramiento profesional"
            },
            {
              icon: <ShoppingCartIcon />,
              primary: "Enlaces de Afiliados",
              secondary: "Algunos enlaces a librerías pueden ser de afiliados, lo que significa que podemos recibir una comisión"
            }
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40, color: theme.accent }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.primary}
                secondary={item.secondary}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    ),
    icon: <WarningIcon />
  },
  {
    title: "5. Modificaciones",
    content: (
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
          Los cambios entrarán en vigor desde su publicación en el sitio web.
        </Typography>
        <List dense>
          {[
            {
              icon: <NotificationsIcon />,
              primary: "Notificaciones",
              secondary: "Te informaremos de cambios significativos en los términos"
            },
            {
              icon: <HistoryIcon />,
              primary: "Versiones Anteriores",
              secondary: "Mantenemos un registro de versiones anteriores accesible bajo petición"
            }
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40, color: theme.accent }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.primary}
                secondary={item.secondary}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    ),
    icon: <UpdateIcon />
  }
];

export default function TermsAndConditions() {
  return (
    <Box sx={{ 
      backgroundColor: theme.bg,
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 6 }, pb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Encabezado */}
          <Box sx={{ 
            textAlign: 'center',
            position: 'relative',
            mb: 4,
          }}>
            <GavelIcon sx={{ 
              fontSize: '3rem', 
              color: theme.accent,
              mb: 1,
              filter: `drop-shadow(0 0 8px ${alpha(theme.accent, 0.3)})`
            }} />
            <Typography
              variant="h1"
              sx={{
                fontFamily: theme.fontFamily,
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                mb: 2,
                color: theme.text,
              }}
            >
              Términos y Condiciones
            </Typography>
          </Box>

          {/* Secciones de Acordeón */}
          <Box sx={{ mb: 4 }}>
            {sections.map((section, index) => (
              <Accordion 
                key={index}
                sx={{
                  mb: 2,
                  borderRadius: '12px !important',
                  '&:before': { display: 'none' },
                  boxShadow: `0 8px 24px ${alpha(theme.text, 0.08)}`,
                  border: `1px solid ${alpha(theme.secondary, 0.3)}`,
                  background: theme.bg,
                  '&:hover': {
                    boxShadow: `0 12px 28px ${alpha(theme.text, 0.15)}`,
                    borderColor: theme.secondary
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: theme.accent }} />}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.secondary, 0.1)
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: theme.accent }}>
                      {section.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: theme.fontFamily,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: theme.text
                      }}
                    >
                      {section.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      fontFamily: theme.fontFamily,
                      color: alpha(theme.text, 0.7),
                      lineHeight: 1.6
                    }}
                  >
                    {section.content}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
} 