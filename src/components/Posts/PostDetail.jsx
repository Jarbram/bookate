'use client';
import { useState, useEffect, useMemo } from 'react';
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

// Componente de esqueleto para la página de detalle
const PostDetailSkeleton = () => {
  // Colores del tema
  const accentColor = '#6200ea';
  const textColor = '#1a1a1a';
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Barra de progreso superior */}
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
      
      {/* Estructura de esqueletos */}
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
  
  // Colores del tema
  const accentColor = '#6200ea';
  const textColor = '#1a1a1a';
  const bgColor = '#ffffff';
  
  // Procesar categorías y tags
  const categoriesArray = getCategoriesArray(post.categories);
  const tagsArray = getTagsArray(post.tags);
  const adPositions = getAdPositions(post.adPositions);
  
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
  
  // Fecha formateada
  const formattedDate = new Date(post.publishDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
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
  
  // Preparar el contenido del post con inserciones de anuncios
  useEffect(() => {
    if (post.content) {
      // Aquí podríamos insertar anuncios en posiciones específicas
      setContent(post.content);
      
      // Simular tiempo de carga para mejor experiencia
      const timer = setTimeout(() => {
        setContentLoaded(true);
        
        // Eliminar el estado de carga después de un tiempo
        const loadTimer = setTimeout(() => {
          setIsLoading(false);
        }, 300);
        
        return () => clearTimeout(loadTimer);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [post.content, adPositions]);
  
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

  const shareOnSocial = (network) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
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
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Mostrar esqueleto mientras carga */}
      {isLoading && (
        <Fade in={isLoading} timeout={300}>
          <Box>
            <PostDetailSkeleton />
          </Box>
        </Fade>
      )}
      
      {/* Contenido real con animación de entrada */}
      <Fade in={!isLoading} timeout={500}>
        <Box sx={{ display: isLoading ? 'none' : 'block' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            {/* Botón de regreso */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 3 }}>
                <IconButton 
                  component={Link} 
                  href="/"
                  aria-label="Volver"
                  sx={{ 
                    color: alpha(textColor, 0.7), 
                    mb: 1,
                    '&:hover': { 
                      backgroundColor: alpha(accentColor, 0.05),
                      color: accentColor 
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {categoriesArray.map((category, index) => (
                  <Chip
                    key={index}
                    component={Link}
                    href={`/?category=${encodeURIComponent(category)}`}
                    label={category}
                    size="small"
                    clickable
                    sx={{
                      backgroundColor: alpha(accentColor, 0.08),
                      color: accentColor,
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: alpha(accentColor, 0.15),
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
                  fontSize: { xs: '2rem', md: '2.5rem' }, 
                  fontWeight: 800,
                  mb: 3,
                  color: textColor,
                  lineHeight: 1.2
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
                  mb: 4
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ fontSize: '0.9rem', color: alpha(textColor, 0.6), mr: 1 }} />
                  <Typography variant="body2" sx={{ color: alpha(textColor, 0.7) }}>
                    {formattedDate}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    aria-label="Guardar"
                    size="small"
                    sx={{ color: alpha(textColor, 0.6) }}
                  >
                    <BookmarkBorderIcon fontSize="small" />
                  </IconButton>
                  
                  <IconButton 
                    aria-label="Compartir"
                    size="small"
                    onClick={handleShareClick}
                    sx={{ color: alpha(textColor, 0.6) }}
                  >
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </motion.div>
            
            {/* Imagen destacada */}
            <motion.div variants={itemVariants}>
              <Box 
                sx={{ 
                  position: 'relative',
                  width: '100%',
                  height: { xs: '200px', sm: '300px', md: '400px' },
                  mb: 4,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                {!imageLoaded && (
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height="100%" 
                    animation="wave" 
                    sx={{ transform: 'none' }}
                  />
                )}
                
                <Image
                  src={imageUrl}
                  alt={post.title || 'Imagen del artículo'}
                  fill
                  priority
                  sizes="(max-width: 600px) 100vw, (max-width: 960px) 90vw, 1200px"
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease'
                  }}
                  onLoad={() => setImageLoaded(true)}
                />
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
            
            {/* Contenido principal */}
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 4 },
                  borderRadius: '12px',
                  backgroundColor: bgColor,
                  border: '1px solid rgba(0,0,0,0.05)',
                  mb: 4
                }}
              >
                {/* Extracto destacado */}
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: alpha(accentColor, 0.05),
                    borderLeft: `4px solid ${accentColor}`,
                    borderRadius: '4px',
                    mb: 4
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 500,
                      color: alpha(textColor, 0.85)
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
                    fontSize: '1.9rem', 
                    fontWeight: 700, 
                    mt: 4, 
                    mb: 2, 
                    color: textColor 
                  },
                  '& h2': { 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    mt: 4, 
                    mb: 2, 
                    color: textColor,
                    borderBottom: `1px solid ${alpha(textColor, 0.1)}`,
                    paddingBottom: '0.5rem'
                  },
                  '& h3': { 
                    fontSize: '1.25rem', 
                    fontWeight: 600, 
                    mt: 3, 
                    mb: 2, 
                    color: textColor 
                  },
                  '& p': { 
                    fontSize: '1.05rem', 
                    lineHeight: 1.7, 
                    my: 2,
                    color: alpha(textColor, 0.85)
                  },
                  '& a': { 
                    color: accentColor, 
                    textDecoration: 'none',
                    borderBottom: `1px solid ${alpha(accentColor, 0.3)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderBottom: `1px solid ${accentColor}`,
                      backgroundColor: alpha(accentColor, 0.05)
                    }
                  },
                  '& ul, & ol': { 
                    pl: 4, 
                    my: 2 
                  },
                  '& li': { 
                    mb: 1,
                    color: alpha(textColor, 0.85)
                  },
                  '& blockquote': { 
                    borderLeft: `4px solid ${alpha(accentColor, 0.5)}`,
                    pl: 2,
                    py: 0.5, 
                    my: 3,
                    fontStyle: 'italic',
                    backgroundColor: alpha(accentColor, 0.05),
                    borderRadius: '0 4px 4px 0',
                    '& p': {
                      color: alpha(textColor, 0.75)
                    }
                  },
                  '& img': { 
                    maxWidth: '100%',
                    borderRadius: '8px',
                    my: 3
                  },
                  '& hr': { 
                    my: 4,
                    border: 'none',
                    borderTop: `1px solid ${alpha(textColor, 0.1)}`
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
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontWeight: 600, 
                    mb: 2,
                    fontSize: '1rem'
                  }}
                >
                  <LocalOfferIcon sx={{ mr: 1, fontSize: '1.1rem', color: alpha(textColor, 0.6) }} />
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
                        backgroundColor: alpha(textColor, 0.08),
                        color: alpha(textColor, 0.8),
                        '&:hover': {
                          backgroundColor: alpha(textColor, 0.15),
                        }
                      }}
                    />
                  )) : (
                    <Typography variant="body2" sx={{ color: alpha(textColor, 0.6) }}>
                      No hay etiquetas disponibles
                    </Typography>
                  )}
                </Box>
              </Box>
            </motion.div>
            
            {/* Posts relacionados */}
            <motion.div variants={itemVariants}>
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 3, 
                    pb: 1,
                    borderBottom: `1px solid ${alpha(textColor, 0.1)}`
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
      
      {/* Agregar menú de compartir */}
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
          elevation: 3,
          sx: {
            borderRadius: '12px',
            mt: 1,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => shareOnSocial('facebook')}>
          <ListItemIcon>
            <FacebookIcon fontSize="small" sx={{ color: '#1877F2' }} />
          </ListItemIcon>
          <ListItemText>Facebook</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => shareOnSocial('twitter')}>
          <ListItemIcon>
            <TwitterIcon fontSize="small" sx={{ color: '#1DA1F2' }} />
          </ListItemIcon>
          <ListItemText>Twitter</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => shareOnSocial('linkedin')}>
          <ListItemIcon>
            <LinkedInIcon fontSize="small" sx={{ color: '#0A66C2' }} />
          </ListItemIcon>
          <ListItemText>LinkedIn</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => shareOnSocial('whatsapp')}>
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
          </ListItemIcon>
          <ListItemText>WhatsApp</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={copyToClipboard}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copiar enlace</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Snackbar para notificar copiado */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
} 