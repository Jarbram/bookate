'use client';
import { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  CardActionArea,
  alpha
} from '@mui/material';
import Image from 'next/image';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Link from 'next/link';

// Nueva definición del tema
const THEME = {
  background: {
    primary: '#FFFFFF',
    secondary: '#ded1e7',
    accent: '#7182bb',
    image: '#f5f3f7' // Fondo suave para imágenes
  },
  text: {
    primary: '#36314c',
    secondary: alpha('#36314c', 0.7),
  },
  card: {
    shadow: '0 8px 24px rgba(54, 49, 76, 0.08)',
    shadowHover: '0 12px 28px rgba(54, 49, 76, 0.15)'
  }
};

export default function PostCard({ post, viewMode = 'grid', onClick, isSelected = false }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hovering, setHovering] = useState(false);
  
  const isList = viewMode === 'list';

  // Memoización de valores derivados
  const formattedDate = useMemo(() => {
    if (!post.publishDate) return '';
    return new Date(post.publishDate).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [post.publishDate]);

  const categories = useMemo(() => (
    Array.isArray(post.categories) ? post.categories : []
  ), [post.categories]);

  const imageUrl = useMemo(() => {
    if (!post.featuredImage) return '/images/default-placeholder.jpg';
    return post.featuredImage.includes('supabase.co')
      ? post.featuredImage
      : '/images/default-placeholder.jpg';
  }, [post.featuredImage]);

  // Estilos actualizados y memoizados
  const cardStyles = useMemo(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: isList ? 'row' : 'column',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isSelected ? 'scale(0.98)' : 'scale(1)',
    backgroundColor: THEME.background.primary,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${alpha(THEME.background.secondary, 0.3)}`,
    boxShadow: THEME.card.shadow,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: THEME.card.shadowHover,
      borderColor: THEME.background.secondary
    }
  }), [isList, isSelected]);

  const imageContainerStyles = useMemo(() => ({
    position: 'relative',
    paddingTop: isList ? '0' : '56.25%',
    height: isList ? '200px' : 'auto',
    width: isList ? '200px' : '100%',
    backgroundColor: THEME.background.image,
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: hovering 
        ? `linear-gradient(to bottom, transparent 50%, ${alpha(THEME.background.accent, 0.1)})`
        : 'none',
      transition: 'all 0.3s ease'
    }
  }), [isList, hovering]);

  const imageStyles = useMemo(() => ({
    objectFit: 'cover',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: hovering ? 'scale(1.05)' : 'scale(1)',
    opacity: imageLoaded ? 1 : 0,
  }), [hovering, imageLoaded]);

  const categoryChipStyles = useMemo(() => ({
    backgroundColor: alpha(THEME.background.accent, 0.1),
    color: THEME.background.accent,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: '24px',
    '&:hover': {
      backgroundColor: alpha(THEME.background.accent, 0.2),
    }
  }), []);

  return (
    <Card sx={cardStyles}>
      <Link 
        href={`/post/${post.slug}`}
        passHref
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        <CardActionArea 
          sx={{ height: '100%' }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Imagen destacada */}
          <Box sx={imageContainerStyles}>
            {!imageError ? (
              <Image
                src={imageUrl}
                alt={post.title || 'Post image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={imageStyles}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                priority={false}
              />
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: THEME.background.image,
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ color: THEME.text.secondary }}
                >
                  Error al cargar la imagen
                </Typography>
              </Box>
            )}
          </Box>

          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Categorías */}
            {categories.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    sx={categoryChipStyles}
                  />
                ))}
              </Box>
            )}

            {/* Título */}
            <Typography 
              variant="h6" 
              component="h2"
              sx={{ 
                mb: 1.5,
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                lineHeight: 1.4,
                color: THEME.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {post.title}
            </Typography>

            {/* Extracto */}
            <Typography 
              variant="body2" 
              sx={{
                mb: 2.5,
                color: THEME.text.secondary,
                lineHeight: 1.6,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {post.excerpt}
            </Typography>

            {/* Fecha de publicación */}
            <Typography 
              variant="caption" 
              sx={{ 
                color: THEME.text.secondary,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '0.8rem'
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 16 }} />
              {formattedDate}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
} 