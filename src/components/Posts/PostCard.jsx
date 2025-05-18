'use client';
import { useState, useMemo, useEffect } from 'react';
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
  alpha,
  Fade
} from '@mui/material';
import Image from 'next/image';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Función para estandarizar las categorías (movida fuera del componente)
const getCategoriesArray = (categories) => {
  if (!categories) return [];
  
  return typeof categories === 'string'
    ? categories.split(',').map(cat => cat.trim()).filter(Boolean)
    : Array.isArray(categories)
      ? categories.filter(Boolean)
      : [];
};

// Componente de esqueleto para mejorar la experiencia de carga
const PostCardSkeleton = ({ viewMode = 'grid' }) => {
  const isList = viewMode === 'list';
  const accentColor = '#6200ea';
  
  return (
    <Card
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: isList ? 'row' : 'column',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}
    >
      <Skeleton 
        variant="rectangular" 
        width={isList ? 200 : '100%'} 
        height={isList ? 140 : 200}
        animation="wave"
        sx={{ 
          backgroundColor: alpha(accentColor, 0.04),
          transform: 'none',
          borderRadius: isList ? '16px 0 0 16px' : '16px 16px 0 0'
        }}
      />
      
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          p: 2.5,
          pb: '16px !important',
          display: 'flex',
          flexDirection: 'column',
          width: isList ? 'calc(100% - 200px)' : '100%'
        }}
      >
        <Skeleton 
          animation="wave" 
          height={28} 
          width="85%" 
          sx={{ mb: 1.5, backgroundColor: alpha(accentColor, 0.04) }} 
        />
        
        <Skeleton 
          animation="wave" 
          height={16} 
          width="100%" 
          sx={{ mb: 0.5, backgroundColor: alpha(accentColor, 0.03) }} 
        />
        <Skeleton 
          animation="wave" 
          height={16} 
          width="90%" 
          sx={{ mb: 'auto', backgroundColor: alpha(accentColor, 0.03) }} 
        />
        
        <Skeleton 
          animation="wave" 
          height={1} 
          width="100%" 
          sx={{ my: 1.5, backgroundColor: alpha(accentColor, 0.02) }} 
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton 
            animation="wave" 
            height={20} 
            width="30%" 
            sx={{ backgroundColor: alpha(accentColor, 0.04) }} 
          />
          <Skeleton 
            animation="wave" 
            height={20} 
            width="40%" 
            sx={{ backgroundColor: alpha(accentColor, 0.04) }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Función mejorada para extraer URL de imagen
const getImageUrl = (featuredImage) => {
  if (!featuredImage) return 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
  
  // Si es string JSON, intentar parsearlo
  if (typeof featuredImage === 'string' && (featuredImage.startsWith('{') || featuredImage.startsWith('['))) {
    try {
      const parsedImage = JSON.parse(featuredImage);
      
      // Si es un objeto con URL directa
      if (parsedImage && parsedImage.url) {
        return parsedImage.url;
      }
      
      // Si es un array de attachments (formato Airtable)
      if (Array.isArray(parsedImage) && parsedImage.length > 0 && parsedImage[0].url) {
        return parsedImage[0].url;
      }
      
      return 'https://via.placeholder.com/800x600?text=Formato+incorrecto';
    } catch (e) {
      // Si falla el parse, tratar como URL directa
      return featuredImage;
    }
  }
  
  // Si es array directo (formato Airtable)
  if (Array.isArray(featuredImage) && featuredImage.length > 0) {
    if (featuredImage[0] && featuredImage[0].url) {
      return featuredImage[0].url;
    }
    if (typeof featuredImage[0] === 'string') {
      return featuredImage[0];
    }
  }
  
  // Si es objeto con URL (ya normalizado)
  if (typeof featuredImage === 'object' && featuredImage !== null && featuredImage.url) {
    return featuredImage.url;
  }
  
  // Si es string directo
  if (typeof featuredImage === 'string') {
    return featuredImage;
  }
  
  return 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
};

export default function PostCard({ post, viewMode = 'grid', onClick, isSelected = false }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [loadingStarted, setLoadingStarted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Colores primarios del tema
  const accentColor = '#6200ea';
  const textColor = '#1a1a1a';
  const cardBgColor = '#ffffff';

  const isList = viewMode === 'list';
  
  // Simulador de carga progresiva para mejor UX
  useEffect(() => {
    // Iniciar efecto de carga inmediatamente
    setLoadingStarted(true);
    
    // Simular tiempo de carga progresiva para el contenido
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 300 + Math.random() * 400); // Tiempos variados para efecto natural
    
    return () => clearTimeout(timer);
  }, []);
  
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
  const postViews = post.views || 0;
  
  // Procesar categorías con formato estandarizado
  const categoriesArray = useMemo(() => getCategoriesArray(post.categories), [post.categories]);
  
  // Gradiente animado para el hover
  const hoverGradient = `linear-gradient(130deg, ${accentColor}, transparent 70%)`;
  
  // Determinar la URL de la imagen usando nuestra función mejorada
  const imageUrl = useMemo(() => getImageUrl(post.featuredImage), [post.featuredImage]);
  
  // Manejar el clic con animación
  const handleCardClick = () => {
    setIsClicked(true);
    // Llamar al onClick prop después de un pequeño retraso para mostrar la animación
    if (onClick) {
      onClick(post);
    }
  };
  
  // Resetear el estado de clic después de la animación
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);
  
  // Si no hemos iniciado la carga, mostrar skeleton completo
  if (!loadingStarted) {
    return <PostCardSkeleton viewMode={viewMode} />;
  }
  
  // Cuando el contenido está cargado pero la imagen aún no, mostrar contenido con skeleton de imagen
  if (!contentLoaded || !imageLoaded) {
    return (
      <Fade in={true} timeout={500}>
        <Card 
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
          }}
        >
          <Box 
            sx={{ 
              position: 'relative', 
              height: isList ? 140 : 200, 
              width: isList ? 200 : '100%',
              flexShrink: 0,
              borderRadius: isList ? '16px 0 0 16px' : '16px 16px 0 0',
              overflow: 'hidden'
            }}
          >
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height="100%" 
              animation="wave"
              sx={{ 
                backgroundColor: alpha(accentColor, 0.04),
                transform: 'none'
              }}
            />
            
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              <Image
                src={imageUrl}
                alt={post.title || 'Imagen del artículo'}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                priority={viewMode === 'featured' || isSelected}
                loading={viewMode === 'featured' || isSelected ? 'eager' : 'lazy'}
                style={{ 
                  objectFit: 'cover',
                }}
                onLoad={() => setImageLoaded(true)}
              />
            </Box>
          </Box>
          
          {contentLoaded && (
            <CardContent 
              sx={{ 
                flexGrow: 1, 
                p: 2.5,
                pb: '16px !important',
                display: 'flex',
                flexDirection: 'column',
                opacity: contentLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease'
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
                  ml: post.author ? 0 : 'auto'
                }}>
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
          )}
        </Card>
      </Fade>
    );
  }
  
  // Contenido completamente cargado
  return (
    <Fade in={true} timeout={600}>
      <Card 
        sx={{ 
          height: '100%', 
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transform: isClicked ? 'scale(0.98)' : isSelected ? 'scale(0.97)' : 'scale(1)',
          overflow: 'visible',
          borderRadius: '16px',
          boxShadow: isSelected
            ? '0 10px 30px rgba(0,0,0,0.12), 0 5px 10px rgba(0,0,0,0.05)'
            : '0 4px 20px rgba(0,0,0,0.03)',
          border: isSelected
            ? `1px solid ${alpha(accentColor, 0.3)}`
            : '1px solid rgba(0,0,0,0.03)',
          backgroundColor: cardBgColor,
          '&::after': isSelected ? {
            content: '""',
            position: 'absolute',
            top: -5,
            left: -5,
            right: -5,
            bottom: -5,
            borderRadius: '20px',
            border: `2px solid ${alpha(accentColor, 0.15)}`,
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.4 },
              '50%': { opacity: 0.7 },
              '100%': { opacity: 0.4 }
            }
          } : {}
        }}
      >
        <Link 
          href={`/post/${post.slug}`} 
          passHref
          style={{
            textDecoration: 'none',
            display: 'block',
            height: '100%',
          }}
          onClick={(e) => {
            e.preventDefault(); // Prevenir la navegación predeterminada
            handleCardClick(); // Usar nuestro manejador personalizado
          }}
        >
          <CardActionArea 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: isList ? 'row' : 'column', 
              alignItems: 'stretch',
              borderRadius: '16px',
              overflow: 'hidden',
              zIndex: 1,
              transition: 'all 0.3s ease',
              // Efecto de pulso mejorado cuando está seleccionado
              background: isSelected ? 
                `linear-gradient(130deg, ${alpha(accentColor, 0.03)}, transparent 70%)` : 
                'transparent'
            }}
          >
            <Box 
              sx={{ 
                position: 'relative', 
                height: isList ? 140 : 200, 
                width: isList ? 200 : '100%',
                overflow: 'hidden',
                flexShrink: 0,
                borderRadius: isList ? '16px 0 0 16px' : '16px 16px 0 0',
                backgroundColor: alpha(accentColor, 0.05) // Fondo mientras carga
              }}
            >
              {!imageLoaded && !imageError && (
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
              
              {/* Contenedor de imagen con formato Airtable específico */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  display: imageError ? 'none' : 'block'
                }}
              >
                <Image
                  src={imageUrl}
                  alt={post.title || 'Imagen del artículo'}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                  priority={viewMode === 'featured' || isSelected}
                  loading={viewMode === 'featured' || isSelected ? 'eager' : 'lazy'}
                  style={{ 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    transform: hovering ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(true); // Para quitar el skeleton
                  }}
                />
              </Box>
              
              {/* Gradiente decorativo sobre la imagen */}
              {imageLoaded && !imageError && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)',
                    pointerEvents: 'none'
                  }}
                />
              )}
              
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
                  ml: post.author ? 0 : 'auto'
                }}>
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
        </Link>
      </Card>
    </Fade>
  );
} 