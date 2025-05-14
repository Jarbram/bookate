'use client';
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Skeleton,
  alpha
} from '@mui/material';
import PostCard from './PostCard';
import airtable from '../../lib/airtable';

export default function RelatedPosts({ currentPostId, categories = [], tags = [] }) {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        
        // Buscar posts por categorías o etiquetas
        let posts = [];
        
        if (categories.length > 0) {
          // Intentar obtener posts con la primera categoría
          const categoryPosts = await airtable.getPosts({
            limit: 6,
            category: categories[0]
          });
          
          posts = categoryPosts.filter(post => post.id !== currentPostId);
        }
        
        // Si no encontramos suficientes posts, agregar por tags
        if (posts.length < 3 && tags.length > 0) {
          const tagPosts = await airtable.getPosts({
            limit: 6,
            tag: tags[0]
          });
          
          // Filtrar duplicados y el post actual
          const newTagPosts = tagPosts.filter(post => 
            post.id !== currentPostId && 
            !posts.some(p => p.id === post.id)
          );
          
          posts = [...posts, ...newTagPosts].slice(0, 3);
        }
        
        // Si aún no tenemos suficientes posts, obtener los más recientes
        if (posts.length < 3) {
          const recentPosts = await airtable.getPosts({
            limit: 6
          });
          
          // Filtrar duplicados y el post actual
          const newRecentPosts = recentPosts.filter(post => 
            post.id !== currentPostId && 
            !posts.some(p => p.id === post.id)
          );
          
          posts = [...posts, ...newRecentPosts].slice(0, 3);
        }
        
        setRelatedPosts(posts);
        
      } catch (error) {
        console.error('Error al cargar posts relacionados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentPostId) {
      fetchRelatedPosts();
    }
  }, [currentPostId, categories, tags]);
  
  // Si no hay posts relacionados y no está cargando, no mostrar nada
  if (!loading && relatedPosts.length === 0) {
    return null;
  }
  
  return (
    <Grid container spacing={3}>
      {loading ? (
        // Esqueletos de carga
        Array.from(new Array(3)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
            <Box sx={{ height: '300px', borderRadius: '16px' }}>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="160px" 
                sx={{ borderRadius: '16px 16px 0 0' }} 
              />
              <Box sx={{ p: 2 }}>
                <Skeleton width="80%" height={32} />
                <Skeleton width="100%" height={20} />
                <Skeleton width="60%" height={20} />
              </Box>
            </Box>
          </Grid>
        ))
      ) : (
        // Posts relacionados
        relatedPosts.map(post => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <PostCard post={post} />
          </Grid>
        ))
      )}
    </Grid>
  );
} 