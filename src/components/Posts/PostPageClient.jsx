'use client';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '@/components/Header/Header';
import PostDetail from '@/components/Posts/PostDetail';
import Footer from '@/components/Footer/Footer';
import airtable from '@/lib/airtable';

// Componente cliente que recibe el post del servidor como prop
export default function PostPageClient({ initialPost, slug }) {
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(!initialPost);

  // Si no tenemos el post inicial o queremos actualizarlo con datos frescos
  useEffect(() => {
    if (!initialPost) {
      // Si no hay post inicial, cargamos desde el cliente
      const fetchPost = async () => {
        try {
          setLoading(true);
          const postData = await airtable.getPostBySlug(slug);
          setPost(postData);
        } catch (error) {
          console.error('Error al cargar el post:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [initialPost, slug]);

  // Renderizar un placeholder durante la carga en el cliente
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 4, display: 'flex', justifyContent: 'center' }}>
          <div className="loading-placeholder">Cargando artículo...</div>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {post ? <PostDetail post={post} /> : <div>No se encontró el artículo</div>}
      </Box>
      <Footer />
    </Box>
  );
} 