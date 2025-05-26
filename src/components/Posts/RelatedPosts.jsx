'use client';
import { useState, useEffect } from 'react';
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
  
  const handlePostClick = (postId, postSlug) => {
    if (postSlug) {
      router.push(`/post/${postSlug}`);
    } else {
      router.push(`/post/${postId}`);
    }
  };
  
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!currentPostId || currentPostId.startsWith('rec')) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let allPosts = [];
        
        // Buscar por categorías
        if (categories?.length > 0) {
          const { data: categoryPosts, error } = await supabase
            .from('posts')
            .select('*')
            .neq('id', currentPostId)
            .eq('status', 'published')
            .contains('categories', categories)
            .order('publishDate', { ascending: false })
            .limit(limit + 1);

          if (error) {
            console.error('Error en búsqueda por categorías:', error.message);
            throw error;
          }
          
          allPosts = categoryPosts || [];
        }
        
        // Si no hay suficientes posts, buscar por tags
        if (allPosts.length < limit && tags?.length > 0) {
          const { data: tagPosts, error } = await supabase
            .from('posts')
            .select('*')
            .neq('id', currentPostId)
            .eq('status', 'published')
            .contains('tags', tags.slice(0, 2))
            .order('publishDate', { ascending: false })
            .limit(limit + 1);

          if (error) {
            console.error('Error en búsqueda por tags:', error.message);
            throw error;
          }
          
          const newTagPosts = (tagPosts || []).filter(post => 
            !allPosts.some(p => p.id === post.id)
          );
          
          allPosts = [...allPosts, ...newTagPosts];
        }
        
        // Si aún no hay suficientes posts, obtener los más recientes
        if (allPosts.length < limit) {
          const { data: recentPosts, error } = await supabase
            .from('posts')
            .select('*')
            .neq('id', currentPostId)
            .eq('status', 'published')
            .order('publishDate', { ascending: false })
            .limit(limit + 5);

          if (error) {
            console.error('Error en búsqueda de posts recientes:', error.message);
            throw error;
          }
          
          const newRecentPosts = (recentPosts || []).filter(post => 
            !allPosts.some(p => p.id === post.id)
          );
          
          allPosts = [...allPosts, ...newRecentPosts];
        }
        
        setRelatedPosts(allPosts.slice(0, limit));
        
      } catch (error) {
        console.error('Error al cargar posts relacionados:', error.message || error);
        setError('No pudimos cargar artículos relacionados. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatedPosts();
  }, [currentPostId, categories, tags, limit]);
  
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
      p: 1,
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        width: '60px',
        height: '100%',
        top: 0,
        zIndex: 2,
        pointerEvents: 'none',
      },
      '&::before': {
        left: 0,
        background: `linear-gradient(to right, ${THEME.background}, transparent)`,
      },
      '&::after': {
        right: 0,
        background: `linear-gradient(to left, ${THEME.background}, transparent)`,
      }
    }}>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          pb: 2,
          px: 1,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: alpha(THEME.accent, 0.2),
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(THEME.secondary, 0.3),
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: alpha(THEME.secondary, 0.5),
            }
          },
          gap: 3
        }}
      >
        {loading ? (
          Array.from(new Array(limit)).map((_, index) => (
            <Box 
              key={`skeleton-${index}`}
              sx={{ 
                flexShrink: 0,
                width: { xs: '85%', sm: '330px' },
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
            <Box 
              key={post.id}
              sx={{
                flexShrink: 0,
                width: { xs: '85%', sm: '330px' },
                height: '380px',
              }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `0 8px 20px ${alpha(THEME.primary, 0.07)}`,
                  border: `1px solid ${alpha(THEME.primary, 0.05)}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 16px 25px ${alpha(THEME.primary, 0.12)}`,
                    borderColor: alpha(THEME.secondary, 0.2),
                    '& .post-gradient': {
                      opacity: 0.8,
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
                    transition: 'opacity 0.3s ease',
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
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
} 