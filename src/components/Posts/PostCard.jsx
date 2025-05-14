'use client';
import { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip,
  CardActionArea,
  Divider,
  Skeleton,
  alpha
} from '@mui/material';
import Image from 'next/image';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { motion } from 'framer-motion';

// Función para estandarizar las categorías (movida fuera del componente)
const getCategoriesArray = (categories) => {
  if (!categories) return [];
  
  return typeof categories === 'string'
    ? categories.split(',').map(cat => cat.trim()).filter(Boolean)
    : Array.isArray(categories)
      ? categories.filter(Boolean)
      : [];
};

export default function PostCard({ post, viewMode = 'grid' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hovering, setHovering] = useState(false);
  
  // Colores primarios del tema
  const accentColor = '#6200ea';
  const textColor = '#1a1a1a';
  const cardBgColor = '#ffffff';

  const isList = viewMode === 'list';
  
  // Cálculo de fecha relativa (memoizado para evitar recálculos)
  const getRelativeDate = useMemo(() => {
    const dateString = post.publishDate || post.date || new Date().toISOString();
    if (!dateString) return 'Fecha no disponible';
    
    const now = new Date();
    const postDate = new Date(dateString);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }
    
    // Formato de fecha más amigable
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return postDate.toLocaleDateString('es-ES', options);
  }, [post.publishDate, post.date]);
  
  // Verificar campos y usar valores por defecto
  const imageUrl = post.featuredImage || 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
  const postViews = post.views || 0;
  
  // Procesar categorías con formato estandarizado
  const categoriesArray = useMemo(() => getCategoriesArray(post.categories), [post.categories]);
  
  // Gradiente animado para el hover
  const hoverGradient = `linear-gradient(130deg, ${accentColor}, transparent 70%)`;
  
  return (
    <Card 
      component={motion.div}
      whileHover={{ 
        y: -8,
        boxShadow: '0 12px 24px rgba(98, 0, 234, 0.08)',
        transition: { duration: 0.2 }
      }}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: isList ? 'row' : 'column',
        transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        overflow: 'visible',
        position: 'relative',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid rgba(0,0,0,0.03)',
        maxWidth: '100%',
        backgroundColor: cardBgColor,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: -1,
          borderRadius: '17px',
          padding: '1px',
          background: hovering ? hoverGradient : 'transparent',
          WebkitMask: 
            'linear-gradient(#fff 0 0) content-box, ' +
            'linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: hovering ? 1 : 0,
          transition: 'all 0.3s ease',
          zIndex: 0
        }
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <CardActionArea 
        component="a" 
        href={`/post/${post.slug}`}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: isList ? 'row' : 'column', 
          alignItems: 'stretch',
          borderRadius: '16px',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        <Box 
          sx={{ 
            position: 'relative', 
            height: isList ? 140 : 200, 
            width: isList ? 200 : '100%',
            overflow: 'hidden',
            flexShrink: 0,
            borderRadius: isList ? '16px 0 0 16px' : '16px 16px 0 0'
          }}
        >
          {!imageLoaded && (
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height="100%" 
              animation="wave"
              sx={{ 
                backgroundColor: alpha('#000', 0.04),
                transform: 'none'
              }}
            />
          )}
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            <Image
              src={imageUrl}
              alt={post.title || 'Imagen del artículo'}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
              priority={false}
              loading="lazy"
              style={{ 
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: hovering ? 'scale(1.05)' : 'scale(1)'
              }}
              onLoad={() => setImageLoaded(true)}
            />
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)',
              }}
            />
          </Box>
          
          {/* Categorías mejoradas */}
          {categoriesArray.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                zIndex: 2,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5
              }}
            >
              {categoriesArray.slice(0, 2).map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const params = new URLSearchParams();
                    params.set('category', category);
                    window.location.href = `/?${params.toString()}`;
                  }}
                  sx={{
                    height: '20px',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    borderRadius: '4px',
                    backgroundColor: alpha(accentColor, 0.8),
                    color: 'white',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: accentColor,
                      transform: 'translateY(-2px)'
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <CardContent 
          sx={{ 
            flexGrow: 1, 
            p: 2.5,
            pb: '16px !important',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2"
            sx={{ 
              fontWeight: 700, 
              fontSize: isList ? '0.95rem' : '1.1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1.5,
              lineHeight: 1.3,
              color: textColor
            }}
          >
            {post.title}
          </Typography>
          
          {post.excerpt && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.5,
                opacity: 0.85,
                fontSize: '0.825rem',
                color: alpha('#000', 0.7),
                mb: 'auto',
                minHeight: isList ? 'auto' : '2.5rem'
              }}
            >
              {post.excerpt}
            </Typography>
          )}
          
          <Divider sx={{ my: 1.5, borderColor: alpha('#000', 0.05) }} />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {post.author ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    color: alpha('#000', 0.75)
                  }}
                >
                  {post.author}
                </Typography>
              </Box>
            ) : null}
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              ml: post.author ? 0 : 'auto'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VisibilityIcon sx={{ 
                  fontSize: '0.9rem', 
                  color: alpha('#000', 0.4),
                  mr: 0.5
                }} />
                <Typography 
                  variant="caption"
                  sx={{ 
                    fontSize: '0.75rem',
                    color: alpha('#000', 0.6)
                  }}
                >
                  {postViews.toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: alpha(accentColor, 0.05),
                borderRadius: '12px',
                padding: '2px 8px',
              }}>
                <CalendarTodayIcon sx={{
                  fontSize: '0.7rem',
                  color: alpha(accentColor, 0.7),
                  mr: 0.5
                }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    color: alpha(accentColor, 0.8)
                  }}
                >
                  {getRelativeDate}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
} 