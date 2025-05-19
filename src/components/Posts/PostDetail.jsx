'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Chip, 
  Divider, 
  Paper,
  Avatar,
  Grid,
  IconButton,
  Skeleton,
  alpha,
  LinearProgress,
  Fade
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import RelatedPosts from './RelatedPosts';
import AdPlaceholder from '../Ads/AdPlaceholder';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Función para formatear categorías (reutilizada de PostCard)
const getCategoriesArray = (categories) => {
  if (!categories) return [];
  
  return typeof categories === 'string'
    ? categories.split(',').map(cat => cat.trim()).filter(Boolean)
    : Array.isArray(categories)
      ? categories.filter(Boolean)
      : [];
};

// Función similar para tags
const getTagsArray = (tags) => {
  if (!tags) return [];
  
  return typeof tags === 'string'
    ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
    : Array.isArray(tags)
      ? tags.filter(Boolean)
      : [];
};

// Función para obtener posiciones de anuncios
const getAdPositions = (adPositions) => {
  if (!adPositions) return [];
  
  return typeof adPositions === 'string'
    ? adPositions.split(',').map(pos => pos.trim()).filter(Boolean)
    : Array.isArray(adPositions)
      ? adPositions.filter(Boolean)
      : [];
};

// Componente de esqueleto optimizado para mejorar rendimiento
const PostDetailSkeleton = () => {
  const accentColor = '#6200ea';
  
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress 
        sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 9999,
          height: 3,
          backgroundColor: alpha(accentColor, 0.1),
          '& .MuiLinearProgress-bar': {
            backgroundColor: accentColor
          }
        }} 
      />
      
      {/* Estructura optimizada de esqueletos */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1, backgroundColor: alpha(accentColor, 0.04) }} />
        <Skeleton width={180} height={30} sx={{ backgroundColor: alpha(accentColor, 0.04) }} />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Skeleton width={80} height={28} sx={{ borderRadius: '16px', backgroundColor: alpha(accentColor, 0.04) }} />
        <Skeleton width={100} height={28} sx={{ borderRadius: '16px', backgroundColor: alpha(accentColor, 0.04) }} />
      </Box>
      
      <Skeleton width="90%" height={60} sx={{ mb: 1, backgroundColor: alpha(accentColor, 0.05) }} />
      <Skeleton width="70%" height={60} sx={{ mb: 3, backgroundColor: alpha(accentColor, 0.05) }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton width={120} height={24} sx={{ backgroundColor: alpha(accentColor, 0.03) }} />
          <Skeleton width={100} height={24} sx={{ backgroundColor: alpha(accentColor, 0.03) }} />
        </Box>
        <Box>
          <Skeleton width={80} height={24} sx={{ backgroundColor: alpha(accentColor, 0.03) }} />
        </Box>
      </Box>
      
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={400} 
        sx={{ 
          mb: 4, 
          borderRadius: '12px',
          backgroundColor: alpha(accentColor, 0.04)
        }} 
      />
      
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.05)',
          mb: 4
        }}
      >
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={120} 
          sx={{ 
            mb: 4, 
            borderRadius: '4px',
            backgroundColor: alpha(accentColor, 0.03)
          }} 
        />
        
        <Skeleton width="100%" height={20} sx={{ mb: 1, backgroundColor: alpha(accentColor, 0.02) }} />
        <Skeleton width="100%" height={20} sx={{ mb: 1, backgroundColor: alpha(accentColor, 0.02) }} />
        <Skeleton width="90%" height={20} sx={{ mb: 1, backgroundColor: alpha(accentColor, 0.02) }} />
        <Skeleton width="95%" height={20} sx={{ mb: 3, backgroundColor: alpha(accentColor, 0.02) }} />
        
        <Skeleton width="100%" height={200} sx={{ mb: 3, backgroundColor: alpha(accentColor, 0.02) }} />
        
        <Skeleton width="100%" height={20} sx={{ mb: 1, backgroundColor: alpha(accentColor, 0.02) }} />
        <Skeleton width="100%" height={20} sx={{ mb: 1, backgroundColor: alpha(accentColor, 0.02) }} />
        <Skeleton width="75%" height={20} sx={{ mb: 3, backgroundColor: alpha(accentColor, 0.02) }} />
      </Paper>
      
      <Skeleton width={150} height={30} sx={{ mb: 2, backgroundColor: alpha(accentColor, 0.03) }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        <Skeleton width={70} height={32} sx={{ borderRadius: '16px', backgroundColor: alpha(accentColor, 0.02) }} />
        <Skeleton width={90} height={32} sx={{ borderRadius: '16px', backgroundColor: alpha(accentColor, 0.02) }} />
        <Skeleton width={80} height={32} sx={{ borderRadius: '16px', backgroundColor: alpha(accentColor, 0.02) }} />
      </Box>
      
      <Skeleton width={220} height={40} sx={{ mb: 3, backgroundColor: alpha(accentColor, 0.04) }} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Skeleton variant="rectangular" width="calc(33% - 16px)" height={200} sx={{ borderRadius: '12px', backgroundColor: alpha(accentColor, 0.02) }} />
        <Skeleton variant="rectangular" width="calc(33% - 16px)" height={200} sx={{ borderRadius: '12px', backgroundColor: alpha(accentColor, 0.02) }} />
        <Skeleton variant="rectangular" width="calc(33% - 16px)" height={200} sx={{ borderRadius: '12px', backgroundColor: alpha(accentColor, 0.02) }} />
      </Box>
    </Box>
  );
};

export default function PostDetail({ post }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [content, setContent] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Colores del tema extraídos para mejor mantenimiento
  const theme = {
    accentColor: '#6200ea',
    textColor: '#1a1a1a',
    bgColor: '#ffffff'
  };
  
  // Procesar categorías y tags con memoización
  const categoriesArray = useMemo(() => getCategoriesArray(post.categories), [post.categories]);
  const tagsArray = useMemo(() => getTagsArray(post.tags), [post.tags]);
  const adPositions = useMemo(() => getAdPositions(post.adPositions), [post.adPositions]);
  
  // Extraer URL de imagen de forma segura y robusta
  const imageUrl = useMemo(() => {
    const defaultImage = 'https://via.placeholder.com/1200x800?text=Imagen+no+disponible';
    
    try {
      // Si no hay imagen, usar default
      if (!post.featuredImage) return defaultImage;
      
      // Si featuredImage es un string JSON, intentar parsearlo
      if (typeof post.featuredImage === 'string' && 
          (post.featuredImage.startsWith('{') || post.featuredImage.startsWith('['))) {
        try {
          const parsedImage = JSON.parse(post.featuredImage);
          
          // Si es un objeto con URL directa
          if (parsedImage && parsedImage.url) {
            return parsedImage.url;
          }
          
          // Si es un array de attachments (formato Airtable)
          if (Array.isArray(parsedImage) && parsedImage.length > 0 && parsedImage[0].url) {
            return parsedImage[0].url;
          }
          
          // Si tiene thumbnails
          if (parsedImage[0] && parsedImage[0].thumbnails && parsedImage[0].thumbnails.large) {
            return parsedImage[0].thumbnails.large.url;
          }
          
          return defaultImage;
        } catch (e) {
          console.warn('Error al parsear featuredImage:', e);
          // Tratar como URL directa si falla el parse
          return post.featuredImage;
        }
      }
      
      // Si featuredImage es un objeto directo
      if (typeof post.featuredImage === 'object' && post.featuredImage !== null) {
        // Si es un objeto con URL directa
        if (post.featuredImage.url) {
          return post.featuredImage.url;
        }
        
        // Si es un array de attachments
        if (Array.isArray(post.featuredImage) && post.featuredImage.length > 0) {
          if (post.featuredImage[0] && post.featuredImage[0].url) {
            return post.featuredImage[0].url;
          }
          
          // Si tiene thumbnails
          if (post.featuredImage[0] && post.featuredImage[0].thumbnails && post.featuredImage[0].thumbnails.large) {
            return post.featuredImage[0].thumbnails.large.url;
          }
        }
      }
      
      // Si es un string directo que parece URL
      if (typeof post.featuredImage === 'string' && post.featuredImage.trim() !== '') {
        // Verificar si el string parece una URL válida
        if (post.featuredImage.match(/^https?:\/\//i)) {
          return post.featuredImage;
        }
      }
      
      // Si no se pudo extraer una URL válida, usar default
      return defaultImage;
    } catch (error) {
      console.error('Error al procesar URL de imagen:', error);
      return defaultImage;
    }
  }, [post.featuredImage]);
  
  // Fecha formateada con memoización
  const formattedDate = useMemo(() => {
    return new Date(post.publishDate).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [post.publishDate]);
  
  // Animar la aparición de contenido
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Optimizado: Preparación del contenido con mejor manejo de efectos
  useEffect(() => {
    if (!post.content) return;
    
    setContent(post.content);
    
    const contentTimer = setTimeout(() => {
      setContentLoaded(true);
      
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(loadingTimer);
    }, 500);
    
    return () => clearTimeout(contentTimer);
  }, [post.content]);
  
  // Manejadores para el menú compartir
  const handleShareClick = (event) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.log('Error compartiendo:', error));
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setSnackbarMessage('Enlace copiado al portapapeles');
        setSnackbarOpen(true);
        handleCloseMenu();
      })
      .catch(err => {
        console.error('Error al copiar: ', err);
      });
  };

  // Optimizado: Función para compartir en redes sociales
  const shareOnSocial = useCallback((network) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title || '');
    const text = encodeURIComponent(post.excerpt || '');
    
    let shareUrl;
    
    switch(network) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    handleCloseMenu();
  }, [post.title, post.excerpt]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 4, md: 6 }, // Ajuste para mejor espaciado en móvil
        px: { xs: 2, sm: 3, md: 4 } 
      }}
    >
      {/* Mostrar esqueleto con mejor transición */}
      {isLoading && (
        <Fade in={isLoading} timeout={300}>
          <Box>
            <PostDetailSkeleton />
          </Box>
        </Fade>
      )}
      
      {/* Contenido con mejor transición y estructura de animaciones */}
      <Fade in={!isLoading} timeout={600}>
        <Box sx={{ display: isLoading ? 'none' : 'block' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            {/* Botón de regreso */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
                <IconButton 
                  component={Link} 
                  href="/"
                  aria-label="Volver"
                  sx={{ 
                    color: alpha(theme.textColor, 0.7), 
                    mb: 1,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      backgroundColor: alpha(theme.accentColor, 0.08),
                      color: theme.accentColor,
                      transform: 'translateX(-4px)'
                    } 
                  }}
                >
                  <ArrowBackIcon />
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                    Volver a todos los artículos
                  </Typography>
                </IconButton>
              </Box>
            </motion.div>
            
            {/* Categorías del post */}
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {categoriesArray.map((category, index) => (
                  <Chip
                    key={index}
                    component={Link}
                    href={`/?category=${encodeURIComponent(category)}`}
                    label={category}
                    size="small"
                    clickable
                    sx={{
                      backgroundColor: alpha(theme.accentColor, 0.08),
                      color: theme.accentColor,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.accentColor, 0.15),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 8px ${alpha(theme.accentColor, 0.15)}`
                      }
                    }}
                  />
                ))}
              </Box>
            </motion.div>
            
            {/* Título principal */}
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '2.2rem', sm: '2.5rem', md: '3rem' }, 
                  fontWeight: 800,
                  mb: 3,
                  color: theme.textColor,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  textShadow: `1px 1px 1px ${alpha(theme.textColor, 0.03)}`
                }}
              >
                {post.title}
              </Typography>
            </motion.div>
            
            {/* Metadatos del post */}
            <motion.div variants={itemVariants}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 5,
                  pb: 2,
                  borderBottom: `1px solid ${alpha(theme.textColor, 0.08)}`
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  borderRadius: '20px',
                  backgroundColor: alpha(theme.textColor, 0.03)
                }}>
                  <CalendarTodayIcon sx={{ fontSize: '0.9rem', color: alpha(theme.textColor, 0.6), mr: 1 }} />
                  <Typography variant="body2" sx={{ 
                    color: alpha(theme.textColor, 0.7),
                    fontWeight: 500
                  }}>
                    {formattedDate}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    aria-label="Compartir"
                    size="small"
                    onClick={handleShareClick}
                    sx={{ 
                      color: alpha(theme.textColor, 0.6),
                      backgroundColor: alpha(theme.textColor, 0.05),
                      borderRadius: '50%',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.accentColor, 0.08),
                        color: theme.accentColor,
                        transform: 'rotate(10deg)'
                      }
                    }}
                  >
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </motion.div>
            
            {/* Imagen destacada con mejor manejo de errores */}
            <motion.div variants={itemVariants}>
              <Box 
                sx={{ 
                  position: 'relative',
                  width: '100%',
                  height: 'auto',
                  mb: 5,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)', // Sombra mejorada
                  maxHeight: { xs: '250px', sm: '400px', md: '550px' }, // Alturas más adecuadas
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.textColor, 0.03),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}
              >
                {!imageLoaded && !imageError && (
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={{ xs: '250px', sm: '400px', md: '500px' }}
                    animation="wave" 
                    sx={{ transform: 'none' }}
                  />
                )}
                
                <Image
                  src={imageUrl}
                  alt={post.title || 'Imagen del artículo'}
                  width={1200}
                  height={800}
                  priority
                  sizes="(max-width: 600px) 100vw, (max-width: 960px) 90vw, 1200px"
                  style={{ 
                    objectFit: 'cover', // Cambiado a cover para mejor visualización 
                    width: '100%',
                    height: '100%', // Asegura que la imagen llene el contenedor
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    display: imageError ? 'none' : 'block'
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
                
                {imageError && (
                  <Box sx={{ 
                    p: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: { xs: '200px', sm: '300px' }, 
                    width: '100%',
                    color: alpha(theme.textColor, 0.5),
                    textAlign: 'center'
                  }}>
                    <Typography>
                      No se pudo cargar la imagen
                    </Typography>
                  </Box>
                )}
              </Box>
            </motion.div>
            
            {/* Anuncio superior si está configurado */}
            {adPositions.includes('top') && (
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 4 }}>
                  <AdPlaceholder location="post_top" />
                </Box>
              </motion.div>
            )}
            
            {/* Contenido principal (Markdown) con estilos mejorados */}
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: '16px',
                  backgroundColor: theme.bgColor,
                  border: '1px solid rgba(0,0,0,0.05)',
                  mb: 5,
                  boxShadow: '0 4px 30px rgba(0,0,0,0.04)'
                }}
              >
                {/* Extracto destacado */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: alpha(theme.accentColor, 0.05),
                    borderLeft: `4px solid ${theme.accentColor}`,
                    borderRadius: '8px',
                    mb: 5,
                    position: 'relative',
                  }}
                >
                  {/* Comilla decorativa como componente separado */}
                  <Typography
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: '-25px',
                      left: '20px',
                      fontSize: '3.5rem',
                      color: alpha(theme.accentColor, 0.2),
                      fontFamily: 'serif',
                      lineHeight: 1,
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  >
                    "
                  </Typography>
                  
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 500,
                      color: alpha(theme.textColor, 0.85),
                      fontSize: '1.1rem',
                      lineHeight: 1.6
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                </Box>
                
                {/* Anuncio intermedio si está configurado */}
                {adPositions.includes('middle') && (
                  <Box sx={{ my: 4 }}>
                    <AdPlaceholder location="post_middle" />
                  </Box>
                )}
                
                {/* Contenido principal (Markdown) */}
                <Box className="markdown-content" sx={{ 
                  '& h1': { 
                    fontSize: { xs: '1.8rem', md: '2rem' }, // Tamaño responsive
                    fontWeight: 700, 
                    mt: 5, 
                    mb: 3, 
                    color: theme.textColor,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '60px',
                      height: '4px',
                      backgroundColor: theme.accentColor,
                      borderRadius: '2px'
                    }
                  },
                  '& h2': { 
                    fontSize: { xs: '1.4rem', md: '1.6rem' }, // Tamaño responsive
                    fontWeight: 700, 
                    mt: 4, 
                    mb: 3, 
                    color: theme.textColor,
                    borderBottom: `1px solid ${alpha(theme.textColor, 0.1)}`,
                    paddingBottom: '0.7rem'
                  },
                  '& h3': { 
                    fontSize: '1.3rem', 
                    fontWeight: 600, 
                    mt: 3.5, 
                    mb: 2.5, 
                    color: theme.textColor,
                    position: 'relative',
                    paddingLeft: '14px',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '8px',
                      width: '6px',
                      height: '16px',
                      backgroundColor: alpha(theme.accentColor, 0.5),
                      borderRadius: '3px'
                    }
                  },
                  '& p': { 
                    fontSize: { xs: '1rem', md: '1.1rem' }, // Tamaño responsive
                    lineHeight: 1.8, 
                    my: 2.5,
                    color: alpha(theme.textColor, 0.85)
                  },
                  '& a': { 
                    color: theme.accentColor, 
                    textDecoration: 'none',
                    borderBottom: `1px solid ${alpha(theme.accentColor, 0.3)}`,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    padding: '0 2px',
                    '&:hover': {
                      borderBottom: `2px solid ${theme.accentColor}`,
                      backgroundColor: alpha(theme.accentColor, 0.05)
                    }
                  },
                  '& ul, & ol': { 
                    pl: 4, 
                    my: 3,
                    '& ul, & ol': {
                      my: 1
                    }
                  },
                  '& li': { 
                    mb: 1.5,
                    color: alpha(theme.textColor, 0.85),
                    paddingLeft: '0.5rem'
                  },
                  '& blockquote': { 
                    borderLeft: `4px solid ${alpha(theme.accentColor, 0.5)}`,
                    pl: 3,
                    py: 1, 
                    my: 4,
                    fontStyle: 'italic',
                    backgroundColor: alpha(theme.accentColor, 0.05),
                    borderRadius: '0 8px 8px 0',
                    boxShadow: `inset 0 0 15px ${alpha(theme.accentColor, 0.03)}`,
                    '& p': {
                      color: alpha(theme.textColor, 0.75),
                      fontSize: { xs: '1rem', md: '1.05rem' } // Tamaño responsive
                    }
                  },
                  '& img': { 
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '12px',
                    my: 4,
                    display: 'block',
                    margin: '2.5rem auto',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
                  },
                  '& hr': { 
                    my: 5,
                    border: 'none',
                    height: '1px',
                    backgroundImage: `linear-gradient(to right, ${alpha(theme.textColor, 0)}, ${alpha(theme.textColor, 0.15)}, ${alpha(theme.textColor, 0)})`,
                    margin: '30px auto'
                  },
                  '& code': {
                    backgroundColor: alpha(theme.textColor, 0.06),
                    padding: '3px 6px',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    fontFamily: 'monospace'
                  },
                  '& pre': {
                    backgroundColor: alpha(theme.textColor, 0.06),
                    padding: { xs: '12px', md: '16px' },
                    borderRadius: '8px',
                    overflow: 'auto',
                    boxShadow: `inset 0 0 20px ${alpha(theme.textColor, 0.03)}`,
                    // Asegurar que el código no rompa el layout en móvil
                    maxWidth: '100%',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }
                }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </Box>
              </Paper>
            </motion.div>
            
            {/* Anuncio inferior si está configurado */}
            {adPositions.includes('bottom') && (
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 4 }}>
                  <AdPlaceholder location="post_bottom" />
                </Box>
              </motion.div>
            )}
            
            {/* Etiquetas */}
            <motion.div variants={itemVariants}>
              <Box sx={{ 
                mb: 5, 
                p: 3, 
                borderRadius: '12px',
                backgroundColor: alpha(theme.textColor, 0.02),
                border: `1px solid ${alpha(theme.textColor, 0.06)}`
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontWeight: 600, 
                    mb: 2,
                    fontSize: '1.1rem',
                    color: alpha(theme.textColor, 0.8)
                  }}
                >
                  <LocalOfferIcon sx={{ 
                    mr: 1.5, 
                    fontSize: '1.2rem', 
                    color: alpha(theme.textColor, 0.6)
                  }} />
                  Etiquetas
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tagsArray.length > 0 ? tagsArray.map((tag, index) => (
                    <Chip
                      key={index}
                      component={Link}
                      href={`/?tag=${encodeURIComponent(tag)}`}
                      label={tag}
                      size="small"
                      clickable
                      sx={{
                        backgroundColor: alpha(theme.textColor, 0.06),
                        color: alpha(theme.textColor, 0.85),
                        borderRadius: '6px',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(theme.textColor, 0.12),
                          transform: 'translateY(-2px)'
                        }
                      }}
                    />
                  )) : (
                    <Typography variant="body2" sx={{ color: alpha(theme.textColor, 0.6) }}>
                      No hay etiquetas disponibles
                    </Typography>
                  )}
                </Box>
              </Box>
            </motion.div>
            
            {/* Posts relacionados */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 5 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 3.5, 
                    pb: 1.5,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '80%',
                      height: '3px',
                      backgroundColor: theme.accentColor,
                      borderRadius: '3px'
                    }
                  }}
                >
                  También te podría interesar
                </Typography>
                <RelatedPosts 
                  currentPostId={post.id} 
                  categories={categoriesArray}
                  tags={tagsArray}
                  limit={3}
                />
              </Box>
            </motion.div>
          </motion.div>
        </Box>
      </Fade>
      
      {/* Menú de compartir mejorado */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 6, // Mayor elevación para mejor visibilidad
          sx: {
            borderRadius: '12px',
            mt: 1.5,
            minWidth: 220,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)'
          }
        }}
      >
        <Box sx={{ 
          p: 1.5, 
          pb: 0.5, 
          backgroundColor: alpha(theme.accentColor, 0.05),
          borderBottom: `1px solid ${alpha(theme.accentColor, 0.1)}`
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: alpha(theme.textColor, 0.7) }}>
            Compartir artículo
          </Typography>
        </Box>
        
        <MenuItem onClick={() => shareOnSocial('facebook')} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <FacebookIcon fontSize="small" sx={{ color: '#1877F2' }} />
          </ListItemIcon>
          <ListItemText>Facebook</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => shareOnSocial('twitter')} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <TwitterIcon fontSize="small" sx={{ color: '#1DA1F2' }} />
          </ListItemIcon>
          <ListItemText>Twitter</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => shareOnSocial('linkedin')} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LinkedInIcon fontSize="small" sx={{ color: '#0A66C2' }} />
          </ListItemIcon>
          <ListItemText>LinkedIn</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => shareOnSocial('whatsapp')} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
          </ListItemIcon>
          <ListItemText>WhatsApp</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={copyToClipboard} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copiar enlace</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Snackbar mejorado */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: { xs: 2, md: 4 } }} // Mejor posicionamiento en móvil
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
} 