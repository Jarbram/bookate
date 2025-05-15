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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterMode, setFilterMode] = useState('all'); // 'all' o 'top'
  
  // Obtener parámetros de la URL para aplicar filtros
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  
  // Registrar cada cambio en los filtros para depuración
  useEffect(() => {
    console.log('Filtro de categoría actualizado:', categoryFilter);
    // Cada vez que cambia el filtro, volver a página 1
    setPage(1);
    
    // Forzar la recarga de posts cuando cambia la categoría
    setLoading(true);
  }, [categoryFilter]);

  useEffect(() => {
    console.log('Filtro de búsqueda actualizado:', searchQuery);
    // Cada vez que cambia la búsqueda, volver a página 1
    setPage(1);
  }, [searchQuery]);
  
  // Colores para el tema (sin darkMode)
  const primaryColor = '#6200ea';
  const textColor = '#1a1a1a';
  const accentColor = '#6200ea';
  const secondaryBg = '#f8f9fa';
  const router = useRouter();

  // Optimización: No necesitamos cargar todos los posts para contar
  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        // Usar directamente el endpoint de conteo
        const totalCountResponse = await airtable.getPostsCount({
          category: categoryFilter
        });
        
        if (totalCountResponse && typeof totalCountResponse.total === 'number') {
          setTotalPosts(totalCountResponse.total);
          console.log(`Total de posts disponibles: ${totalCountResponse.total}`);
        } else {
          // Si no obtenemos un total válido, volvemos a un valor predeterminado
          console.warn('No se pudo obtener el conteo exacto de posts');
          setTotalPosts(12); // Un valor razonable como fallback
        }
      } catch (error) {
        console.error('Error al obtener el conteo total de posts:', error);
        // En caso de error, establecer un valor predeterminado
        setTotalPosts(12); 
      }
    };

    fetchPostCount();
  }, [categoryFilter]); // Solo refrescar cuando cambia el filtro de categoría

  // Mejora de la gestión del estado de actualización de categorías
  const [isUpdatingUI, setIsUpdatingUI] = useState(false);
  
  // Usar nuestro nuevo hook para gestionar el caché
  const { 
    allPosts, 
    isLoading: isLoadingCache, 
    filterPostsByCategory,
    filterPostsBySearch,
    sortPosts,
    loadMorePosts
  } = usePostsCache();
  
  // OPTIMIZACIÓN 1: Memoizar datos filtrados
  const memoizedFilteredData = useMemo(() => {
    if (isLoadingCache) return [];
    
    console.log('Aplicando filtros en memoria (memoizado)');
    
    let result = [...allPosts];
    
    // Filtrado por categoría
    if (categoryFilter) {
      result = filterPostsByCategory(categoryFilter, result);
    }
    
    // Filtrado por búsqueda
    if (searchQuery) {
      result = filterPostsBySearch(searchQuery, result);
    }
    
    // Filtrado por destacados
    if (filterMode === 'top') {
      result = result.filter(post => post.featured || post.hot);
    }
    
    // Aplicar ordenamiento una sola vez
    return sortPosts(result, sortOrder);
  }, [
    allPosts, 
    isLoadingCache,
    categoryFilter, 
    searchQuery, 
    filterMode,
    sortOrder,
    filterPostsByCategory,
    filterPostsBySearch,
    sortPosts
  ]);

  // OPTIMIZACIÓN 2: Separar paginación
  const paginatedPosts = useMemo(() => {
    if (!filteredPosts || filteredPosts.length === 0) return [];
    
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    
    // Limitar estrictamente a postsPerPage (6)
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, page, postsPerPage]);

  // OPTIMIZACIÓN 3: Efecto simplificado para actualizar UI
  useEffect(() => {
    if (isLoadingCache) return;
    
    setLoading(true);
    
    // Usar requestAnimationFrame para operaciones visuales
    requestAnimationFrame(() => {
      // Actualizar la lista completa de posts filtrados
      setFilteredPosts(memoizedFilteredData);
      
      // Si estamos en modo paginación, usar solo los posts de la página actual
      if (!searchParams.get('infinite')) {
        // Asegurarse de que solo se muestren exactamente 6 posts
        setDisplayPosts(paginatedPosts);
      }
      
      setLoading(false);
      setIsUpdatingUI(false);
    });
  }, [memoizedFilteredData, paginatedPosts, isLoadingCache, searchParams, postsPerPage]);

  // OPTIMIZACIÓN: Mejorar la sincronización entre paginación y URL
  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    
    // Scroll hacia arriba al cambiar de página con animación suave
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Actualizar la URL con la nueva página
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Asegurar que los posts se filtren y paginen correctamente
  useEffect(() => {
    if (isLoadingCache) return;
    
    setLoading(true);
    
    // Usar requestAnimationFrame para operaciones visuales
    requestAnimationFrame(() => {
      // Actualizar la lista completa de posts filtrados
      setFilteredPosts(memoizedFilteredData);
      
      // Aplicar paginación
      const startIndex = (page - 1) * postsPerPage;
      const paginatedItems = memoizedFilteredData.slice(startIndex, startIndex + postsPerPage);
      setDisplayPosts(paginatedItems);
      
      setLoading(false);
      setIsUpdatingUI(false);
    });
  }, [memoizedFilteredData, page, postsPerPage, isLoadingCache]);

  // Actualizar la UI cuando cambian los filtros de paginación
  useEffect(() => {
    // Cuando la página cambia en la URL, actualizar el estado local
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber !== page) {
        setPage(pageNumber);
      }
    } else if (page !== 1) {
      // Si no hay parámetro de página, asegurarnos de que estamos en la página 1
      setPage(1);
    }
  }, [searchParams, page]);

  // OPTIMIZACIÓN: Asegurar que la paginación se actualice cuando cambia el total de posts
  useEffect(() => {
    // Calcular el número total de páginas
    const newTotalPages = Math.ceil(totalPosts / postsPerPage);
    
    // Si la página actual es mayor que el total de páginas, regresar a la última válida
    if (page > newTotalPages && newTotalPages > 0) {
      setPage(newTotalPages);
      
      // Actualizar URL con la página correcta
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newTotalPages.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [totalPosts, postsPerPage, page, searchParams, router]);

  // Funciones de manejo - memoizadas para evitar re-renders
  const handleViewChange = useCallback((newView) => {
    setViewMode(newView);
  }, []);
  
  const handleSortChange = useCallback((event) => {
    console.log('Cambiando ordenamiento a:', event.target.value);
    setSortOrder(event.target.value);
  }, []);
  
  const handleFilterChange = useCallback((event, newValue) => {
    setFilterMode(newValue);
  }, []);

  // OPTIMIZACIÓN 4: Animaciones solo cuando son necesarias
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // Reducido de 0.1
      }
    }
  }), []);
  
  const itemVariants = useMemo(() => ({
    hidden: { y: 10, opacity: 0 }, // Reducido de y: 20
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }), []);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Añadir nuevo estado para el post seleccionado
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Añadir función para manejar el clic en un post
  const handlePostClick = useCallback((post, event) => {
    event.preventDefault(); // Prevenir comportamiento predeterminado del enlace
    
    // Activar estado de selección
    setSelectedPostId(post.id);
    setIsNavigating(true);
    
    // Programar navegación con pequeño retraso para mostrar efecto
    setTimeout(() => {
      window.location.href = `/post/${post.slug}`;
    }, 350); // Retraso suficiente para mostrar el efecto visual
  }, []);

  return (
    <Box 
      sx={{ 
        width: '100%',
        position: 'relative',
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 3 }
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
      
      {/* Filtro de pestañas (Todos/Destacados) */}
      <Box sx={{ mb: 3, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Tabs 
          value={filterMode}
          onChange={handleFilterChange}
          variant="fullWidth"
          sx={{
            minHeight: '40px',
            '& .MuiTabs-indicator': {
              backgroundColor: accentColor,
              height: '3px',
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              minHeight: '40px',
              fontSize: { xs: '0.8rem', sm: '0.85rem' },
              fontWeight: 600,
              textTransform: 'none',
              color: 'rgba(0,0,0,0.6)',
              '&.Mui-selected': {
                color: accentColor,
                fontWeight: 700
              }
            }
          }}
        >
          <Tab 
            label="Todos los artículos" 
            value="all" 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span>Artículos destacados</span>
                <LocalFireDepartmentIcon sx={{ ml: 0.5, fontSize: '1rem', color: '#ff4d4d' }} />
              </Box>
            } 
            value="top" 
          />
        </Tabs>
      </Box>
      
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
              filterMode === 'top' ? 'Artículos destacados' : 'Artículos recientes'}
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
            backgroundColor: 'rgba(255,255,255,0.8)',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: accentColor,
                mb: 2
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: accentColor,
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.6 }
                }
              }}
            >
              Cargando artículo...
            </Typography>
          </Box>
        </Box>
      )}
      
      {/* Mostrar posts usando displayPosts en lugar de virtualizedPosts */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: viewMode === 'grid' 
          ? { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }
          : '1fr',
        gap: viewMode === 'grid' ? 3 : 2,
        mb: 5
      }}>
        {displayPosts.length > 0 ? (
          displayPosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              custom={index}
            >
              <Grow
                in={!loading}
                style={{ transformOrigin: '0 0 0' }}
                timeout={Math.min(300 + (index * 50), 800)} // Limitar tiempo máximo
              >
                <Box 
                  sx={{ 
                    transform: selectedPostId === post.id ? 'scale(0.97)' : 'scale(1)',
                    opacity: isNavigating ? 
                      (selectedPostId === post.id ? 1 : 0.5) : 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    zIndex: selectedPostId === post.id ? 2 : 1,
                  }}
                >
                  <MemoizedPostCard 
                    post={post} 
                    viewMode={viewMode}
                    onClick={(e) => handlePostClick(post, e)}
                    isSelected={selectedPostId === post.id}
                  />
                </Box>
              </Grow>
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