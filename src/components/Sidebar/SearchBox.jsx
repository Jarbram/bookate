'use client';
import { useState, useEffect, useRef } from 'react';
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
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HistoryIcon from '@mui/icons-material/History';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBox({ darkMode = false }) {
  const [focused, setFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchInputRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Colores primarios del tema (manteniendo coherencia con el Header)
  const primaryLight = '#6200ea';
  const primaryDark = '#bb86fc';
  const bgColor = darkMode ? '#151515' : '#ffffff';
  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a';
  const accentColor = darkMode ? '#bb86fc' : '#6200ea';
  
  // Inicializar searchValue desde URL al cargar
  useEffect(() => {
    const searchQuery = searchParams.get('search') || '';
    setSearchValue(searchQuery);
    
    // Cargar historial desde localStorage
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory).slice(0, 3));
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
      setSearchHistory(history.slice(0, 3));
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
    updateSearchParams(searchValue);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };
  
  const handleTopicClick = (topic) => {
    setSearchValue(topic);
    updateSearchParams(topic);
  };
  
  return (
    <Box sx={{ position: 'relative', mb: 3, mt: 2 }}>
      <Typography
        variant="subtitle1"
        gutterBottom
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
          sx={{ 
            width: 24,
            height: 24,
            borderRadius: '6px',
            background: `linear-gradient(135deg, ${accentColor} 0%, ${alpha(accentColor, 0.8)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1
          }}
        >
          <SearchIcon sx={{ fontSize: '0.9rem', color: '#fff' }} />
        </Box>
        Buscar Contenido
      </Typography>
      
      <Paper
        component="form"
        elevation={0}
        onSubmit={handleSearch}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: '12px',
          border: `1px solid ${focused 
            ? darkMode ? 'rgba(187, 134, 252, 0.4)' : 'rgba(98, 0, 234, 0.2)'
            : darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          background: focused 
            ? darkMode ? 'rgba(25, 25, 25, 0.95)' : alpha(accentColor, 0.015)
            : darkMode ? 'rgba(30, 30, 30, 0.5)' : 'rgba(249, 249, 252, 0.8)',
          backdropFilter: 'blur(8px)',
          py: 0.3,
          pl: 1.2,
          pr: 0.5,
          position: 'relative',
          overflow: 'hidden',
          height: focused ? '42px' : '38px',
          '&::after': focused ? {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            width: '100%',
            background: `linear-gradient(to right, ${accentColor}, transparent)`,
            opacity: 0.7,
          } : {},
          '&:hover': {
            borderColor: darkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(98, 0, 234, 0.2)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
          }
        }}
      >
        <IconButton 
          sx={{ 
            p: '6px',
            color: isSearching ? accentColor : focused ? accentColor : darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'
          }}
          aria-label="buscar"
          type="submit"
          disabled={isSearching}
        >
          {isSearching ? (
            <CircularProgress size={18} thickness={5} sx={{ color: accentColor }} />
          ) : (
            <SearchIcon sx={{ fontSize: '1.1rem' }} />
          )}
        </IconButton>
        
        <InputBase
          sx={{ 
            ml: 0.5, 
            flex: 1,
            color: textColor,
            fontSize: '0.85rem',
            '& .MuiInputBase-input': {
              '&::placeholder': {
                color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
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
              sx={{ p: '6px', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)' }}
              aria-label="limpiar búsqueda"
              onClick={clearSearch}
            >
              <CloseIcon sx={{ fontSize: '0.9rem' }} />
            </IconButton>
          </Zoom>
        )}
      </Paper>
      
      {/* Trending Topics y Historial */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 1.2, mb: 1 }}>
              {/* Historial de búsqueda */}
              {searchHistory.length > 0 && (
                <Box 
                  sx={{ 
                    mb: 1.5, 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 0.8,
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 0.5,
                      px: 0.5,
                      opacity: 0.7,
                    }}
                  >
                    <HistoryIcon 
                      fontSize="small" 
                      sx={{ 
                        fontSize: '0.7rem', 
                        color: alpha(accentColor, 0.8)
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      color={darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'} 
                      sx={{ fontSize: '0.65rem', fontWeight: 500 }}
                    >
                      Búsquedas recientes:
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 0.5 }}>
                    {searchHistory.map((term) => (
                      <Chip
                        key={term}
                        label={term}
                        size="small"
                        deleteIcon={<CloseIcon sx={{ fontSize: '0.7rem', ml: -0.3 }} />}
                        onDelete={() => {
                          const newHistory = searchHistory.filter(item => item !== term);
                          setSearchHistory(newHistory);
                          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                        }}
                        onClick={() => handleTopicClick(term)}
                        sx={{ 
                          fontSize: '0.65rem',
                          height: '22px',
                          borderRadius: '11px',
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : alpha(accentColor, 0.03),
                          color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : alpha(accentColor, 0.1)}`,
                          '&:hover': {
                            backgroundColor: darkMode ? alpha(primaryDark, 0.2) : alpha(accentColor, 0.08),
                          },
                          transition: 'all 0.15s ease-in-out',
                          '& .MuiChip-deleteIcon': {
                            color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                            '&:hover': {
                              color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
} 