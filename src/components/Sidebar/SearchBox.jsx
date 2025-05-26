'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box, 
  Typography,
  Fade,
  Zoom,
  Chip,
  CircularProgress,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HistoryIcon from '@mui/icons-material/History';
import ReplayIcon from '@mui/icons-material/Replay';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBox({ darkMode = false }) {
  const [focused, setFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showRecentFeedback, setShowRecentFeedback] = useState(false);
  const searchInputRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Colores primarios del tema (manteniendo coherencia con el Header)
  const primaryLight = '#6200ea';
  const primaryDark = '#bb86fc';
  const bgColor = darkMode ? '#151515' : '#ffffff';
  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a';
  const accentColor = darkMode ? '#bb86fc' : '#6200ea';
  
  // Definir gradientes memoizados para mejorar rendimiento
  const gradients = useMemo(() => ({
    primary: `linear-gradient(135deg, ${accentColor} 0%, ${alpha(accentColor, 0.8)} 100%)`,
    secondary: `linear-gradient(135deg, ${accentColor} 0%, ${alpha(accentColor, 0.6)} 100%)`,
    glow: `radial-gradient(circle at 50% 50%, ${alpha(accentColor, 0.4)}, transparent 70%)`,
    shine: `linear-gradient(90deg, transparent, ${alpha(accentColor, 0.2)}, transparent)`,
    glassmorphism: `linear-gradient(135deg, ${alpha(accentColor, 0.15)} 0%, ${alpha(accentColor, 0.05)} 100%)`
  }), [accentColor, darkMode]);
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.08
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      } 
    }
  };
  
  const mobileItemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 12
      } 
    }
  };
  
  // Inicializar searchValue desde URL al cargar
  useEffect(() => {
    const searchQuery = searchParams.get('search') || '';
    setSearchValue(searchQuery);
    
    // Cargar historial desde localStorage
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory).slice(0, 5));
      }
    } catch (e) {
      console.error('Error loading search history:', e);
    }
  }, [searchParams]);
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = () => {
    // Pequeño retraso para permitir clicks en elementos emergentes
    setTimeout(() => {
      if (!searchValue) {
        setFocused(false);
      }
    }, 200);
  };
  
  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchValue('');
    updateSearchParams('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const saveToHistory = (term) => {
    if (!term || term.trim() === '') return;
    
    try {
      // Obtener historial existente o crear uno nuevo
      let history = [];
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        history = JSON.parse(savedHistory);
      }
      
      // Eliminar duplicados y añadir el nuevo término al principio
      history = history.filter(item => item !== term);
      history.unshift(term);
      
      // Limitar a 5 elementos
      history = history.slice(0, 5);
      
      // Guardar en localStorage
      localStorage.setItem('searchHistory', JSON.stringify(history));
      
      // Actualizar estado
      setSearchHistory(history.slice(0, 5));
      
      // Mostrar feedback visual
      setShowRecentFeedback(true);
      setTimeout(() => setShowRecentFeedback(false), 1500);
    } catch (e) {
      console.error('Error saving search history:', e);
    }
  };
  
  const updateSearchParams = (searchTerm) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm && searchTerm.trim() !== '') {
      params.set('search', searchTerm);
      if (searchTerm.trim() !== searchParams.get('search')) {
        saveToHistory(searchTerm);
      }
    } else {
      params.delete('search');
    }
    
    // También reiniciar a la página 1 cuando se busca
    params.delete('page');
    
    router.push(`?${params.toString()}`);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    // Limpiar parámetros de paginación al realizar nueva búsqueda
    params.delete('page');
    
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }
    
    // Actualizar URL y guardar en historial
    router.push(`?${params.toString()}`);
    saveToHistory(searchValue.trim());
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };
  
  const handleTopicClick = (topic) => {
    setSearchValue(topic);
    updateSearchParams(topic);
  };
  
  const clearHistoryItem = (term, e) => {
    e.stopPropagation(); // Prevenir que el click se propague al chip
    const newHistory = searchHistory.filter(item => item !== term);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };
  
  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };
  
  // Divertido componente de chip personalizado para historial
  const HistoryChip = ({ label, onDelete, onClick }) => {
    // ID único para animación SVG
    const svgId = useMemo(() => `filter-${Math.random().toString(36).substring(7)}`, []);
    
    return (
      <Box
        component={motion.div}
        whileHover={isMobile ? 
          { scale: 1.05, y: -3, rotate: [0, 1, -1, 0], transition: { duration: 0.2 } } : 
          { scale: 1.03, y: -2 }
        }
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: '16px',
          py: 0.4,
          px: 1,
          height: '26px',
          minWidth: 'fit-content',
          backgroundColor: darkMode ? alpha('#fff', 0.08) : alpha(accentColor, 0.05),
          border: `1px solid ${darkMode ? alpha('#fff', 0.15) : alpha(accentColor, 0.15)}`,
          color: darkMode ? alpha('#fff', 0.9) : textColor,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          boxShadow: darkMode ? 
            `0 1px 3px ${alpha('#000', 0.2)}` : 
            `0 1px 3px ${alpha('#6200ea', 0.1)}`,
          backdropFilter: 'blur(4px)',
          '&:hover': {
            backgroundColor: darkMode ? alpha(primaryDark, 0.15) : alpha(accentColor, 0.08),
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: gradients.shine,
            opacity: 0.5,
            transform: 'translateX(-100%)',
            animation: 'shine 3s infinite',
            '@keyframes shine': {
              '100%': {
                transform: 'translateX(100%)',
              },
            },
          }
        }}
      >
        {isMobile && (
          <svg width="0" height="0">
            <filter id={svgId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </svg>
        )}
        
        <Box 
          component={motion.div} 
          animate={isMobile ? { rotate: [0, 2, 0, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 4 }}
          sx={{ 
            mr: 0.5, 
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <HistoryIcon sx={{ 
            fontSize: '0.75rem', 
            color: darkMode ? alpha('#fff', 0.7) : alpha(accentColor, 0.7),
            filter: isMobile ? `url(#${svgId})` : 'none'
          }} />
        </Box>
        
        <Typography 
          component={motion.span}
          sx={{ 
            fontSize: '0.7rem', 
            fontWeight: 500,
            filter: isMobile ? `url(#${svgId})` : 'none',
            mr: 0.5,
            maxWidth: isMobile ? '130px' : '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {label}
        </Typography>
        
        <Box
          component={motion.div}
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => onDelete(e)}
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05),
            '&:hover': {
              backgroundColor: darkMode ? alpha('#fff', 0.2) : alpha('#000', 0.1),
            }
          }}
        >
          <CloseIcon sx={{ fontSize: '0.6rem', color: darkMode ? alpha('#fff', 0.8) : alpha('#000', 0.7) }} />
        </Box>
      </Box>
    );
  };
  
  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{ position: 'relative', mb: 3, mt: 2 }}
    >
      <Typography
        variant="subtitle1"
        gutterBottom
        component={motion.h3}
        whileHover={{ x: 3 }}
        sx={{
          position: 'relative',
          fontWeight: 700,
          fontSize: '0.95rem',
          mb: 1.5,
          ml: 0.5,
          color: textColor,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box 
          component={motion.div}
          animate={isMobile ? { rotate: [0, 5, 0, -5, 0] } : {}}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 3 }}
          sx={{ 
            width: 28,
            height: 28,
            borderRadius: '8px',
            background: gradients.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1.2,
            boxShadow: `0 3px 6px ${alpha(accentColor, 0.3)}`
          }}
        >
          <SearchIcon sx={{ fontSize: '1rem', color: '#fff' }} />
        </Box>
        {isMobile ? "Buscar" : "Buscar Contenido"}
      </Typography>
      
      <Paper
        component={motion.form}
        onSubmit={handleSearch}
        animate={{ 
          boxShadow: focused ? [
            `0 4px 15px ${alpha(accentColor, 0.15)}`,
            `0 4px 20px ${alpha(accentColor, 0.2)}`,
            `0 4px 15px ${alpha(accentColor, 0.15)}`
          ] : `0 2px 6px ${alpha(accentColor, 0.1)}`
        }}
        transition={{ 
          repeat: focused ? Infinity : 0, 
          duration: 2
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '16px',
          border: `1px solid ${focused 
            ? darkMode ? alpha(primaryDark, 0.5) : alpha(primaryLight, 0.3)
            : darkMode ? alpha('#fff', 0.08) : alpha('#000', 0.06)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: focused 
            ? darkMode ? alpha('#1a1a1a', 0.95) : alpha('#fff', 0.98)
            : darkMode ? alpha('#1e1e1e', 0.9) : alpha('#f9f9fc', 0.9),
          backdropFilter: 'blur(10px)',
          py: focused ? 0.7 : 0.5,
          pl: 1.5,
          pr: 1,
          position: 'relative',
          overflow: 'hidden',
          height: focused ? '46px' : '42px',
          '&::after': focused ? {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '10%',
            height: '2px',
            width: '80%',
            background: gradients.primary,
            borderRadius: '1px',
            boxShadow: `0 0 8px ${accentColor}`,
          } : {},
          '&:hover': {
            borderColor: darkMode ? alpha(primaryDark, 0.4) : alpha(primaryLight, 0.25),
            transform: 'translateY(-1px)'
          }
        }}
      >
        <Box
          component={motion.div}
          animate={isSearching ? { 
            rotate: [0, 360],
            scale: [1, 1.1, 1] 
          } : { rotate: 0 }}
          transition={{ 
            duration: 1.5, 
            repeat: isSearching ? Infinity : 0,
            ease: "linear"
          }}
        >
          <IconButton 
            sx={{ 
              p: '8px',
              color: isSearching ? accentColor : focused ? accentColor : darkMode ? alpha('#fff', 0.5) : alpha('#000', 0.4)
            }}
            aria-label="buscar"
            type="submit"
            disabled={isSearching}
          >
            {isSearching ? (
              <CircularProgress 
                size={20} 
                thickness={5} 
                sx={{ 
                  color: accentColor,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }} 
              />
            ) : (
              <SearchIcon sx={{ fontSize: '1.1rem' }} />
            )}
          </IconButton>
        </Box>
        
        <InputBase
          sx={{ 
            ml: 0.5, 
            flex: 1,
            color: textColor,
            fontSize: '0.9rem',
            fontWeight: focused ? 500 : 400,
            '& .MuiInputBase-input': {
              '&::placeholder': {
                color: darkMode ? alpha('#fff', 0.4) : alpha('#000', 0.4),
                transition: 'opacity 0.2s ease',
                opacity: 0.8,
                fontSize: '0.85rem'
              },
              '&:focus::placeholder': {
                opacity: 0.5
              }
            }
          }}
          placeholder={focused ? "Buscar artículos, temas, categorías..." : "Buscar..."}
          inputProps={{ 'aria-label': 'buscar en el blog' }}
          value={searchValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputRef={searchInputRef}
        />
        
        {searchValue && (
          <Zoom in={!!searchValue}>
            <IconButton 
              component={motion.button}
              whileHover={{ rotate: [0, 90], scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{ 
                p: '6px', 
                color: darkMode ? alpha('#fff', 0.6) : alpha('#000', 0.4),
                background: darkMode ? alpha('#fff', 0.05) : alpha('#000', 0.03),
                '&:hover': {
                  background: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05),
                },
                borderRadius: '10px',
                mr: 0.3
              }}
              aria-label="limpiar búsqueda"
              onClick={clearSearch}
            >
              <CloseIcon sx={{ fontSize: '0.9rem' }} />
            </IconButton>
          </Zoom>
        )}
      </Paper>
      
      {/* Feedback visual para búsqueda guardada */}
      <AnimatePresence>
        {showRecentFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{
              position: 'absolute',
              right: '10px',
              top: '-5px',
              zIndex: 10
            }}
          >
            <Box 
              sx={{
                background: gradients.glassmorphism,
                backdropFilter: 'blur(8px)',
                padding: '4px 8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                border: `1px solid ${alpha(accentColor, 0.2)}`,
                boxShadow: `0 2px 8px ${alpha(accentColor, 0.2)}`
              }}
            >
              <Box 
                component={motion.div} 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ReplayIcon sx={{ fontSize: '0.8rem', color: accentColor }} />
              </Box>
              <Typography sx={{ fontSize: '0.65rem', color: darkMode ? alpha('#fff', 0.9) : textColor }}>
                Guardado en recientes
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trending Topics y Historial */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <Box 
              sx={{ 
                mt: 1.5, 
                mb: 1,
                background: darkMode ? alpha('#1a1a1a', 0.7) : alpha('#fff', 0.8),
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: `1px solid ${darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05)}`,
                padding: '14px 16px',
                boxShadow: `0 4px 20px ${alpha('#000', darkMode ? 0.3 : 0.06)}`
              }}
            >
              {/* Historial de búsqueda */}
              {searchHistory.length > 0 && (
                <Box 
                  component={motion.div}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  sx={{ 
                    mb: 1.5, 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1.2,
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.5
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 0.8,
                      }}
                    >
                      <Box 
                        component={motion.div}
                        animate={isMobile ? { 
                          rotate: [0, 360],
                          transition: { repeat: Infinity, duration: 4, ease: "linear" }
                        } : {}}
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '8px',
                          background: darkMode ? alpha('#fff', 0.1) : alpha(accentColor, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <HistoryIcon 
                          sx={{ 
                            fontSize: '0.85rem', 
                            color: darkMode ? alpha('#fff', 0.8) : accentColor
                          }} 
                        />
                      </Box>
                      <Typography 
                        variant="caption" 
                        color={darkMode ? alpha('#fff', 0.9) : alpha('#000', 0.8)} 
                        sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                      >
                        Búsquedas recientes
                      </Typography>
                    </Box>
                    
                    <Box 
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAllHistory}
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        color: darkMode ? alpha('#fff', 0.6) : alpha(accentColor, 0.8),
                        cursor: 'pointer',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        background: darkMode ? alpha('#fff', 0.05) : alpha(accentColor, 0.05),
                        '&:hover': {
                          background: darkMode ? alpha('#fff', 0.1) : alpha(accentColor, 0.1),
                          color: darkMode ? alpha('#fff', 0.8) : accentColor
                        }
                      }}
                    >
                      Limpiar todo
                    </Box>
                  </Box>
                  
                  <Box 
                    component={motion.div}
                    variants={containerVariants}
                    sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.8, 
                      px: 0.2,
                      mt: 0.5
                    }}
                  >
                    {searchHistory.map((term) => (
                      <motion.div
                        key={term}
                        variants={isMobile ? mobileItemVariants : itemVariants}
                      >
                        <HistoryChip
                          label={term}
                          onClick={() => handleTopicClick(term)}
                          onDelete={(e) => clearHistoryItem(term, e)}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              )}
              
              {searchHistory.length === 0 && (
                <Box 
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 0',
                    gap: 1
                  }}
                >
                  <Box 
                    component={motion.div}
                    animate={{ 
                      rotate: [0, 5, 0, -5, 0], 
                      scale: [1, 1.05, 1] 
                    }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: gradients.glassmorphism,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      boxShadow: `0 4px 10px ${alpha(accentColor, 0.2)}`
                    }}
                  >
                    <SearchIcon sx={{ fontSize: '1.2rem', color: accentColor }} />
                  </Box>
                  <Typography 
                    sx={{ 
                      fontSize: '0.75rem',
                      color: darkMode ? alpha('#fff', 0.7) : alpha('#000', 0.6),
                      textAlign: 'center',
                      maxWidth: '240px'
                    }}
                  >
                    Tus búsquedas recientes aparecerán aquí
                  </Typography>
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
} 