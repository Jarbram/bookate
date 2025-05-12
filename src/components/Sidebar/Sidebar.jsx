'use client';
import { Box } from '@mui/material';
import SearchBox from './SearchBox';
import Categories from './Categories';
import InstagramGallery from './InstagramGallery';

export default function Sidebar() {
  return (
    <Box>
      <SearchBox />
      <Categories />
      <InstagramGallery />
    </Box>
  );
} 