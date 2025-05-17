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
} from '@mui/material';
import PostCard from './PostCard';
import Pagination from './Pagination';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import GridViewIcon from '@mui/icons-material/GridView';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { motion } from 'framer-motion';
import airtable from '../../lib/airtable'; // Importamos el cliente de airtable
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import usePostsCache from '../../hooks/usePostsCache';
import React from 'react';
import { debounce } from 'lodash';
import DownloadIcon from '@mui/icons-material/Download';

// Memoizamos el componente PostCard para mejorar rendimiento
const MemoizedPostCard = memo(PostCard);

export default function PostGrid() {
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [totalPosts, setTotalPosts] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isUpdatingUI, setIsUpdatingUI] = useState(false);
  
  // Referencias para evitar renderizaciones innecesarias
  const lastFiltersRef = useRef({ category: '', search: '', sortOrder: 'newest' });
  
  // Obtener parámetros de la URL para aplicar filtros
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const router = useRouter();
  
  // Colores para el tema (sin darkMode)
  const primaryColor = '#6200ea';
  const textColor = '#1a1a1a';
  const accentColor = '#6200ea';
  const secondaryBg = '#f8f9fa';
  
  // Usar nuestro nuevo hook para gestionar el caché
  const { 
    allPosts, 
    isLoading: isLoadingCache, 
    filterPostsByCategory,
    filterPostsBySearch,
    sortPosts,
    loadMorePosts
  } = usePostsCache();
  
  // Optimización: Consolidar efectos relacionados con cambios de filtros
  useEffect(() => {
    // Verificar si realmente hay cambios para evitar actualizaciones innecesarias
    const newFilters = { category: categoryFilter, search: searchQuery, sortOrder };
    const hasChanged = JSON.stringify(newFilters) !== JSON.stringify(lastFiltersRef.current);
    
    if (hasChanged) {
      console.log('Filtros actualizados:', newFilters);
      lastFiltersRef.current = newFilters;
      setPage(1);
      setIsUpdatingUI(true);
      setLoading(true);
    }
  }, [categoryFilter, searchQuery, sortOrder]);

  // Optimización: Memoizar datos filtrados evitando recreaciones innecesarias
  const memoizedFilteredData = useMemo(() => {
    if (isLoadingCache) return [];
    
    let result = [...allPosts];
    
    // Aplicar filtros solo cuando hay cambios reales
    if (categoryFilter) {
      result = filterPostsByCategory(categoryFilter, result);
    }
    
    if (searchQuery) {
      result = filterPostsBySearch(searchQuery, result);
    }
    
    return sortPosts(result, sortOrder);
  }, [
    allPosts, 
    isLoadingCache,
    categoryFilter, 
    searchQuery,
    sortOrder,
    filterPostsByCategory,
    filterPostsBySearch,
    sortPosts
  ]);

  // Optimización: Obtener recuento de posts una sola vez por categoría
  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        // Evitar consulta innecesaria si ya tenemos los posts filtrados
        if (!isLoadingCache && memoizedFilteredData.length > 0) {
          setTotalPosts(memoizedFilteredData.length);
          return;
        }
        
        const totalCountResponse = await airtable.getPostsCount({
          category: categoryFilter
        });
        
        if (totalCountResponse && typeof totalCountResponse.total === 'number') {
          setTotalPosts(totalCountResponse.total);
        } else {
          setTotalPosts(12);
        }
      } catch (error) {
        console.error('Error al obtener el conteo total de posts:', error);
        setTotalPosts(12); 
      } finally {
        // Asegurar que se desactiva el estado de carga incluso en caso de error
        setLoading(false);
        setIsUpdatingUI(false);
      }
    };

    fetchPostCount();
  }, [categoryFilter, isLoadingCache, memoizedFilteredData.length]);

  // Optimización: Consolidar la lógica de paginación en un solo useEffect
  useEffect(() => {
    if (isLoadingCache) return;
    
    // Actualizar ambos conjuntos de datos en una sola operación
    setFilteredPosts(memoizedFilteredData);
    
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    setDisplayPosts(memoizedFilteredData.slice(startIndex, endIndex));
    
    setLoading(false);
    setIsUpdatingUI(false);
  }, [memoizedFilteredData, page, postsPerPage, isLoadingCache]);

  // Optimización: Sincronizar página de la URL con estado local en un solo lugar
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber !== page) {
        setPage(pageNumber);
      }
    } else if (page !== 1) {
      setPage(1);
    }
    
    // Validación para evitar páginas inválidas
    const maxPage = Math.max(1, Math.ceil(totalPosts / postsPerPage));
    if (page > maxPage && maxPage > 0) {
      setPage(maxPage);
      
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', maxPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, page, totalPosts, postsPerPage, router]);

  // Optimización: Memoizar handlers para evitar recreaciones
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);
  
  const handleViewChange = useCallback((newView) => {
    setViewMode(newView);
    // Guardar preferencia en localStorage para persistencia
    localStorage.setItem('viewMode', newView);
  }, []);
  
  const handleSortChange = useCallback((event) => {
    setSortOrder(event.target.value);
    setIsUpdatingUI(true);
  }, []);
  
  const handlePostClick = useCallback((post) => {
    setSelectedPostId(post.id);
    setIsNavigating(true);
    
    // Usar una animación más sofisticada antes de navegar
    setTimeout(() => {
      router.push(`/post/${post.slug}`);
    }, 600); // Aumentamos ligeramente el tiempo para permitir la animación completa
  }, [router]);

  // Optimización: Cargar preferencia de viewMode desde localStorage al inicio
  useEffect(() => {
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Calcular el número total de páginas
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));

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

  return (
    <Box 
      sx={{ 
        width: '100%',
        position: 'relative',
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 1, sm: 3 },
        mt: { xs: 1, sm: 3 },
      }}
    >
      {/* Indicador visual mejorado para cambios de categoría */}
      {isUpdatingUI && (
        <Box 
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        >
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ color: accentColor }} 
          />
        </Box>
      )}
      
      <Box
        sx={{
          position: 'absolute',
          top: -40,
          right: -30,
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(accentColor, 0.1)} 0%, transparent 70%)`,
          zIndex: -1,
          display: { xs: 'none', md: 'block' }
        }}
      />
      
      {/* Mostrar chip de categoría con mejor feedback visual */}
      {categoryFilter && (
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          animation: isUpdatingUI ? 'pulse 1.5s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { opacity: 0.7 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0.7 }
          }
        }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Filtrando por:
          </Typography>
          <Chip 
            label={categoryFilter} 
            onDelete={() => {
              setIsUpdatingUI(true);
              setLoading(true);
              
              // Emitir evento de cambio de categoría manualmente
              const event = new CustomEvent('categoryChanged', { 
                detail: { 
                  category: '',
                  previousCategory: categoryFilter 
                } 
              });
              window.dispatchEvent(event);
              
              const params = new URLSearchParams(searchParams);
              params.delete('category');
              router.push(`?${params.toString()}`);
            }}
            size="small"
            color="primary"
            sx={{ 
              fontWeight: 'medium',
              animation: 'fadeIn 0.3s ease-out',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(5px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          />
        </Box>
      )}
      
      {/* Panel de control */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: '1px solid rgba(0,0,0,0.06)' 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              '&::before': {
                content: '""',
                display: 'block',
                width: '4px',
                height: '24px',
                borderRadius: '2px',
                backgroundColor: accentColor,
                marginRight: '10px'
              }
            }}
          >
            {searchQuery ? `Resultados para "${searchQuery}"` : 
              'Artículos recientes'}
          </Typography>
          <Chip 
            label={`${totalPosts} posts`} 
            size="small"
            sx={{
              ml: 2,
              fontSize: '0.7rem',
              height: '22px',
              bgcolor: 'rgba(0,0,0,0.03)',
              color: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Selector de vista */}
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <Button
              startIcon={<GridViewIcon />}
              size="small"
              onClick={() => handleViewChange('grid')}
              sx={{
                py: 1,
                px: 2,
                color: viewMode === 'grid' ? 'white' : textColor,
                backgroundColor: viewMode === 'grid' ? accentColor : 'transparent',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '0.8rem',
                '&:hover': {
                  backgroundColor: viewMode === 'grid' 
                    ? '#5000d3' 
                    : 'rgba(0,0,0,0.05)'
                }
              }}
            >
              Cuadrícula
            </Button>
            <Button
              startIcon={<ViewAgendaIcon />}
              size="small"
              onClick={() => handleViewChange('list')}
              sx={{
                py: 1,
                px: 2,
                color: viewMode === 'list' ? 'white' : textColor,
                backgroundColor: viewMode === 'list' ? accentColor : 'transparent',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '0.8rem',
                '&:hover': {
                  backgroundColor: viewMode === 'list' 
                    ? '#5000d3' 
                    : 'rgba(0,0,0,0.05)'
                }
              }}
            >
              Lista
            </Button>
          </Paper>
          
          {/* Selector de orden */}
          <FormControl 
            size="small" 
            variant="outlined"
            sx={{ 
              minWidth: 120,
              '.MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.05)',
                color: textColor,
                '& fieldset': {
                  border: 'none'
                }
              }
            }}
          >
            <InputLabel id="sort-label" sx={{ color: 'rgba(0,0,0,0.6)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterListIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                Ordenar
              </Box>
            </InputLabel>
            <Select
              labelId="sort-label"
              value={sortOrder}
              onChange={handleSortChange}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FilterListIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                  Ordenar
                </Box>
              }
              sx={{ fontSize: '0.8rem' }}
            >
              <MenuItem value="newest" sx={{ fontSize: '0.8rem' }}>Más recientes</MenuItem>
              <MenuItem value="oldest" sx={{ fontSize: '0.8rem' }}>Más antiguos</MenuItem>
              <MenuItem value="popular" sx={{ fontSize: '0.8rem' }}>Más populares</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {/* Indicador de navegación */}
      {isNavigating && (
        <Box 
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.92)',
            zIndex: 9999,
            backdropFilter: 'blur(8px)', // Aumentamos el desenfoque
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' // Transición más suave
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', mb: 3, height: 70, width: 70, mx: 'auto' }}>
                <CircularProgress 
                  size={70} 
                  thickness={3}
                  sx={{ 
                    color: alpha(accentColor, 0.3),
                    position: 'absolute',
                    left: 0,
                  }} 
                />
                <CircularProgress 
                  size={70} 
                  thickness={3}
                  sx={{ 
                    color: accentColor,
                    position: 'absolute',
                    left: 0,
                    animationDuration: '1s',
                  }} 
                />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: accentColor,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '3px',
                    borderRadius: '2px',
                    backgroundColor: alpha(accentColor, 0.3),
                  }
                }}
              >
                Cargando artículo
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 2,
                  color: alpha(textColor, 0.6),
                  animation: 'pulseText 1.5s infinite',
                  '@keyframes pulseText': {
                    '0%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.6 }
                  }
                }}
              >
                Preparando contenido...
              </Typography>
            </Box>
          </motion.div>
        </Box>
      )}
      
      {/* Optimización: Mostrar posts con mejores transiciones */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: viewMode === 'grid' 
          ? { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }
          : '1fr',
        gap: viewMode === 'grid' ? 3 : 2,
        mb: 5,
        justifyItems: { xs: 'center', sm: 'stretch' },
        width: '100%'
      }}>
        {loading ? (
          // Mostrar esqueletos de carga optimizados
          [...Array(postsPerPage)].map((_, index) => (
            <Box 
              key={`skeleton-${index}`} 
              sx={{
                height: viewMode === 'grid' ? 320 : 140,
                borderRadius: 2,
                bgcolor: 'rgba(0,0,0,0.04)',
                animation: 'pulse 1.5s infinite ease-in-out',
                width: { xs: '90%', sm: '100%' },
                maxWidth: { xs: '350px', sm: 'none' },
                '@keyframes pulse': {
                  '0%': { opacity: 0.6 },
                  '50%': { opacity: 0.8 },
                  '100%': { opacity: 0.6 }
                }
              }}
            />
          ))
        ) : displayPosts.length > 0 ? (
          displayPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Box 
                sx={{ 
                  transform: selectedPostId === post.id 
                    ? 'scale(0.95) translateY(-10px)' // Efecto mejorado cuando se selecciona
                    : 'scale(1) translateY(0)',
                  opacity: isNavigating ? 
                    (selectedPostId === post.id ? 1 : 0.3) : 1, // Mayor contraste
                  transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)', // Curva de animación mejorada
                  position: 'relative',
                  zIndex: selectedPostId === post.id ? 2 : 1,
                  width: { xs: '90%', sm: '100%' },
                  maxWidth: { xs: '350px', sm: 'none' },
                  // Añadir un efecto de elevación si es seleccionado
                  boxShadow: selectedPostId === post.id 
                    ? '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                    : 'none',
                }}
              >
                <MemoizedPostCard 
                  post={post} 
                  viewMode={viewMode}
                  onClick={() => handlePostClick(post)}
                  isSelected={selectedPostId === post.id}
                />
              </Box>
            </motion.div>
          ))
        ) : (
          <Box sx={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            py: 5 
          }}>
            <Typography variant="body1" color="textSecondary">
              No se encontraron artículos
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Información de paginación mejorada con mejor diseño */}
      {totalPosts > 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3,
          py: 1,
          px: 2,
          borderRadius: '8px',
          backgroundColor: alpha(accentColor, 0.03),
          border: `1px solid ${alpha(accentColor, 0.08)}`,
          color: alpha(textColor, 0.7),
          fontSize: '0.9rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Mostrando {Math.min((page - 1) * postsPerPage + 1, totalPosts)} - {Math.min(page * postsPerPage, totalPosts)} de {totalPosts} artículos
          </Typography>
        </Box>
      )}
      
      {/* Paginación mejorada con mejor diseño */}
      {totalPosts > postsPerPage && (
        <Box sx={{ 
          mt: 4, 
          mb: 2, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          opacity: loading ? 0.5 : 1,
          transition: 'opacity 0.3s ease'
        }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            darkMode={false} // Pasar explícitamente el modo
            // Añadir un prop para indicar que queremos el estilo mejorado
            variant="enhanced"
          />
          
          {/* Selector de página rápido con mejor diseño */}
          {totalPages > 8 && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 1,
              p: 1,
              borderRadius: '20px',
              backgroundColor: alpha(accentColor, 0.03),
              border: `1px solid ${alpha(accentColor, 0.08)}`,
            }}>
              <Typography variant="body2" sx={{ mr: 1, fontSize: '0.8rem', fontWeight: 500, color: alpha(textColor, 0.7) }}>
                Ir a página:
              </Typography>
              <FormControl 
                size="small" 
                variant="outlined"
                sx={{ 
                  width: 70,
                  '.MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    backgroundColor: '#fff',
                    fontSize: '0.8rem',
                    '& fieldset': {
                      border: `1px solid ${alpha(accentColor, 0.2)}`
                    },
                    '&:hover fieldset': {
                      borderColor: accentColor
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: accentColor,
                      borderWidth: '1px'
                    }
                  }
                }}
              >
                <Select
                  value={page}
                  onChange={(e) => handlePageChange(null, e.target.value)}
                  sx={{ py: 0.5 }}
                >
                  {[...Array(totalPages)].map((_, i) => (
                    <MenuItem key={i+1} value={i+1} sx={{ fontSize: '0.8rem' }}>
                      {i+1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
} 