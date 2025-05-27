'use client';
import { Box, Typography, Divider } from '@mui/material';
import SearchBox from './SearchBox';
import Categories from './Categories';
import InstagramGallery from './InstagramGallery';

export default function MobileSidebarContent({ 
  categories = [], 
  loading = false,
  showSearchAndCategories = true 
}) {
  return (
    <Box sx={{ width: '100%' }}>
      {showSearchAndCategories && (
        <>
          {/* Buscador */}
          <Box sx={{ mb: 3 }}>
            <SearchBox />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Categorías en modo horizontal para móvil */}
          <Box sx={{ mb: 3 }}>
            <Categories 
              categories={categories}
              loading={loading}
              displayMode="horizontal"
            />
          </Box>
        </>
      )}
      
      {!showSearchAndCategories && (
        <>
          <InstagramGallery />
        </>
      )}
    </Box>
  );
} 