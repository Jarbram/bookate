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
import airtable from '../../lib/airtable';
import { useRouter } from 'next/navigation';

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
      try {
        setLoading(true);
        setError(null);
        
        let allPosts = [];
        
        if (categories.length > 0) {
          const categoryPromises = categories.slice(0, 2).map(category => 
            airtable.getPosts({
              limit: limit + 1,
              category: category
            })
          );
          
          const categoryResults = await Promise.all(categoryPromises);
          
          for (const posts of categoryResults) {
            const filteredPosts = posts.filter(post => post.id !== currentPostId);
            allPosts = [...allPosts, ...filteredPosts];
          }
          
          allPosts = allPosts.filter((post, index, self) => 
            index === self.findIndex(p => p.id === post.id)
          );
        }
        
        if (allPosts.length < limit && tags.length > 0) {
          const tagPromises = tags.slice(0, 2).map(tag => 
            airtable.getPosts({
              limit: limit + 1,
              tag: tag
            })
          );
          
          const tagResults = await Promise.all(tagPromises);
          
          for (const posts of tagResults) {
            const filteredPosts = posts.filter(post => 
              post.id !== currentPostId && 
              !allPosts.some(p => p.id === post.id)
            );
            
            allPosts = [...allPosts, ...filteredPosts];
          }
          
          allPosts = allPosts.filter((post, index, self) => 
            index === self.findIndex(p => p.id === post.id)
          );
        }
        
        if (allPosts.length < limit) {
          const recentPosts = await airtable.getPosts({
            limit: limit + 5
          });
          
          const newRecentPosts = recentPosts.filter(post => 
            post.id !== currentPostId && 
            !allPosts.some(p => p.id === post.id)
          );
          
          allPosts = [...allPosts, ...newRecentPosts];
        }
        
        setRelatedPosts(allPosts.slice(0, limit));
        
      } catch (error) {
        console.error('Error al cargar posts relacionados:', error);
        setError('No pudimos cargar artículos relacionados. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentPostId) {
      fetchRelatedPosts();
    }
  }, [currentPostId, categories, tags, limit]);
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!loading && relatedPosts.length === 0) {
    return (
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ py: 2, textAlign: 'center', fontStyle: 'italic' }}
      >
        No encontramos artículos relacionados con este tema.
      </Typography>
    );
  }
  
  return (
    <Grid container spacing={3}>
      {loading ? (
        Array.from(new Array(limit)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
            <Box sx={{ 
              height: '320px', 
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.08)',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="160px" 
                sx={{ borderRadius: '16px 16px 0 0' }} 
              />
              <Box sx={{ p: 2 }}>
                <Skeleton width="80%" height={32} sx={{ mb: 1 }} />
                <Skeleton width="100%" height={20} sx={{ mb: 0.5 }} />
                <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Skeleton width={60} height={24} sx={{ borderRadius: '16px' }} />
                  <Skeleton width={70} height={24} sx={{ borderRadius: '16px' }} />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))
      ) : (
        relatedPosts.map(post => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => handlePostClick(post.id, post.slug)}
            >
              <PostCard 
                post={post} 
                isActionable={false} 
                customStyles={{ 
                  borderRadius: '16px',
                  height: '100%'
                }}
              />
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
} 