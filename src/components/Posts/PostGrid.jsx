'use client';
import { useState, useEffect, useCallback } from 'react';
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
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Escuchar cambios de categoría mediante eventos personalizados mejorados
  useEffect(() => {
    const handleCategoryChange = (event) => {
      console.log("Evento de cambio de categoría detectado:", event.detail.category);
      setIsUpdatingCategory(true);
      setIsTransitioning(true);
      
      // Forzar un estado de carga inmediato para mejor feedback
      setLoading(true);
      
      // Limpiar cualquier resultado anterior para evitar que se vean datos antiguos
      setFilteredPosts([]);
    };
    
    window.addEventListener('categoryChanged', handleCategoryChange);
    return () => {
      window.removeEventListener('categoryChanged', handleCategoryChange);
    };
  }, []);
  
  // Efecto actualizado para manejar cambios de categoría
  useEffect(() => {
    console.log('Filtro de categoría actualizado:', categoryFilter);
    
    // Cada vez que cambia el filtro, volver a página 1
    setPage(1);
    
    // Si hay un cambio definido en la categoría
    if (categoryFilter !== undefined) {
      setLoading(true);
      
      // Usar un temporizador para que la UI tenga tiempo de actualizarse
      setTimeout(() => {
        setIsUpdatingCategory(false);
      }, 50);
    }
  }, [categoryFilter]);

  // Usar nuestro nuevo hook para gestionar el caché
  const { 
    allPosts, 
    isLoading: isLoadingCache, 
    filterPostsByCategory,
    filterPostsBySearch,
    sortPosts
  } = usePostsCache();
  
  // Efecto para filtrar posts en memoria (sin peticiones API adicionales)
  useEffect(() => {
    // Si aún estamos cargando el caché, no hacer nada
    if (isLoadingCache) return;
    
    const applyFilters = () => {
      console.log('Aplicando filtros en memoria', {
        categoryFilter,
        searchQuery,
        sortOrder,
        filterMode
      });
      
      // Establecer visualmente el estado de carga
      setLoading(true);
      
      // Aplicar filtros de manera encadenada
      let result = [...allPosts];
      
      // 1. Filtrar por categoría
      if (categoryFilter) {
        console.log(`Filtrando por categoría '${categoryFilter}'`);
        result = filterPostsByCategory(categoryFilter, result);
      }
      
      // 2. Filtrar por búsqueda
      if (searchQuery) {
        console.log(`Filtrando por término de búsqueda '${searchQuery}'`);
        result = filterPostsBySearch(searchQuery, result);
      }
      
      // 3. Filtrar destacados si es necesario
      if (filterMode === 'top') {
        console.log('Filtrando solo posts destacados');
        result = result.filter(post => post.featured || post.hot);
      }
      
      // 4. Aplicar ordenamiento - asegurando que funcione correctamente
      console.log(`Aplicando ordenamiento: ${sortOrder}`);
      if (sortOrder === 'newest') {
        result.sort((a, b) => {
          const dateA = new Date(a.publishDate || a.date || 0);
          const dateB = new Date(b.publishDate || b.date || 0);
          return dateB - dateA;
        });
      } else if (sortOrder === 'oldest') {
        result.sort((a, b) => {
          const dateA = new Date(a.publishDate || a.date || 0);
          const dateB = new Date(b.publishDate || b.date || 0);
          return dateA - dateB;
        });
      } else if (sortOrder === 'popular') {
        result.sort((a, b) => {
          const viewsA = parseInt(a.views || 0, 10);
          const viewsB = parseInt(b.views || 0, 10);
          return viewsB - viewsA;
        });
      }
      
      // Actualizar total de posts para paginación
      setTotalPosts(result.length);
      console.log(`Total de posts después de filtros: ${result.length}`);
      
      // Guardar posts filtrados (todos)
      setFilteredPosts(result);
      
      // Aplicar paginación
      const startIndex = (page - 1) * postsPerPage;
      const paginatedResult = result.slice(startIndex, startIndex + postsPerPage);
      
      // Usar un pequeño retraso para mejor UX
      setTimeout(() => {
        setDisplayPosts(paginatedResult);
        setLoading(false);
        setIsUpdatingCategory(false);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 150);
    };
    
    applyFilters();
  }, [
    allPosts, 
    isLoadingCache,
    filterPostsByCategory,
    filterPostsBySearch,
    sortPosts,
    categoryFilter, 
    searchQuery, 
    sortOrder,
    filterMode,
    page,
    postsPerPage
  ]);

  // Efecto para leer la página de la URL al cargar
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber !== page) {
        setPage(pageNumber);
      }
    } else {
      // Si no hay parámetro de página, asegurarnos de que estamos en la página 1
      setPage(1);
    }
  }, [searchParams]);

  const handlePageChange = (event, value) => {
    setPage(value);
    
    // Scroll hacia arriba al cambiar de página
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleViewChange = (newView) => {
    setViewMode(newView);
  };
  
  const handleSortChange = (event) => {
    console.log('Cambiando ordenamiento a:', event.target.value);
    setSortOrder(event.target.value);
  };
  
  const handleFilterChange = (event, newValue) => {
    setFilterMode(newValue);
  };

  // Variantes para animaciones de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    }
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <Box 
      sx={{ 
        width: '100%',
        position: 'relative',
        minHeight: '50vh',
        opacity: isTransitioning ? 0.7 : 1,
        filter: isTransitioning ? 'blur(1px)' : 'none',
        transition: 'opacity 0.3s ease, filter 0.3s ease'
      }}
    >
      {/* Indicador visual mejorado para cambios de categoría */}
      {isUpdatingCategory && (
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
          animation: isUpdatingCategory ? 'pulse 1.5s infinite' : 'none',
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
              setIsUpdatingCategory(true);
              setIsTransitioning(true);
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
      
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '300px'
        }}>
          <CircularProgress 
            size={40}
            thickness={4}
            sx={{ 
              color: accentColor,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
        </Box>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="posts-container"
        >
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
                    timeout={500 + (index * 100)}
                  >
                    <Box>
                      <PostCard 
                        post={post} 
                        viewMode={viewMode}
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
        </motion.div>
      )}
      
      {/* Sin resultados para búsqueda */}
      {!loading && displayPosts.length === 0 && searchQuery && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 5,
          px: 2,
          bgcolor: 'rgba(0,0,0,0.02)',
          borderRadius: '8px',
          border: '1px dashed rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'rgba(0,0,0,0.7)', fontWeight: 'medium' }}>
            No se encontraron resultados para "{searchQuery}"
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Intenta con otras palabras o explora las categorías disponibles
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete('search');
              router.push(`?${params.toString()}`);
            }}
            sx={{ textTransform: 'none', borderRadius: '20px' }}
          >
            Limpiar búsqueda
          </Button>
        </Box>
      )}
      
      {/* Información de paginación más detallada */}
      {totalPosts > 0 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
          fontSize: '0.85rem',
          color: 'rgba(0,0,0,0.6)'
        }}>
          <Typography variant="body2">
            Mostrando {Math.min((page - 1) * postsPerPage + 1, totalPosts)} - {Math.min(page * postsPerPage, totalPosts)} de {totalPosts} artículos
          </Typography>
        </Box>
      )}

      {/* Paginación mejorada con mejor UI/UX */}
      {totalPosts > postsPerPage && (
        <Box sx={{ 
          mt: 4, 
          mb: 2, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          opacity: loading ? 0.5 : 1,
          transition: 'opacity 0.3s ease'
        }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
          />
          
          {/* Para colecciones grandes, añadir un selector de página rápido */}
          {totalPages > 10 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" sx={{ mr: 1, fontSize: '0.8rem' }}>
                Ir a página:
              </Typography>
              <FormControl 
                size="small" 
                variant="outlined"
                sx={{ 
                  width: 80,
                  '.MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    fontSize: '0.8rem',
                    '& fieldset': {
                      border: '1px solid rgba(0,0,0,0.1)'
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