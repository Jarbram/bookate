'use client';
import { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Chip, 
  Paper,
  IconButton,
  alpha,
  Fade,
  Alert,
  Snackbar,
  LinearProgress
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header/Header';
import RelatedPosts from '@/components/Posts/RelatedPosts';

// Optimización: Mover constantes fuera del componente
const THEME = {
  accentColor: '#6200ea',
  textColor: '#1a1a1a',
  bgColor: '#ffffff'
};

// Componente de esqueleto simplificado
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

// Función auxiliar optimizada para formatear categorías
const formatCategories = (categories) => {
  if (!categories) return [];
  if (typeof categories === 'string') {
    try {
      return JSON.parse(categories);
    } catch {
      return [categories];
    }
  }
  return Array.isArray(categories) ? categories : [];
};

// Función optimizada para obtener posts
export async function getPostBySlug(slug) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        publishDate,
        lastModified,
        categories,
        tags,
        status,
        seoTitle,
        seoDescription,
        seoKeywords
      `)
      .eq('status', 'published')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    if (!post) return null;

    return {
      ...post,
      categories: Array.isArray(post.categories) ? post.categories : [],
      tags: Array.isArray(post.tags) ? post.tags : [],
      seoKeywords: Array.isArray(post.seoKeywords) ? post.seoKeywords : []
    };
  } catch (error) {
    return null;
  }
}

export default function PostDetail({ post }) {
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoización de valores derivados
  const categories = useMemo(() => (
    Array.isArray(post?.categories) ? post.categories : []
  ), [post?.categories]);

  const imageUrl = useMemo(() => {
    if (!post?.featuredImage) return null;
    return typeof post.featuredImage === 'string' && post.featuredImage.includes('supabase.co')
      ? post.featuredImage
      : typeof post.featuredImage === 'object' && post.featuredImage !== null
        ? post.featuredImage.url || post.featuredImage.thumbnails?.large?.url
        : null;
  }, [post?.featuredImage]);

  const formattedDate = useMemo(() => {
    if (!post?.publishDate) return '';
    return new Date(post.publishDate).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }, [post?.publishDate]);

  const formattedCategories = useMemo(() => 
    formatCategories(post?.categories), [post?.categories]);
    
  const formattedTags = useMemo(() => 
    formatCategories(post?.tags), [post?.tags]);

  // Manejadores de eventos optimizados
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbarMessage('Enlace copiado al portapapeles');
        setSnackbarOpen(true);
      }
    } catch (error) {
      // Manejar error silenciosamente
    }
  };

  if (!mounted) {
    return (
      <div className="MuiContainer-root" style={{ 
        padding: '2rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }} />
    );
  }

  const renderImage = imageUrl && !imageError;

  return (
    <>
      <Header darkMode={false} />
      <div className="MuiContainer-root" style={{ 
        padding: '2rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cabecera */}
          <Box sx={{ mb: 4 }}>
            <Link href="/" passHref>
              <IconButton 
                sx={{ 
                  mb: 2,
                  color: alpha(THEME.textColor, 0.7),
                  '&:hover': { backgroundColor: alpha(THEME.accentColor, 0.08) }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Link>

            {/* Categorías */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  component={Link}
                  href={`/?category=${encodeURIComponent(category)}`}
                  sx={{
                    backgroundColor: alpha(THEME.accentColor, 0.08),
                    color: THEME.accentColor,
                    '&:hover': {
                      backgroundColor: alpha(THEME.accentColor, 0.15)
                    }
                  }}
                />
              ))}
            </Box>

            {/* Título */}
            <Typography variant="h1" sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: THEME.textColor,
              mb: 2
            }}>
              {post.title}
            </Typography>

            {/* Meta información */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4 
            }}>
              <Typography 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  color: alpha(THEME.textColor, 0.7),
                  fontSize: '0.9rem'
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: '1rem', mr: 1 }} />
                {formattedDate}
              </Typography>

              <IconButton onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Imagen destacada mejorada */}
          {renderImage && (
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              height: { 
                xs: '200px',    // Móvil
                sm: '300px',    // Tablet
                md: '400px',    // Desktop pequeño
                lg: '500px'     // Desktop grande
              },
              mb: 4,
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: alpha(THEME.textColor, 0.05),
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <Image
                src={imageUrl}
                alt={post?.title || 'Imagen del post'}
                fill
                sizes="(max-width: 600px) 100vw, 
                       (max-width: 960px) 90vw,
                       1200px"
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                priority
                loading="eager"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />

              {/* Estado de carga */}
              {!imageLoaded && !imageError && (
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
                    backgroundColor: alpha(THEME.textColor, 0.05),
                  }}
                >
                  <LinearProgress 
                    sx={{ 
                      width: '200px',
                      backgroundColor: alpha(THEME.accentColor, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: THEME.accentColor
                      }
                    }} 
                  />
                </Box>
              )}
            </Box>
          )}

          {/* Contenido principal */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: '16px',
              backgroundColor: THEME.bgColor,
              border: '1px solid rgba(0,0,0,0.05)',
              mb: 5
            }}
          >
            {/* Extracto */}
            <Box sx={{
              p: 3,
              backgroundColor: alpha(THEME.accentColor, 0.05),
              borderLeft: `4px solid ${THEME.accentColor}`,
              borderRadius: '8px',
              mb: 5
            }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontStyle: 'italic',
                  color: alpha(THEME.textColor, 0.85)
                }}
              >
                {post.excerpt}
              </Typography>
            </Box>

            {/* Contenido del post */}
            <Box className="markdown-content" sx={{
              '& p': { 
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.8,
                color: alpha(THEME.textColor, 0.85),
                mb: 2
              }
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content || post.excerpt}
              </ReactMarkdown>
            </Box>
          </Paper>

          {/* Agregar RelatedPosts después del contenido principal */}
          <Box sx={{ mt: 4 }}>
            <Typography 
              variant="h2" 
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 3,
                color: THEME.textColor
              }}
            >
              Artículos relacionados
            </Typography>
            
            <RelatedPosts 
              currentPostId={post?.id?.toString()} // Asegurarse de que sea string
              categories={formattedCategories}
              tags={formattedTags}
              limit={3}
            />
          </Box>
        </motion.div>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
} 