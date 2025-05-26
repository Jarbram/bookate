'use client';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useMemo, useEffect } from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import { useCategories } from '@/hooks/useCategories';

const CategoryItem = ({ category, isSelected, onClick }) => {
  const theme = useTheme();
  
  const categoryColor = useMemo(() => {
    // Paleta de colores más sofisticada y armoniosa
    const colors = [
      '#FF6B6B', // coral
      '#4ECDC4', // turquesa
      '#45B7D1', // azul cielo
      '#96CEB4', // verde menta
      '#FFD93D', // amarillo dorado
      '#FF8066', // salmón
      '#6C5CE7', // púrpura
      '#A8E6CF', // verde agua
      '#FF9A8B', // melocotón
      '#B8F2E6'  // menta claro
    ];
    
    return colors[category.id % colors.length];
  }, [category.id]);

  return (
    <motion.div
      whileHover={{ x: 4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        onClick={() => onClick(category)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { xs: 1.2, md: 1.5 },
          mx: { xs: 0.5, md: 1 },
          my: 0.5,
          borderRadius: '12px',
          cursor: 'pointer',
          backgroundColor: isSelected ? `${categoryColor}14` : 'transparent',
          transition: 'all 0.2s ease',
          border: '1px solid',
          borderColor: isSelected ? `${categoryColor}30` : 'transparent',
          boxShadow: isSelected ? `0 0 10px ${categoryColor}14` : 'none',
          '&:hover': {
            backgroundColor: isSelected 
              ? `${categoryColor}1f`
              : `${categoryColor}0a`,
            transform: 'translateX(4px)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: { xs: 6, md: 8 },
              height: { xs: 6, md: 8 },
              borderRadius: '50%',
              backgroundColor: categoryColor,
              boxShadow: `0 0 8px ${categoryColor}40`,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: isSelected ? 600 : 500,
              color: isSelected ? categoryColor : 'text.primary',
              fontSize: { xs: '0.875rem', md: '0.9rem' },
              letterSpacing: '0.01em',
              transition: 'all 0.2s ease',
            }}
          >
            {category.name}
          </Typography>
        </Box>
        <Box
          sx={{
            px: { xs: 0.8, md: 1 },
            py: { xs: 0.3, md: 0.5 },
            borderRadius: '8px',
            fontSize: { xs: '0.7rem', md: '0.75rem' },
            fontWeight: 500,
            color: isSelected ? categoryColor : 'text.secondary',
            backgroundColor: isSelected 
              ? `${categoryColor}14`
              : theme.palette.action.hover,
            border: '1px solid',
            borderColor: isSelected ? `${categoryColor}30` : 'transparent',
            minWidth: '24px',
            textAlign: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          {category.count}
        </Box>
      </Box>
    </motion.div>
  );
};

export default function Categories({ displayMode = "vertical" }) {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  
  // Actualizar el estado inicial basado en la URL
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return categoryFilter ? { slug: categoryFilter } : null;
  });

  const { data: categories = [], isLoading } = useCategories();

  const handleCategoryClick = useCallback((category) => {
    // Si la categoría ya está seleccionada, la deseleccionamos
    if (selectedCategory?.slug === category.slug) {
      setSelectedCategory(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('category');
      params.delete('page'); // Resetear la página al cambiar de categoría
      router.push(`?${params.toString()}`);
      return;
    }

    // Seleccionar nueva categoría
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category.slug);
    params.delete('page'); // Resetear la página al cambiar de categoría
    router.push(`?${params.toString()}`);
  }, [router, searchParams, selectedCategory]);

  // Sincronizar el estado con los cambios en la URL
  useEffect(() => {
    if (!categoryFilter) {
      setSelectedCategory(null);
    } else if ((!selectedCategory || selectedCategory.slug !== categoryFilter) && categories.length > 0) {
      const category = categories.find(cat => cat.slug === categoryFilter);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [categoryFilter, categories, selectedCategory]);

  // Actualizar containerStyles
  const containerStyles = useMemo(() => ({
    width: '100%',
    height: {
      xs: '80px', // Aumentamos un poco la altura en móvil
      md: displayMode === 'vertical' ? '300px' : '80px',
    },
    borderRadius: '12px',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
  }), [theme, displayMode]);

  // Estilos para el scroll
  const scrollStyles = useMemo(() => ({
    height: '100%',
    display: {
      xs: 'flex', // Flex para scroll horizontal en móviles
      md: 'block', // Block normal para desktop
    },
    overflowY: {
      xs: 'hidden',
      md: displayMode === 'vertical' ? 'auto' : 'hidden',
    },
    overflowX: {
      xs: 'auto',
      md: displayMode === 'horizontal' ? 'auto' : 'hidden',
    },
    '::-webkit-scrollbar': {
      width: '4px',
      height: '4px',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      background: alpha(theme.palette.primary.main, 0.2),
      borderRadius: '4px',
      '&:hover': {
        background: alpha(theme.palette.primary.main, 0.3),
      },
    },
  }), [theme, displayMode]);

  if (isLoading) {
    return (
      <Box sx={containerStyles}>
        <Box sx={{ p: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              sx={{
                height: '40px',
                mb: 1,
                borderRadius: '8px',
                background: `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.1)} 50%, ${alpha(theme.palette.background.paper, 0.05)} 100%)`,
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6 },
                  '50%': { opacity: 0.8 },
                  '100%': { opacity: 0.6 }
                }
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Encabezado */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 2,
          px: 1
        }}
      >
        <CategoryIcon sx={{ color: theme.palette.primary.main }} />
        <Typography variant="subtitle1" fontWeight="600">
          Categorías
        </Typography>
      </Box>

      {/* Contenedor con scroll */}
      <Box sx={containerStyles}>
        <Box sx={scrollStyles}>
          <AnimatePresence>
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                isSelected={selectedCategory?.slug === category.slug}
                onClick={handleCategoryClick}
              />
            ))}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
} 