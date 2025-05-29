'use client';
import { motion } from 'framer-motion';
import { 
  Container, 
  Typography, 
  Box, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import StorageIcon from '@mui/icons-material/Storage';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BalanceIcon from '@mui/icons-material/Balance';
import LockOpenIcon from '@mui/icons-material/LockOpen';

// Tema
const theme = {
  bg: '#FFFFFF',
  text: '#36314c',
  accent: '#7182bb',
  secondary: '#ded1e7',
  fontFamily: "'League Spartan', sans-serif"
};

// Definición de secciones mejorada
const sections = [
  {
    title: "1. Identificación del Responsable",
    content: (
      <Box component="div">
        <Typography variant="body1" sx={{ mb: 2 }}>
          Bookate (https://bookatestore.com) es un blog literario operado por Bookate Media S.L.
        </Typography>
        <List dense>
          {[
            { label: "Email", value: "privacidad@bookatestore.com" },
            { label: "Dirección", value: "Calle de los Libros 123, 28001 Madrid" },
            { label: "CIF", value: "B12345678" }
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {item.label}: 
                <span style={{ fontWeight: 400, marginLeft: '8px' }}>{item.value}</span>
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    ),
    icon: <SecurityIcon />
  },
  {
    title: "2. Datos que Recopilamos",
    content: (
      <List dense>
        {[
          {
            icon: <DataUsageIcon />,
            primary: "Datos de registro",
            secondary: "Email, nombre de usuario y preferencias de lectura para personalizar tu experiencia"
          },
          {
            icon: <StorageIcon />,
            primary: "Datos de navegación",
            secondary: "Páginas visitadas, tiempo de permanencia y patrones de interacción para mejorar nuestro contenido"
          },
          {
            icon: <PrivacyTipIcon />,
            primary: "Cookies esenciales",
            secondary: "Información técnica necesaria para el funcionamiento del sitio"
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
    ),
    icon: <DataUsageIcon />
  },
  {
    title: "3. Finalidad del Tratamiento",
    content: (
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Utilizamos tus datos personales para los siguientes propósitos:
        </Typography>
        <List dense>
          {[
            "Enviar nuestro newsletter con recomendaciones literarias personalizadas",
            "Mejorar la experiencia de usuario en nuestro blog",
            "Analizar tendencias de lectura y preferencias",
            "Responder a tus consultas y comentarios",
            "Garantizar la seguridad de tu cuenta"
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
    icon: <SecurityIcon />
  },
  {
    title: "4. Base Legal",
    content: (
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          El tratamiento de tus datos se fundamenta en:
        </Typography>
        <List dense>
          {[
            {
              primary: "Consentimiento explícito",
              secondary: "Al suscribirte a nuestro newsletter o crear una cuenta"
            },
            {
              primary: "Interés legítimo",
              secondary: "Para mejorar nuestros servicios y experiencia de usuario"
            },
            {
              primary: "Obligación legal",
              secondary: "Cuando sea requerido por la legislación aplicable"
            }
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
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
    icon: <BalanceIcon />
  },
  {
    title: "5. Tus Derechos",
    content: (
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Como usuario, tienes derecho a:
        </Typography>
        <List dense>
          {[
            {
              primary: "Acceso",
              secondary: "Consultar qué datos personales tenemos sobre ti"
            },
            {
              primary: "Rectificación",
              secondary: "Corregir datos inexactos o incompletos"
            },
            {
              primary: "Supresión",
              secondary: "Solicitar la eliminación de tus datos"
            },
            {
              primary: "Limitación",
              secondary: "Restringir el tratamiento de tus datos"
            },
            {
              primary: "Portabilidad",
              secondary: "Recibir tus datos en un formato estructurado"
            }
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
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
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          Para ejercer estos derechos, contacta con nosotros en privacidad@bookatestore.com
        </Typography>
      </Box>
    ),
    icon: <LockOpenIcon />
  }
];

export default function PrivacyPolicy() {
  return (
    <Box sx={{ 
      bgcolor: theme.bg,
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
            <PrivacyTipIcon sx={{ 
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
              Política de Privacidad
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