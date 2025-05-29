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
import RelatedPosts from '@/components/Posts/RelatedPosts';
import AdUnit from '@/components/Ads/AdUnit';

// Actualización del objeto THEME
const THEME = {
  primary: '#36314c',
  secondary: '#7182bb',
  accent: '#ded1e7',
  background: '#FFFFFF',
  textLight: '#36314c99',
  typography: {
    fontFamily: 'League Spartan, sans-serif',
  }
};

// Función auxiliar para formatear categorías
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

  // Valores memoizados
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

  // Manejador de compartir
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
    return <Box sx={{ p: { xs: 2, sm: 3 } }} />;
  }

  const renderImage = imageUrl && !imageError;

  return (
    <Box sx={{ overflowX: 'hidden', width: '100%' }}>
      <Container sx={{ 
        px: { xs: 2, sm: 3 },
        py: 4,
        maxWidth: '1200px !important'
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
                  color: THEME.textLight,
                  '&:hover': { 
                    backgroundColor: alpha(THEME.accent, 0.3),
                    color: THEME.primary
                  }
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
                    backgroundColor: alpha(THEME.accent, 0.3),
                    color: THEME.primary,
                    '&:hover': {
                      backgroundColor: alpha(THEME.secondary, 0.15),
                      color: THEME.secondary
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>

            {/* Título y meta información */}
            <Typography variant="h1" sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: THEME.primary,
              mb: 2,
              letterSpacing: '-0.02em',
              fontFamily: THEME.typography.fontFamily
            }}>
              {post.title}
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4 
            }}>
              <Typography sx={{ 
                display: 'flex',
                alignItems: 'center',
                color: THEME.textLight,
                fontSize: '0.9rem'
              }}>
                <CalendarTodayIcon sx={{ fontSize: '1rem', mr: 1 }} />
                {formattedDate}
              </Typography>

              <IconButton 
                onClick={handleShare}
                sx={{
                  color: THEME.secondary,
                  '&:hover': {
                    backgroundColor: alpha(THEME.accent, 0.3)
                  }
                }}
              >
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Imagen destacada */}
          {renderImage && (
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              height: { xs: '200px', sm: '300px', md: '400px', lg: '500px' },
              mb: 4,
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: alpha(THEME.primary, 0.05),
              boxShadow: `0 4px 12px ${alpha(THEME.primary, 0.1)}`
            }}>
              <Image
                src={imageUrl}
                alt={post?.title || 'Imagen del post'}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 960px) 90vw, 1200px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
                loading="eager"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />

              {!imageLoaded && !imageError && (
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(THEME.primary, 0.05),
                }}>
                  <LinearProgress sx={{ 
                    width: '200px',
                    backgroundColor: alpha(THEME.secondary, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: THEME.secondary
                    }
                  }} />
                </Box>
              )}
            </Box>
          )}

          {/* Anuncio */}
          <AdUnit slot="tu-ad-slot-id" style={{ my: 4, minHeight: '250px' }} />

          {/* Contenido principal */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 5 },
              borderRadius: '16px',
              backgroundColor: THEME.background,
              border: `1px solid ${alpha(THEME.primary, 0.1)}`,
              mb: 5,
              boxShadow: `0 4px 20px ${alpha(THEME.primary, 0.05)}`,
            }}
          >
            {/* Extracto */}
            <Box sx={{
              p: 3,
              backgroundColor: alpha(THEME.accent, 0.2),
              borderLeft: `4px solid ${THEME.secondary}`,
              borderRadius: '8px',
              mb: 5
            }}>
              <Typography variant="subtitle1" sx={{
                fontStyle: 'italic',
                color: THEME.primary,
                lineHeight: 1.6
              }}>
                {post.excerpt}
              </Typography>
            </Box>

            {/* Contenido */}
            <Box className="markdown-content" sx={{
              '& p': { 
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.8,
                color: THEME.primary,
                mb: 2,
                fontFamily: THEME.typography.fontFamily
              },
              '& a': {
                color: THEME.secondary,
                textDecoration: 'none',
                borderBottom: `1px solid ${alpha(THEME.secondary, 0.3)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderBottom: `1px solid ${THEME.secondary}`,
                  backgroundColor: alpha(THEME.accent, 0.2)
                }
              }
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content || post.excerpt}
              </ReactMarkdown>
            </Box>
          </Paper>

          {/* Posts relacionados */}
          <Box sx={{ mt: 4 }}>
            <RelatedPosts 
              currentPostId={post?.id?.toString()}
              categories={formattedCategories}
              tags={formattedTags}
              limit={3}
            />
          </Box>
        </motion.div>

        {/* Snackbar */}
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
      </Container>
    </Box>
  );
} 