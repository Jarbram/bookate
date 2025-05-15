'use client';
import { Pagination as MUIPagination, PaginationItem, alpha } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

export default function Pagination({ count, page, onChange, darkMode = false, variant = 'default' }) {
  // Colores primarios del tema (manteniendo coherencia con el Header)
  const primaryLight = '#6200ea';
  const primaryDark = '#bb86fc';
  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a';
  const accentColor = darkMode ? '#bb86fc' : '#6200ea';
  
  // Estilos mejorados para variant="enhanced"
  const isEnhanced = variant === 'enhanced';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <MUIPagination
        count={count}
        page={page}
        onChange={onChange}
        size={isEnhanced ? "medium" : "medium"}
        siblingCount={1}
        boundaryCount={1}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
            sx={{
              margin: isEnhanced ? '0 3px' : '0 2px',
              color: item.selected ? 'white' : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              bgcolor: item.selected ? accentColor : 'transparent',
              border: `1px solid ${item.selected 
                ? 'transparent' 
                : darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              '&:hover': {
                bgcolor: item.selected 
                  ? darkMode ? '#c89dfd' : '#5000d3'
                  : darkMode ? alpha(accentColor, 0.2) : alpha(accentColor, 0.08),
                color: item.selected ? 'white' : accentColor
              },
              borderRadius: isEnhanced ? '12px' : '8px',
              fontWeight: item.selected ? 600 : 500,
              transition: 'all 0.3s ease',
              
              // Estilos adicionales para la variante mejorada
              ...(isEnhanced && {
                minWidth: item.type === 'page' ? '36px' : '36px',
                height: '36px',
                fontSize: '0.9rem',
                boxShadow: item.selected ? '0 2px 8px rgba(98, 0, 234, 0.2)' : 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 10px rgba(98, 0, 234, 0.15)'
                }
              })
            }}
          />
        )}
        sx={{ 
          '& .MuiPagination-ul': {
            gap: isEnhanced ? 0.6 : 0.5,
            padding: isEnhanced ? '8px' : '0',
            backgroundColor: isEnhanced ? alpha(accentColor, 0.02) : 'transparent',
            borderRadius: isEnhanced ? '20px' : '0',
            border: isEnhanced ? `1px solid ${alpha(accentColor, 0.08)}` : 'none',
            boxShadow: isEnhanced ? '0 2px 8px rgba(0,0,0,0.03)' : 'none'
          }
        }}
      />
    </motion.div>
  );
} 