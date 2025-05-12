'use client';
import { Box } from '@mui/material';
import SearchBox from './SearchBox';
import Categories from './Categories';
import InstagramGallery from './InstagramGallery';

export default function MobileSidebarContent({ showSearchAndCategories = true }) {
  return (
    <Box>
      {showSearchAndCategories && (
        <>
          <SearchBox />
          <Box sx={{ mt: 3, mb: 4, overflowX: 'auto' }}>
            <Categories displayMode="horizontal" />
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