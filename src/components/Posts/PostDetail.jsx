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
  
  // Colores del tema
  const accentColor = '#6200ea';
  const textColor = '#1a1a1a';
  const bgColor = '#ffffff';
  
  // Procesar categorías y tags
  const categoriesArray = getCategoriesArray(post.categories);
  const tagsArray = getTagsArray(post.tags);
  const adPositions = getAdPositions(post.adPositions);
  
  // Extraer URL de imagen de forma segura (similar a PostCard)
  const imageUrl = useMemo(() => {
    const defaultImage = 'https://via.placeholder.com/1200x800?text=Imagen+no+disponible';
    
    // Función para extraer URL de campos attachment de Airtable
    const extractAttachmentUrl = (attachmentField) => {
      if (!attachmentField) return null;
      
      // Para campos attachment en formato array de objetos
      if (Array.isArray(attachmentField) && attachmentField.length > 0) {
        // Acceso a la URL principal
        if (attachmentField[0] && attachmentField[0].url) {
          return attachmentField[0].url;
        }
        
        // Acceso a thumbnails si están disponibles
        if (attachmentField[0] && attachmentField[0].thumbnails && attachmentField[0].thumbnails.large) {
          return attachmentField[0].thumbnails.large.url;
        }
      }
      
      // Para casos donde ya se ha extraído la URL (cadena directa no vacía)
      if (typeof attachmentField === 'string' && attachmentField.trim() !== '') {
        return attachmentField;
      }
      
      return null;
    };
    
    return extractAttachmentUrl(post.featuredImage) || defaultImage;
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
  
  // Iniciar compartir
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
      .catch((error) => console.log('Error compartiendo:', error));
    } else {
      setShowShareMenu(!showShareMenu);
    }
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ fontSize: '0.9rem', color: alpha(textColor, 0.6), mr: 1 }} />
                    <Typography variant="body2" sx={{ color: alpha(textColor, 0.7) }}>
                      {formattedDate}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <VisibilityIcon sx={{ fontSize: '0.9rem', color: alpha(textColor, 0.6), mr: 1 }} />
                    <Typography variant="body2" sx={{ color: alpha(textColor, 0.7) }}>
                      {post.views ? post.views.toLocaleString() : 0} lecturas
                    </Typography>
                  </Box>
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
                    onClick={handleShare}
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
                />
              </Box>
            </motion.div>
          </motion.div>
        </Box>
      </Fade>
    </Container>
  );
} 