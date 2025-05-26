import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import airtable from '../lib/airtable';
import { normalizeCategoryString } from './useCategories';

export default function usePostsCache() {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const fetchingRef = useRef(false); // Referencia para evitar múltiples fetchs
  
  // Implementar una estrategia de carga progresiva
  const loadPosts = useCallback(async (forceRefresh = false) => {
    // Verificar si ya estamos cargando usando ref para evitar condiciones de carrera
    if (isFetching || fetchingRef.current) return;
    
    // Marcar como cargando usando ref para mayor seguridad
    fetchingRef.current = true;
    setIsFetching(true);
    
    try {
      // Verificar si hay datos en sessionStorage y si son recientes
      const cachedData = sessionStorage.getItem('allBlogPosts');
      if (cachedData && !forceRefresh) {
        const { posts, timestamp } = JSON.parse(cachedData);
        // Si el caché es menor a 10 minutos, usarlo (ampliado de 5 a 10 minutos)
        if (Date.now() - timestamp < 10 * 60 * 1000) {
          setAllPosts(posts);
          setLastUpdated(timestamp);
          setIsLoading(false);
          setIsFetching(false);
          fetchingRef.current = false;
          return posts;
        }
      }
      
      // Implementar carga por lotes para grandes volúmenes
      let allLoadedPosts = [];
      let batchSize = 100;
      let offset = 0;
      let hasMore = true;
      
      // Limitar el número de lotes para evitar bucles infinitos
      let batchCount = 0;
      const MAX_BATCHES = 5;
      
      while (hasMore && batchCount < MAX_BATCHES) {
        batchCount++;
        
        try {
          const posts = await airtable.getPosts({ 
            limit: batchSize, 
            offset: offset
          });
          
          if (posts && posts.length > 0) {
            allLoadedPosts = [...allLoadedPosts, ...posts];
            offset += batchSize;
            
            // Si recibimos menos posts que el tamaño del lote, hemos terminado
            if (posts.length < batchSize) {
              hasMore = false;
            }
            
            // Si tenemos muchos posts, actualizamos el estado de forma progresiva
            if (allLoadedPosts.length > 200) {
              setAllPosts(prevPosts => {
                const combinedPosts = [...prevPosts, ...posts];
                // Eliminar duplicados por ID
                return Array.from(new Map(combinedPosts.map(post => [post.id, post])).values());
              });
            }
            
            // Limitar la carga masiva a un máximo razonable
            if (allLoadedPosts.length >= 500) {
              hasMore = false;
            }
          } else {
            hasMore = false;
          }
        } catch (err) {
          console.error(`Error en lote ${batchCount}:`, err);
          hasMore = false;
        }
      }
      
      // Guardar en sessionStorage con índices auxiliares para búsqueda rápida
      try {
        const postIndex = buildSearchIndex(allLoadedPosts);
        sessionStorage.setItem('allBlogPosts', JSON.stringify({
          posts: allLoadedPosts,
          timestamp: Date.now(),
          index: postIndex
        }));
      } catch (err) {
        // Error al guardar en sessionStorage, continuar
      }
      
      setAllPosts(allLoadedPosts);
      setLastUpdated(Date.now());
      return allLoadedPosts;
    } catch (error) {
      console.error('Error al cargar posts:', error);
      return [];
    } finally {
      setIsLoading(false);
      setIsFetching(false);
      fetchingRef.current = false;
    }
  }, []);
  
  // Construir índice para búsquedas eficientes
  const buildSearchIndex = (posts) => {
    const titleIndex = {};
    const categoryIndex = {};
    
    posts.forEach(post => {
      // Índice de título (palabras clave)
      if (post.title) {
        const words = post.title.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 2) { // Ignorar palabras muy cortas
            if (!titleIndex[word]) titleIndex[word] = [];
            titleIndex[word].push(post.id);
          }
        });
      }
      
      // Índice de categorías
      if (post.categories) {
        const cats = typeof post.categories === 'string' 
          ? post.categories.split(',').map(c => c.trim().toLowerCase())
          : Array.isArray(post.categories) 
            ? post.categories.map(c => typeof c === 'string' ? c.toLowerCase() : '')
            : [];
            
        cats.forEach(cat => {
          if (!categoryIndex[cat]) categoryIndex[cat] = [];
          categoryIndex[cat].push(post.id);
        });
      }
    });
    
    return { titleIndex, categoryIndex };
  };
  
  // Cargar posts iniciales solo una vez
  useEffect(() => {
    // Usamos una bandera para asegurarnos de cargar solo una vez
    let isMounted = true;
    
    if (isMounted && !lastUpdated && !isFetching) {
      loadPosts();
    }
    
    return () => {
      isMounted = false;
    };
  }, [loadPosts, lastUpdated, isFetching]);
  
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
    
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return posts.filter(post => {
      const searchableText = [
        post.title || '',
        post.excerpt || '',
        ...(Array.isArray(post.categories) ? post.categories : []),
        ...(Array.isArray(post.tags) ? post.tags : [])
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
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
  
  // Añadir método para cargar más posts según necesidad
  const loadMorePosts = useCallback(() => {
    return loadPosts(true); // Forzar recarga
  }, [loadPosts]);
  
  return {
    allPosts,
    isLoading,
    lastUpdated,
    filterPostsByCategory,
    filterPostsBySearch,
    sortPosts,
    loadMorePosts // Exportar nueva función
  };
} 