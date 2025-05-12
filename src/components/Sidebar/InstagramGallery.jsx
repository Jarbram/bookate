'use client';
import { useState } from 'react';
import { Box, Typography, Link, IconButton, Zoom } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import { motion } from 'framer-motion';

export default function InstagramGallery() {
  const bgGradient = 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
  
  return (
    <Box 
      sx={{ 
        mb: 4, 
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
      }}
      component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Barra de título inspirada en Instagram */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        background: bgGradient,
        borderTopLeftRadius: '18px',
        borderTopRightRadius: '18px',
      }}>
        <Typography
          variant="h6"
          sx={{ 
            fontWeight: 700, 
            color: 'white',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          <InstagramIcon sx={{ mr: 1, fontSize: '1.3rem' }} />
          @booke_ate
        </Typography>
        
        <Link 
          href="https://www.instagram.com/booke_ate/" 
          target="_blank"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50px',
            padding: '4px 12px',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          Seguir
        </Link>
      </Box>
      
      
      {/* Widget incrustado de Instagram */}
      <Box 
        component="iframe"
        src="https://www.instagram.com/booke_ate/embed" 
        width="100%"
        height="410px"
        sx={{
          border: 'none',
          display: 'block',
          overflowY: 'hidden',
          backgroundColor: '#ffffff',
          transition: 'all 0.3s ease',
        }}
        loading="lazy"
        title="Perfil de Instagram @booke_ate"
      />
    </Box>
  );
} 