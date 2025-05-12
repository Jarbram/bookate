'use client';
import { Pagination as MUIPagination, PaginationItem, alpha } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

export default function Pagination({ count, page, onChange, darkMode = false }) {
  // Colores primarios del tema (manteniendo coherencia con el Header)
  const primaryLight = '#6200ea';
  const primaryDark = '#bb86fc';
  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a';
  const accentColor = darkMode ? '#bb86fc' : '#6200ea';
  
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
        size="medium"
        siblingCount={1}
        boundaryCount={1}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
            sx={{
              margin: '0 2px',
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
              borderRadius: '8px',
              fontWeight: item.selected ? 600 : 500,
              transition: 'all 0.3s ease'
            }}
          />
        )}
        sx={{ 
          '& .MuiPagination-ul': {
            gap: 0.5
          }
        }}
      />
    </motion.div>
  );
} 