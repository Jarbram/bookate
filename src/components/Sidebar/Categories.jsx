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
    // Nueva paleta de colores armoniosa basada en los colores proporcionados
    const colors = [
      '#7182bb', // azul principal
      '#ded1e7', // lila claro
      '#8e9ac7', // azul medio
      '#c5b5d3', // lila medio
      '#5a6ba8', // azul oscuro
      '#bba4ce', // lila oscuro
      '#a3aed4', // azul lavanda
      '#d1c1df', // lila suave
      '#647ab3', // azul acero
      '#cec0e3'  // lila polvo
    ];
    
    return colors[category.id % colors.length];
  }, [category.id]);

  // Función auxiliar para manejar la transparencia
  const withOpacity = (color, opacity) => {
    return color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
  };

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
          borderRadius: '16px', // Aumentado para más suavidad
          cursor: 'pointer',
          backgroundColor: isSelected ? withOpacity(categoryColor, 0.12) : '#FFFFFF',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: isSelected ? categoryColor : withOpacity('#ded1e7', 0.3),
          boxShadow: isSelected 
            ? `0 2px 8px ${withOpacity(categoryColor, 0.2)}`
            : '0 1px 3px rgba(54, 49, 76, 0.05)',
          '&:hover': {
            backgroundColor: isSelected 
              ? withOpacity(categoryColor, 0.15)
              : withOpacity('#ded1e7', 0.1),
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
              boxShadow: `0 0 8px ${withOpacity(categoryColor, 0.3)}`,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: isSelected ? 600 : 500,
              color: '#36314c',
              fontSize: { xs: '0.875rem', md: '0.9rem' },
              letterSpacing: '0.02em',
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
            borderRadius: '10px',
            fontSize: { xs: '0.7rem', md: '0.75rem' },
            fontWeight: 600,
            color: isSelected ? '#36314c' : '#36314c99',
            backgroundColor: isSelected 
              ? withOpacity(categoryColor, 0.12)
              : withOpacity('#ded1e7', 0.2),
            border: '1px solid',
            borderColor: isSelected ? categoryColor : 'transparent',
            minWidth: '24px',
            textAlign: 'center',
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
    const normalizedCategory = category.name;
    
    if (selectedCategory?.name === category.name) {
      setSelectedCategory(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('category');
      params.delete('page');
      router.push(`?${params.toString()}`);
      return;
    }

    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', normalizedCategory);
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams, selectedCategory]);

  // Optimizar la sincronización con URL usando useMemo
  const syncCategoryWithURL = useMemo(() => {
    if (!categoryFilter && selectedCategory) {
      return null;
    }
    
    if (categoryFilter && (!selectedCategory || selectedCategory.name !== categoryFilter)) {
      return categories.find(cat => cat.name === categoryFilter) || null;
    }
    
    return selectedCategory;
  }, [categoryFilter, categories, selectedCategory]);

  useEffect(() => {
    setSelectedCategory(syncCategoryWithURL);
  }, [syncCategoryWithURL]);

  // Actualizar containerStyles
  const containerStyles = useMemo(() => ({
    width: '100%',
    height: {
      xs: '80px',
      md: displayMode === 'vertical' ? '300px' : '80px',
    },
    borderRadius: '16px',
    border: `1px solid ${alpha('#ded1e7', 0.3)}`,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 2px 6px rgba(54, 49, 76, 0.05)',
    overflow: 'hidden',
  }), [displayMode]);

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