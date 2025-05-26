'use client';
import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Fade, 
  Grow,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  alpha,
  Paper,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import Image from 'next/image';
import PostCard from './PostCard';
import Pagination from './Pagination';
import { 
  GridView as GridViewIcon, 
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import usePostsCache from '@/hooks/usePostsCache';
import React from 'react';
import { debounce } from 'lodash';
import DownloadIcon from '@mui/icons-material/Download';
import { supabase } from '@/lib/supabase';
import { useInView } from 'react-intersection-observer';
import useMediaQuery from '@mui/material/useMediaQuery';

// Memoizamos el componente PostCard para mejorar rendimiento
const MemoizedPostCard = memo(PostCard);

// Constantes
const POSTS_PER_PAGE = 12;
const THEME = {
  primary: {
    main: '#7182bb',
    light: '#ded1e7',
    dark: '#36314c',
  },
  text: {
    primary: '#36314c',
    secondary: '#666666',
  },
  background: {
    default: '#FFFFFF',
    paper: '#f8f9fa',
    accent: '#f3f4f6',
  },
  border: {
    light: 'rgba(54, 49, 76, 0.08)',
    medium: 'rgba(54, 49, 76, 0.12)',
  }
};

export default function PostGrid() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isUpdatingUI, setIsUpdatingUI] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  
  // Referencias para evitar renderizaciones innecesarias
  const lastFiltersRef = useRef({ category: '', search: '', sortOrder: 'newest' });
  
  // Obtener parámetros de la URL para aplicar filtros
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const router = useRouter();
  
  // Usar nuestro nuevo hook para gestionar el caché
  const { 
    allPosts, 
    isLoading: isLoadingCache, 
    filterPostsByCategory,
    filterPostsBySearch,
    sortPosts,
    loadMorePosts
  } = usePostsCache();
  
  // Memoizar variantes de animación
  const animations = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03 }
      }
    },
    item: {
      hidden: { y: 5, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 120, damping: 14 }
      }
    }
  }), []);

  // Configurar intersection observer para infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  // Optimización: Consolidar efectos relacionados con cambios de filtros
  const handleFiltersChange = useCallback(() => {
    if (!Array.isArray(allPosts)) return;
    
    setLoading(true);
    
    try {
      let filteredResults = [...allPosts];
      
      if (categoryFilter) {
        filteredResults = filteredResults.filter(post => {
          // Memoizar el parsing de categorías
          const postCategories = useMemo(() => {
            try {
              return typeof post.categories === 'string' 
                ? JSON.parse(post.categories) 
                : (Array.isArray(post.categories) ? post.categories : []);
            } catch {
              return [];
            }
          }, [post.categories]);

          return postCategories
            .map(cat => cat.toLowerCase().trim())
            .includes(categoryFilter.toLowerCase().trim());
        });
      }

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filteredResults = filteredResults.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          (post.content && post.content.toLowerCase().includes(searchLower))
        );
      }

      // Ordenar resultados
      filteredResults.sort((a, b) => {
        const dateA = new Date(a.publishDate || a.created_at);
        const dateB = new Date(b.publishDate || b.created_at);
        return sortOrder === 'oldest' 
          ? dateA - dateB 
          : dateB - dateA;
      });

      setPosts(filteredResults);
      setTotalPosts(filteredResults.length);
      
    } catch (error) {
      setPosts([]);
      setTotalPosts(0);
    } finally {
      setLoading(false);
      setIsUpdatingUI(false);
    }
  }, [allPosts, categoryFilter, searchQuery, sortOrder]);

  useEffect(() => {
    handleFiltersChange();
  }, [handleFiltersChange]);

  // Efecto adicional para manejar la paginación
  useEffect(() => {
    if (!posts.length) return;

    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    // Actualizar los posts paginados
    setPosts(paginatedPosts);
  }, [page, posts.length]);

  // Optimización: Obtener recuento de posts una sola vez por categoría
  useEffect(() => {
    const fetchPostCount = async () => {
      if (isLoadingCache || !categoryFilter) return;
      
      try {
        const count = posts.length;
        setTotalPosts(count);
        setLoading(false);
        setIsUpdatingUI(false);
      } catch (error) {
        console.error('Error al obtener el conteo de posts:', error);
        setLoading(false);
        setIsUpdatingUI(false);
      }
    };

    fetchPostCount();
  }, [categoryFilter, isLoadingCache, posts]);

  // Optimización: Consolidar la lógica de paginación
  useEffect(() => {
    if (isLoadingCache) return;
    
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    
    setLoading(false);
    setIsUpdatingUI(false);
  }, [page, posts, isLoadingCache, POSTS_PER_PAGE]);

  // Optimización: Sincronizar página de la URL
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const pageNumber = parseInt(pageParam, 10);
    
    if (pageParam && !isNaN(pageNumber) && pageNumber > 0 && pageNumber !== page) {
      setPage(pageNumber);
    } else if (!pageParam && page !== 1) {
      setPage(1);
    }
    
    const maxPage = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
    if (page > maxPage && maxPage > 0) {
      setPage(maxPage);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', maxPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, page, totalPosts, POSTS_PER_PAGE, router]);

  // Manejadores de eventos memoizados
  const handlers = useMemo(() => ({
    pageChange: (_, value) => {
      setIsUpdatingUI(true);
      setPage(value);
      
      const scrollOptions = {
        top: 0,
        behavior: 'smooth'
      };
      
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', value.toString());
      router.push(`?${params.toString()}`, { 
        scroll: false 
      }).then(() => {
        window.scrollTo(scrollOptions);
        setTimeout(() => setIsUpdatingUI(false), 300);
      });
    },
    sortChange: (event) => {
      setSortOrder(event.target.value);
    },
    postClick: (post) => {
      setSelectedPostId(post.id);
      setIsNavigating(true);
      setTimeout(() => {
        router.push(`/post/${post.slug}`);
      }, 300);
    },
    clearSearch: () => {
      const params = new URLSearchParams(searchParams);
      params.delete('search');
      params.delete('page');
      router.push(`?${params.toString()}`);
    }
  }), [searchParams, router]);

  // Calcular el número total de páginas
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));

  // Optimización: Mejoras en los efectos de animación
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03 // Aún más rápido para mejor UX
      }
    }
  }), []);
  
  const itemVariants = useMemo(() => ({
    hidden: { y: 5, opacity: 0 }, // Aún más sutil
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 14 }
    }
  }), []);

  // Optimizar la función fetchPosts para mejor manejo de errores y logging
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('status', 'published');

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      if (categoryFilter) {
        query = query.contains('categories', [categoryFilter]);
      }

      query = query.order('publishDate', { ascending: sortOrder === 'oldest' });
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setPosts(data || []);
      setTotalPosts(count || 0);

    } catch (error) {
      setPosts([]);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, categoryFilter, sortOrder]);

  // Añadir efecto para manejar cambios en la búsqueda
  useEffect(() => {
    // Resetear a la primera página cuando cambia la búsqueda
    if (searchQuery !== undefined) {
      setPage(1);
      fetchPosts();
    }
  }, [searchQuery, fetchPosts]);

  // Optimizar el renderizado del chip de categoría
  const renderCategoryChip = useMemo(() => {
    if (!categoryFilter) return null;

    return (
      <Chip
        label={categoryFilter}
        onDelete={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('category');
          params.delete('page'); // También eliminar la página al quitar el filtro
          router.push(`?${params.toString()}`, { scroll: false });
        }}
        size="small"
        color="primary"
        sx={{
          fontWeight: 500,
          '& .MuiChip-deleteIcon': {
            color: alpha(THEME.primary.main, 0.7),
            '&:hover': {
              color: THEME.primary.main,
            },
          },
        }}
      />
    );
  }, [categoryFilter, searchParams, router]);

  // Efectos
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Actualizar los estilos para mejor respuesta móvil
  const styles = useMemo(() => ({
    controlBar: {
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 2, sm: 0 },
      justifyContent: 'space-between',
      alignItems: { xs: 'stretch', sm: 'center' },
      mb: 4,
      px: { xs: 1.5, sm: 2 },
      py: { xs: 2, sm: 1.5 },
      borderRadius: 2,
      backgroundColor: THEME.background.paper,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: `1px solid ${THEME.border.light}`,
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: { 
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)'
      },
      gap: { xs: 2, sm: 3 },
      mb: 5,
      px: { xs: 0, sm: 0 },
    },
    paginationInfo: {
      textAlign: 'center',
      py: 2,
      px: 3,
      borderRadius: 2,
      backgroundColor: alpha(THEME.primary.main, 0.03),
      border: `1px solid ${alpha(THEME.primary.main, 0.08)}`,
      color: THEME.text.secondary,
      fontSize: '0.875rem',
      fontWeight: 500,
      mb: 3,
    },
    sortSelect: {
      '.MuiOutlinedInput-root': {
        borderRadius: 1.5,
        backgroundColor: THEME.background.default,
        '&:hover': {
          backgroundColor: alpha(THEME.primary.main, 0.02),
        },
        '& fieldset': {
          borderColor: THEME.border.light,
        }
      }
    },
  }), []);

  // Actualizar renderPosts para mostrar el estado de carga
  const renderPosts = () => {
    if (loading) {
      return (
        <Box sx={{ width: '100%', display: 'grid', gap: 2 }}>
          {[...Array(POSTS_PER_PAGE)].map((_, index) => (
            <Skeleton 
              key={`skeleton-${index}`}
              variant="rectangular"
              sx={{
                height: 320,
                borderRadius: 2,
                backgroundColor: alpha(THEME.primary.main, 0.04),
              }}
            />
          ))}
        </Box>
      );
    }

    if (!posts.length) {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          py: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}>
          <SearchIcon 
            sx={{ 
              fontSize: '3rem', 
              color: alpha(THEME.primary.main, 0.3)
            }} 
          />
          <Typography variant="h6" color="textSecondary">
            No se encontraron artículos
            {categoryFilter && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                en la categoría: &quot;{categoryFilter}&quot;
              </Typography>
            )}
            {searchQuery && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                para la búsqueda: &quot;{searchQuery}&quot;
              </Typography>
            )}
          </Typography>
        </Box>
      );
    }

    return (
      <Box 
        sx={styles.gridContainer}
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={itemVariants}
            layout
          >
            <MemoizedPostCard 
              post={post}
              onClick={() => handlers.postClick(post)}
              isSelected={selectedPostId === post.id}
            />
          </motion.div>
        ))}
      </Box>
    );
  };

  // Añadir efecto para cargar más posts
  useEffect(() => {
    const loadMore = async () => {
      if (!isMobile || !inView || loadingMore || !hasMore) return;
      
      setLoadingMore(true);
      try {
        const nextPage = page + 1;
        const startIndex = nextPage * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const nextPosts = allPosts.slice(startIndex, endIndex);
        
        if (nextPosts.length === 0) {
          setHasMore(false);
          return;
        }

        setPosts(prevPosts => [...prevPosts, ...nextPosts]);
        setPage(nextPage);
        
      } catch (error) {
        console.error('Error cargando más posts:', error);
      } finally {
        setLoadingMore(false);
      }
    };

    loadMore();
  }, [inView, isMobile, page, loadingMore, hasMore]);

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '1200px', 
      mx: 'auto', 
      px: { xs: 1, sm: 4 },
      py: { xs: 1, sm: 4 }
    }}>
      {/* Barra de control simplificada */}
      <Paper sx={styles.controlBar} elevation={0}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <GridViewIcon sx={{ color: THEME.primary.main }} />
          <Chip 
            label={`${totalPosts} artículos`}
            size="small"
            sx={{ 
              backgroundColor: alpha(THEME.primary.main, 0.08),
              color: THEME.primary.main,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {renderCategoryChip}
          <FormControl size="small" variant="outlined">
            <Select
              value={sortOrder}
              onChange={handlers.sortChange}
              sx={styles.sortSelect}
              startAdornment={<SortIcon sx={{ mr: 1, color: THEME.text.secondary }} />}
            >
              <MenuItem value="newest">Más recientes</MenuItem>
              <MenuItem value="oldest">Más antiguos</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Grid de posts */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPosts()}
        </motion.div>
      </AnimatePresence>

      {/* Información de paginación mejorada */}
      {totalPosts > 0 && (
        <Box sx={styles.paginationInfo}>
          Mostrando {Math.min((page - 1) * POSTS_PER_PAGE + 1, totalPosts)} - {Math.min(page * POSTS_PER_PAGE, totalPosts)} de {totalPosts} artículos
        </Box>
      )}

      {/* Paginación mejorada */}
      {!isMobile && totalPosts > POSTS_PER_PAGE && (
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mt: 4
          }}
        >
          <Pagination 
            count={totalPages}
            page={page}
            onChange={handlers.pageChange}
            variant="enhanced"
            darkMode={false}
          />
          
          <Typography
            variant="body2"
            sx={{
              color: THEME.text.secondary,
              fontSize: '0.875rem',
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: alpha(THEME.primary.main, 0.04),
              border: `1px solid ${alpha(THEME.primary.main, 0.08)}`,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Página {page} de {totalPages}
          </Typography>
        </Box>
      )}
    </Box>
  );
} 