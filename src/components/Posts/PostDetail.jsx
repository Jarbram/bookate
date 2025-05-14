'use client';
import { useState, useEffect } from 'react';
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
  alpha
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

export default function PostDetail({ post }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [content, setContent] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Colores del tema
  const accentColor = '#6200ea';
  const textColor = '#1a1a1a';
  const bgColor = '#ffffff';
  
  // Procesar categorías y tags
  const categoriesArray = getCategoriesArray(post.categories);
  const tagsArray = getTagsArray(post.tags);
  const adPositions = getAdPositions(post.adPositions);
  
  // Fecha formateada
  const formattedDate = new Date(post.publishDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Animar la aparición de contenido
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Preparar el contenido del post con inserciones de anuncios
  useEffect(() => {
    if (post.content) {
      // Aquí podríamos insertar anuncios en posiciones específicas
      // pero por ahora solo establecemos el contenido
      setContent(post.content);
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
              src={post.featuredImage || 'https://via.placeholder.com/1200x800?text=Imagen+no+disponible'}
              alt={post.title}
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
    </Container>
  );
} 