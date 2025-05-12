'use client';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  Grid, 
  Chip, 
  Paper,
  Avatar,
  alpha,
  Button
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { motion } from 'framer-motion';

const topPosts = [
  {
    id: 1,
    title: 'Aenean mattis tortor ac sapien congue molestie',
    categories: ['Food', 'Travel'],
    date: 'Nov 17, 2023',
    hot: true
  },
  {
    id: 2,
    title: 'Vestibulum ante ipsum primis in orci luctus',
    categories: ['Music', 'Design'],
    date: 'Nov 15, 2023',
    hot: false
  },
  {
    id: 3,
    title: 'Sapien etiam eu odio tincidure vitae bibendum vitae',
    categories: ['Food', 'Travel'],
    date: 'Nov 12, 2023',
    hot: false
  },
  {
    id: 4,
    title: 'Etiam eu odio in sapien posuere vitae bibendum',
    categories: ['Culture', 'Art'],
    date: 'Nov 10, 2023',
    hot: true
  },
  {
    id: 5,
    title: 'Morbi eget leo a tellus gravida sagittis nec odio',
    categories: ['Food', 'Travel'],
    date: 'Nov 7, 2023',
    hot: false
  }
];

export default function TopPosts({ darkMode = false }) {
  const [hoveredPost, setHoveredPost] = useState(null);
  
  // Colores primarios del tema (manteniendo coherencia con el Header)
  const primaryLight = '#6200ea';
  const primaryDark = '#bb86fc';
  const bgColor = darkMode ? '#151515' : '#ffffff';
  const textColor = darkMode ? '#e0e0e0' : '#1a1a1a';
  const accentColor = darkMode ? '#bb86fc' : '#6200ea';

  return (
    <Box sx={{ mb: 4, position: 'relative' }}>
      <Typography
        variant="subtitle1"
        gutterBottom 
        sx={{ 
          position: 'relative',
          fontWeight: 700, 
          mb: 2,
          ml: 0.5,
          color: textColor,
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '-15px',
            width: '4px',
            height: '18px',
            borderRadius: '4px',
            backgroundColor: accentColor,
            transform: 'skewY(15deg)'
          }
        }}
      >
        Top Posts
        <LocalFireDepartmentIcon 
          sx={{ 
            ml: 1, 
            fontSize: '0.9rem', 
            color: '#ff4d4d'
          }} 
        />
      </Typography>
      
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: darkMode ? 'radial-gradient(circle, rgba(98, 0, 234, 0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(98, 0, 234, 0.05) 0%, transparent 70%)',
          bottom: '10%',
          right: '-60px',
          zIndex: -1,
        }}
      />
      
      <List 
        sx={{ 
          p: 0,
          '& > div:not(:last-child)': {
            mb: 2
          }
        }}
      >
        {topPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            onMouseEnter={() => setHoveredPost(post.id)}
            onMouseLeave={() => setHoveredPost(null)}
          >
            <Paper
              elevation={0}
              sx={{ 
                p: 2,
                borderRadius: '16px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                background: darkMode ? 'rgba(30,30,30,0.4)' : 'rgba(249, 249, 252, 0.7)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: darkMode ? '0 8px 16px rgba(0,0,0,0.2)' : '0 8px 16px rgba(98, 0, 234, 0.1)',
                  background: darkMode ? alpha(accentColor, 0.1) : alpha(accentColor, 0.03),
                  borderColor: darkMode ? alpha(accentColor, 0.2) : alpha(accentColor, 0.1)
                }
              }}
            >
              <Grid container spacing={1.5} alignItems="center">
                <Grid item xs={2} sm={1}>
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      background: hoveredPost === post.id
                        ? `linear-gradient(135deg, ${accentColor}, #9c4dcc)`
                        : darkMode 
                          ? 'rgba(255,255,255,0.1)' 
                          : 'rgba(0,0,0,0.06)',
                      color: hoveredPost === post.id
                        ? '#fff'
                        : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </Grid>
                <Grid item xs={10} sm={11}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 0.8,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      color: textColor,
                      fontSize: '0.9rem',
                      lineHeight: 1.3,
                      transition: 'color 0.2s ease',
                      ...(hoveredPost === post.id && {
                        color: accentColor
                      })
                    }}
                  >
                    {post.title}
                    {post.hot && (
                      <Chip
                        size="small"
                        label="HOT"
                        sx={{
                          ml: 1,
                          height: '16px',
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
                          color: '#fff',
                          border: 'none',
                          verticalAlign: 'text-top'
                        }}
                      />
                    )}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 0.5
                  }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {post.categories.map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          size="small"
                          sx={{
                            height: '20px',
                            fontSize: '0.6rem',
                            borderRadius: '10px',
                            background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                            color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                            '&:hover': {
                              background: darkMode ? alpha(accentColor, 0.2) : alpha(accentColor, 0.1),
                              color: accentColor
                            }
                          }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                    }}>
                      <AccessTimeIcon sx={{ fontSize: '0.7rem', mr: 0.5 }} />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '0.65rem',
                          opacity: 0.8
                        }}
                      >
                        {post.date}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              {/* Hover effect overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  background: 'linear-gradient(90deg, transparent, transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  ...(hoveredPost === post.id && {
                    opacity: 0.05,
                    background: `linear-gradient(90deg, transparent, ${accentColor})`
                  })
                }}
              />
            </Paper>
          </motion.div>
        ))}
      </List>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="text"
          size="small"
          sx={{
            color: accentColor,
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 500,
            '&:hover': {
              background: darkMode ? alpha(accentColor, 0.1) : alpha(accentColor, 0.05)
            }
          }}
        >
          Ver todos los artículos
        </Button>
      </Box>
    </Box>
  );
} 