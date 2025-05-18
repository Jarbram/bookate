'use client';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '@/components/Header/Header';
import PostDetail from '@/components/Posts/PostDetail';
import Footer from '@/components/Footer/Footer';
import airtable from '@/lib/airtable';

// Función para deserializar los campos del post
function deserializePostFields(post) {
  if (!post) return null;
  
  try {
    // Función auxiliar para parsear imágenes
    const parseImageField = (imageField) => {
      if (!imageField) return null;
      
      // Intentar parsear si es string que parece JSON
      if (typeof imageField === 'string' && 
          (imageField.startsWith('{') || imageField.startsWith('['))) {
        try {
          return JSON.parse(imageField);
        } catch (e) {
          console.warn('Error parseando imagen:', e);
          return imageField; // Dejar como string si falla
        }
      }
      
      return imageField; // Devolver sin cambios si no es string JSON
    };
    
    return {
      ...post,
      // Restaurar campos serializados
      featuredImage: parseImageField(post.featuredImage)
    };
  } catch (error) {
    console.error('Error deserializando post:', error);
    return post; // Devolver original en caso de error
  }
}

// Componente cliente que recibe el post del servidor como prop
export default function PostPageClient({ initialPost, slug }) {
  const [post, setPost] = useState(initialPost ? deserializePostFields(initialPost) : null);
  const [loading, setLoading] = useState(!initialPost);

  // Si no tenemos el post inicial o queremos actualizarlo con datos frescos
  useEffect(() => {
    if (!initialPost) {
      // Si no hay post inicial, cargamos desde el cliente
      const fetchPost = async () => {
        try {
          setLoading(true);
          const postData = await airtable.getPostBySlug(slug);
          setPost(deserializePostFields(postData));
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