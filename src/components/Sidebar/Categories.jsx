'use client';
import { useRef, useMemo, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton,
  Chip,
  Stack,
  alpha,
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';
import useCategories from '../../hooks/useCategories';
import { useRouter } from 'next/navigation';

export default function Categories({ displayMode = "vertical", onCategoryChange }) {
  const horizontalScrollRef = useRef(null);
  const selectedCategoryRef = useRef(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const router = useRouter();
  
  // Usar nuestro hook personalizado
  const { 
    categories, 
    orderedCategories, 
    loading, 
    error, 
    currentCategory,
    handleCategoryClick,
    isCategorySelected
  } = useCategories({ onCategoryChange });
  
  // Colores y estilos
  const accentColor = '#6200ea';
  const gradients = useMemo(() => ({
    primary: 'linear-gradient(135deg, #6200ea 0%, #9d4edd 100%)',
    selected: 'linear-gradient(135deg, #6200ea 0%, #bb86fc 100%)',
    hover: 'linear-gradient(135deg, #3700b3 0%, #6200ea 100%)',
    light: 'linear-gradient(135deg, rgba(98, 0, 234, 0.05) 0%, rgba(187, 134, 252, 0.05) 100%)',
    card: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    glow: 'radial-gradient(circle at 50% 50%, rgba(98, 0, 234, 0.15), transparent 70%)'
  }), []);
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Cuando cambia la categoría actual, mover el scroll
  useEffect(() => {
    if (selectedCategoryRef.current && horizontalScrollRef.current && displayMode === "horizontal") {
      const container = horizontalScrollRef.current;
      const element = selectedCategoryRef.current;
      
      // Calcular posición para centrar el elemento
      const scrollLeft = element.offsetLeft - container.offsetWidth / 2 + element.offsetWidth / 2;
      
      // Animar el scroll
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
    
    // Scroll hacia arriba en móviles cuando cambia la categoría
    if (isMobile && currentCategory) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentCategory, displayMode, categories, isMobile]);
  
  // Optimización: Cargar un esqueleto más simple
  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Categorías
        </Typography>
        <Box sx={{ 
          height: displayMode === "horizontal" ? 40 : 200,
          background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'pulse 1.5s infinite',
          borderRadius: 2,
          '@keyframes pulse': {
            '0%': { backgroundPosition: '0% 0%' },
            '100%': { backgroundPosition: '-200% 0%' }
          }
        }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ mb: 4, p: 2, borderRadius: 2, bgcolor: alpha(accentColor, 0.1) }}>
        <Typography variant="subtitle2" sx={{ color: accentColor }}>
          No se pudieron cargar las categorías
        </Typography>
      </Box>
    );
  }
  
  if (categories.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Categorías
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No hay categorías disponibles
        </Typography>
      </Box>
    );
  }

  if (displayMode === "horizontal") {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{ 
          mb: 2,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: '30px',
            background: 'linear-gradient(to right, transparent, #fff)',
            pointerEvents: 'none',
            zIndex: 2
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '10px',
            background: 'linear-gradient(to left, transparent, #fff)',
            pointerEvents: 'none',
            zIndex: 2
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 0.5,
          py: 0.8,
          px: 1.5,
          borderRadius: '10px 10px 0 0',
          background: gradients.light,
          borderTop: `2px solid ${accentColor}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LabelIcon sx={{ color: accentColor, mr: 0.8, fontSize: '0.85rem' }} />
            <Typography 
              variant="body2" 
              component="h3" 
              sx={{ 
                fontWeight: 'bold',
                color: alpha(accentColor, 0.9),
                fontSize: '0.85rem'
              }}
            >
              Filtrar por categoría
            </Typography>
          </Box>
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: alpha(accentColor, 0.6),
              fontSize: '0.7rem'
            }}
          >
            {categories.length} categorías
          </Typography>
        </Box>
        
        <Stack 
          ref={horizontalScrollRef}
          direction="row" 
          spacing={1} 
          sx={{ 
            flexWrap: 'nowrap', 
            pb: 1.2,
            pt: 1,
            px: 1.5,
            overflowX: 'auto',
            minWidth: '100%',
            scrollBehavior: 'smooth',
            scrollPaddingLeft: '8px',
            borderRadius: '0 0 10px 10px',
            background: alpha(accentColor, 0.02),
            borderTop: `1px solid ${alpha(accentColor, 0.1)}`,
            '&::-webkit-scrollbar': {
              height: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(accentColor, 0.2),
              borderRadius: '4px',
            },
            '& > *': { flexShrink: 0 }
          }}
        >
          <Chip
            ref={!currentCategory ? selectedCategoryRef : null}
            label={
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontWeight: !currentCategory ? 'bold' : 'medium',
                fontSize: '0.75rem'
              }}>
                <span>Todas</span>
              </Box>
            }
            clickable
            onClick={() => handleCategoryClick('')}
            component={motion.div}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            sx={{ 
              borderRadius: '16px',
              py: 0.5,
              height: 'auto',
              minWidth: '60px',
              background: !currentCategory ? gradients.selected : 'white',
              color: !currentCategory ? 'white' : 'rgba(0,0,0,0.7)',
              boxShadow: !currentCategory ? '0 2px 6px rgba(98, 0, 234, 0.25)' : '0 1px 2px rgba(0,0,0,0.08)',
              border: !currentCategory ? 'none' : `1px solid ${alpha(accentColor, 0.1)}`,
              transition: 'all 0.2s ease-out',
              '&:hover': {
                background: !currentCategory ? gradients.hover : alpha(accentColor, 0.08)
              }
            }}
          />
          
          {orderedCategories.map((category) => {
            const isSelected = isCategorySelected(category);
            return (
              <Chip
                key={category.name}
                ref={isSelected ? selectedCategoryRef : null}
                data-category={category.name}
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    fontWeight: isSelected ? 'bold' : 'medium',
                    fontSize: '0.75rem'
                  }}>
                    <span>{category.name}</span>
                    <Box 
                      component="span" 
                      sx={{ 
                        fontSize: '0.65rem', 
                        opacity: 0.8,
                        mt: 0.1 
                      }}
                    >
                      {category.count}
                    </Box>
                  </Box>
                }
                clickable
                onClick={() => handleCategoryClick(category.name)}
                component={motion.div}
                initial={isSelected ? { scale: 1.02 } : { scale: 1 }}
                animate={isSelected ? { scale: 1.02 } : { scale: 1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                sx={{ 
                  borderRadius: '16px',
                  py: 0.5,
                  height: 'auto',
                  minWidth: '70px',
                  background: isSelected ? gradients.selected : 'white',
                  color: isSelected ? 'white' : 'rgba(0,0,0,0.7)',
                  boxShadow: isSelected ? '0 2px 6px rgba(98, 0, 234, 0.25)' : '0 1px 2px rgba(0,0,0,0.08)',
                  border: isSelected ? 'none' : `1px solid ${alpha(accentColor, 0.1)}`,
                  transition: 'all 0.2s ease-out',
                  '&:hover': {
                    background: isSelected ? gradients.hover : alpha(accentColor, 0.08)
                  }
                }}
              />
            );
          })}
        </Stack>
      </Box>
    );
  }

  // Vista vertical
  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      sx={{ 
        mb: 3,
        position: 'relative',
        maxHeight: '320px',
      }}
    >
      <Box sx={{ 
        mb: 1, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              mr: 1, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '6px',
              background: gradients.primary,
            }}
          >
            <CategoryIcon sx={{ color: 'white', fontSize: '0.9rem' }} />
          </Box>
          
          <Typography 
            variant="subtitle1" 
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '0.95rem',
              color: alpha(accentColor, 0.9)
            }}
          >
            Explorar Categorías
          </Typography>
        </Box>
        
        <Typography 
          variant="caption" 
          sx={{ 
            color: alpha(accentColor, 0.7),
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '10px',
            background: alpha(accentColor, 0.06),
            border: `1px solid ${alpha(accentColor, 0.1)}`
          }}
        >
          {categories.length}
        </Typography>
      </Box>
      
      <List 
        sx={{ 
          background: gradients.light,
          borderRadius: '10px',
          overflow: 'hidden',
          border: `1px solid ${alpha(accentColor, 0.1)}`,
          position: 'relative',
          maxHeight: '260px', 
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(accentColor, 0.2),
            borderRadius: '4px',
          }
        }}
      >
        <ListItem
          disablePadding
          sx={{ 
            py: 0.2, 
            borderBottom: `1px solid ${alpha(accentColor, 0.1)}`,
            background: !currentCategory ? alpha(accentColor, 0.05) : 'transparent'
          }}
        >
          <ListItemButton
            selected={!currentCategory}
            onClick={() => handleCategoryClick('')}
            sx={{
              py: 0.8,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              borderRadius: '6px',
              '&::before': !currentCategory ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                width: '4px',
                height: '100%',
                background: gradients.primary,
                borderRadius: '2px'
              } : {},
              '&.Mui-selected': {
                color: accentColor,
                fontWeight: 'bold',
                background: alpha(accentColor, 0.05),
                '&:hover': {
                  background: alpha(accentColor, 0.1),
                }
              }
            }}
          >
            <ListItemText 
              primary={
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  fontSize: '0.85rem'
                }}>
                  <Typography 
                    component="span" 
                    sx={{ 
                      fontWeight: !currentCategory ? 'bold' : 'normal',
                      color: !currentCategory ? accentColor : 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    Todas
                  </Typography>
                  <Badge 
                    badgeContent={orderedCategories.reduce((acc, cat) => acc + cat.count, 0)} 
                    color="primary" 
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        background: !currentCategory ? gradients.primary : alpha(accentColor, 0.2),
                        fontSize: '0.7rem'
                      } 
                    }}
                  />
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
        
        {orderedCategories.map((category, index) => {
          const isSelected = isCategorySelected(category);
          return (
            <ListItem
              key={category.name}
              disablePadding
              sx={{ 
                py: 0.2, 
                borderBottom: index < orderedCategories.length - 1 ? `1px solid ${alpha(accentColor, 0.1)}` : 'none',
                background: isSelected ? alpha(accentColor, 0.05) : 'transparent',
                transition: 'background 0.2s ease-out'
              }}
            >
              <ListItemButton
                selected={isSelected}
                onClick={() => handleCategoryClick(category.name)}
                sx={{
                  py: 0.8,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  borderRadius: '6px',
                  '&::before': isSelected ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '4px',
                    height: '100%',
                    background: gradients.primary,
                    borderRadius: '2px'
                  } : {},
                  '&.Mui-selected': {
                    color: accentColor,
                    fontWeight: 'bold',
                    background: alpha(accentColor, 0.05),
                    '&:hover': {
                      background: alpha(accentColor, 0.1),
                    }
                  }
                }}
              >
                <ListItemText 
                  primary={
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <Typography 
                        component="span" 
                        sx={{ 
                          fontWeight: isSelected ? 'bold' : 'normal',
                          color: isSelected ? accentColor : 'inherit',
                          fontSize: '0.85rem'
                        }}
                      >
                        {category.name}
                      </Typography>
                      <Badge 
                        badgeContent={category.count} 
                        color={isSelected ? "primary" : "default"} 
                        sx={{ 
                          '& .MuiBadge-badge': { 
                            background: isSelected ? gradients.primary : alpha(accentColor, 0.2),
                            fontSize: '0.7rem'
                          } 
                        }}
                      />
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
} 