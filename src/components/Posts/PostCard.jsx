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

// Constantes
const THEME = {
  primary: '#6200ea',
  imageBackground: 'grey.100'
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

  // Estilos memoizados
  const cardStyles = useMemo(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: isList ? 'row' : 'column',
    position: 'relative',
    transition: 'all 0.3s ease',
    transform: isSelected ? 'scale(0.98)' : 'scale(1)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }
  }), [isList, isSelected]);

  const imageContainerStyles = useMemo(() => ({
    position: 'relative',
    paddingTop: isList ? '0' : '56.25%',
    height: isList ? '200px' : 'auto',
    width: isList ? '200px' : '100%',
    backgroundColor: THEME.imageBackground,
  }), [isList]);

  const imageStyles = useMemo(() => ({
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    transform: hovering ? 'scale(1.05)' : 'scale(1)',
    opacity: imageLoaded ? 1 : 0,
  }), [hovering, imageLoaded]);

  const categoryChipStyles = useMemo(() => ({
    backgroundColor: alpha(THEME.primary, 0.1),
    color: THEME.primary,
    fontWeight: 500
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
                  backgroundColor: THEME.imageBackground,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Error al cargar la imagen
                </Typography>
              </Box>
            )}
          </Box>

          <CardContent>
            {/* Categorías */}
            {categories.length > 0 && (
              <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
                mb: 1,
                fontWeight: 700,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
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
              color="text.secondary"
              sx={{
                mb: 2,
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
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 1
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