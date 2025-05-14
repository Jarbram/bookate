import { useState, useEffect, useCallback, useMemo } from 'react';
import airtable from '../lib/airtable';
import { normalizeCategoryString } from './useCategories';

export default function usePostsCache() {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  
  // Cargar todos los posts una sola vez
  useEffect(() => {
    const loadAllPosts = async () => {
      // Si ya estamos cargando, no hacer nada
      if (isFetching) return;
      
      try {
        setIsFetching(true);
        
        // Verificar si hay datos en sessionStorage y si son recientes
        const cachedData = sessionStorage.getItem('allBlogPosts');
        if (cachedData) {
          const { posts, timestamp } = JSON.parse(cachedData);
          // Si el caché es menor a 5 minutos, usarlo
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            console.log('Usando caché de posts:', posts.length);
            setAllPosts(posts);
            setLastUpdated(timestamp);
            setIsLoading(false);
            setIsFetching(false);
            return;
          }
        }
        
        // Si no hay caché o está desactualizado, cargar todos los posts
        console.log('Cargando todos los posts desde la API');
        const posts = await airtable.getPosts({ limit: 100 });
        
        // Guardar en sessionStorage
        sessionStorage.setItem('allBlogPosts', JSON.stringify({
          posts,
          timestamp: Date.now()
        }));
        
        setAllPosts(posts);
        setLastUpdated(Date.now());
      } catch (error) {
        console.error('Error al cargar posts:', error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };
    
    loadAllPosts();
  }, []);
  
  // Método para filtrar los posts en el cliente
  const filterPostsByCategory = useCallback((categoryName, posts = allPosts) => {
    if (!categoryName) return posts;
    
    return posts.filter(post => {
      if (!post.categories) return false;
      
      // Normalizar categorías para comparación
      const categoriesArray = normalizeCategoryString(post.categories);
      return categoriesArray.includes(categoryName.toLowerCase());
    });
  }, [allPosts]);
  
  // Método para búsqueda en cliente
  const filterPostsBySearch = useCallback((searchQuery, posts = allPosts) => {
    if (!searchQuery) return posts;
    
    const searchTermLower = searchQuery.toLowerCase();
    return posts.filter(post => {
      const titleMatch = post.title && post.title.toLowerCase().includes(searchTermLower);
      const descriptionMatch = post.description && post.description.toLowerCase().includes(searchTermLower);
      const contentMatch = post.content && post.content.toLowerCase().includes(searchTermLower);
      return titleMatch || descriptionMatch || contentMatch;
    });
  }, [allPosts]);
  
  // Método para ordenar posts
  const sortPosts = useCallback((posts, sortOrder) => {
    if (!posts.length) return [];
    
    const sortedPosts = [...posts]; // Clonar para no mutar
    
    if (sortOrder === 'newest') {
      sortedPosts.sort((a, b) => new Date(b.publishDate || b.date || 0) - new Date(a.publishDate || a.date || 0));
    } else if (sortOrder === 'oldest') {
      sortedPosts.sort((a, b) => new Date(a.publishDate || a.date || 0) - new Date(b.publishDate || b.date || 0));
    } else if (sortOrder === 'popular') {
      sortedPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    return sortedPosts;
  }, []);
  
  return {
    allPosts,
    isLoading,
    lastUpdated,
    filterPostsByCategory,
    filterPostsBySearch,
    sortPosts
  };
} 