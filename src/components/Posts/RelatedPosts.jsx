'use client';
import { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Skeleton,
  alpha,
  Alert,
  Card
} from '@mui/material';
import PostCard from './PostCard';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Constantes de diseño
const THEME = {
  primary: '#36314c',     // Color principal
  secondary: '#7182bb',   // Color secundario
  accent: '#ded1e7',      // Color de acento
  background: '#FFFFFF',  // Fondo
  typography: {
    fontFamily: 'League Spartan, sans-serif',
  }
};

export default function RelatedPosts({ currentPostId, categories = [], tags = [], limit = 3 }) {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Memoizamos las dependencias para mantenerlas constantes
  const memoizedDependencies = useMemo(() => ({
    currentPostId,
    limit
  }), [currentPostId, limit]);

  const handlePostClick = (postId, postSlug) => {
    if (postSlug) {
      router.push(`/post/${postSlug}`);
    } else {
      router.push(`/post/${postId}`);
    }
  };
  
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!memoizedDependencies.currentPostId || memoizedDependencies.currentPostId.startsWith('rec')) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Obtener posts aleatorios usando publishDate
        const { data: randomPosts, error } = await supabase
          .from('posts')
          .select('*')
          .neq('id', memoizedDependencies.currentPostId)
          .eq('status', 'published')
          .order('publishDate', { ascending: false }) // Usamos publishDate en lugar de created_at
          .limit(50)
          .then(result => {
            // Hacemos el shuffle manual de los resultados
            const shuffled = result.data ? 
              [...result.data].sort(() => Math.random() - 0.5) : 
              [];
            return {
              ...result,
              data: shuffled.slice(0, memoizedDependencies.limit)
            };
          });

        if (error) {
          console.error('Error al cargar posts aleatorios:', error.message);
          throw error;
        }
        
        setRelatedPosts(randomPosts || []);
        
      } catch (error) {
        console.error('Error al cargar posts:', error.message || error);
        setError('No pudimos cargar más artículos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatedPosts();
  }, [memoizedDependencies]);
  
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mt: 2, 
          mb: 2,
          backgroundColor: alpha(THEME.accent, 0.2),
          color: THEME.primary,
          '& .MuiAlert-icon': {
            color: THEME.secondary
          }
        }}
      >
        {error}
      </Alert>
    );
  }
  
  if (!loading && relatedPosts.length === 0) {
    return (
      <Typography 
        variant="body1" 
        sx={{ 
          py: 2, 
          textAlign: 'center', 
          fontStyle: 'italic',
          color: alpha(THEME.primary, 0.7),
          fontFamily: THEME.typography.fontFamily
        }}
      >
        No encontramos artículos relacionados con este tema.
      </Typography>
    );
  }
  
  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      p: { xs: 1, md: 2 },
      mt: 4,
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3,
          fontFamily: THEME.typography.fontFamily,
          color: THEME.primary,
          textAlign: 'center',
          fontWeight: 600,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            background: `linear-gradient(90deg, ${THEME.secondary}, ${THEME.accent})`,
            borderRadius: '2px',
          }
        }}
      >
        Más artículos para ti
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          px: { xs: 1, md: 2 },
        }}
      >
        {loading ? (
          Array.from(new Array(limit)).map((_, index) => (
            <Box 
              key={`skeleton-${index}`}
              sx={{ 
                width: '100%',
                height: '380px', 
                borderRadius: '20px',
                border: `1px solid ${alpha(THEME.primary, 0.08)}`,
                overflow: 'hidden',
                boxShadow: `0 6px 20px ${alpha(THEME.primary, 0.05)}`,
                background: THEME.background,
                position: 'relative',
                transition: 'all 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: `linear-gradient(90deg, ${alpha(THEME.secondary, 0.6)}, ${alpha(THEME.accent, 0.6)})`,
                  borderRadius: '20px 20px 0 0',
                }
              }}
            >
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="180px"
                sx={{
                  backgroundColor: alpha(THEME.accent, 0.1)
                }}
              />
              <Box sx={{ p: 3 }}>
                <Skeleton 
                  width="80%" 
                  height={32} 
                  sx={{ 
                    mb: 1.5,
                    backgroundColor: alpha(THEME.accent, 0.2)
                  }} 
                />
                <Skeleton 
                  width="100%" 
                  height={20} 
                  sx={{ 
                    mb: 0.8,
                    backgroundColor: alpha(THEME.accent, 0.15)
                  }} 
                />
                <Skeleton 
                  width="90%" 
                  height={20} 
                  sx={{ 
                    mb: 0.8,
                    backgroundColor: alpha(THEME.accent, 0.15)
                  }} 
                />
                <Skeleton 
                  width="60%" 
                  height={20} 
                  sx={{ 
                    mb: 1.5,
                    backgroundColor: alpha(THEME.accent, 0.15)
                  }} 
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 1.5 }}>
                  <Skeleton 
                    width={70} 
                    height={26} 
                    sx={{ 
                      borderRadius: '20px',
                      backgroundColor: alpha(THEME.accent, 0.2)
                    }} 
                  />
                  <Skeleton 
                    width={90} 
                    height={26} 
                    sx={{ 
                      borderRadius: '20px',
                      backgroundColor: alpha(THEME.accent, 0.2)
                    }} 
                  />
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          relatedPosts.map(post => (
            <Card 
              key={post.id}
              sx={{ 
                height: '420px',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 8px 20px ${alpha(THEME.primary, 0.07)}`,
                border: `1px solid ${alpha(THEME.primary, 0.05)}`,
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 16px 25px ${alpha(THEME.primary, 0.12)}`,
                  borderColor: alpha(THEME.secondary, 0.2),
                  '& .post-gradient': {
                    opacity: 0.8,
                  },
                  '& .post-title': {
                    color: THEME.secondary,
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: `linear-gradient(90deg, ${THEME.secondary}, ${THEME.accent})`,
                  borderRadius: '20px 20px 0 0',
                  zIndex: 1,
                }
              }}
              onClick={() => handlePostClick(post.id, post.slug)}
            >
              <Box 
                className="post-gradient" 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  background: `linear-gradient(135deg, ${alpha(THEME.secondary, 0.1)} 0%, transparent 100%)`,
                  opacity: 0.2,
                  transition: 'all 0.3s ease',
                  zIndex: 0,
                }} 
              />
              <PostCard 
                post={post} 
                isActionable={false} 
                customStyles={{ 
                  borderRadius: '20px',
                  height: '100%',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
} 