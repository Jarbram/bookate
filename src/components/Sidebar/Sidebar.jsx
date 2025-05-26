'use client';
import { Box, Typography, Skeleton, Paper } from '@mui/material';
import SearchBox from './SearchBox';
import Categories from './Categories';
import InstagramGallery from './InstagramGallery';

export default function Sidebar({ categories = [], loading = false }) {
  return (
    <Box 
      component={Paper} 
      elevation={0}
      sx={{ 
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}
    >
      {/* Buscador */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            mb: 2,
            fontWeight: 700,
            color: 'text.primary'
          }}
        >
          Buscar
        </Typography>
        {loading ? (
          <Skeleton height={56} />
        ) : (
          <SearchBox />
        )}
      </Box>

      {/* Categorías */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            mb: 2,
            fontWeight: 700,
            color: 'text.primary'
          }}
        >
          Categorías
        </Typography>
        {loading ? (
          <>
            <Skeleton height={32} />
            <Skeleton height={32} />
            <Skeleton height={32} />
          </>
        ) : (
          <Categories categories={categories} />
        )}
      </Box>

      {/* Instagram Feed */}
      <Box>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            mb: 2,
            fontWeight: 700,
            color: 'text.primary'
          }}
        >
          Síguenos en Instagram
        </Typography>
        {loading ? (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 1 
          }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton 
                key={i} 
                variant="rectangular" 
                sx={{ 
                  paddingTop: '100%',
                  borderRadius: 1
                }} 
              />
            ))}
          </Box>
        ) : (
          <InstagramGallery />
        )}
      </Box>
    </Box>
  );
} 