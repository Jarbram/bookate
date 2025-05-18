import { notFound } from 'next/navigation';
import airtable from '@/lib/airtable';
import PostPageClient from '@/components/Posts/PostPageClient';

// Definir la generación estática/dinámica
export const dynamic = 'force-dynamic';

// Generación de metadatos para SEO
export async function generateMetadata(props) {
  // Extraer el slug de forma segura
  const slug = String(props.params?.slug || '');
  
  if (!slug) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe o ha sido eliminado.'
    };
  }
  
  try {
    const post = await airtable.getPostBySlug(slug);
    
    if (!post) {
      return {
        title: 'Artículo no encontrado',
        description: 'El artículo que buscas no existe o ha sido eliminado.'
      };
    }
    
    // Extraer URL de imagen para metadatos
    const imageUrl = getImageUrlForMeta(post.featuredImage);
    
    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      keywords: post.seoKeywords || '',
      openGraph: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
    };
  } catch (error) {
    console.error('Error generando metadatos:', error);
    return {
      title: 'Error al cargar artículo',
      description: 'Ha ocurrido un error al intentar cargar el contenido.'
    };
  }
}

// Función auxiliar para extraer URL de imagen
function getImageUrlForMeta(featuredImage) {
  if (!featuredImage) return null;
  
  // Para campos attachment en formato array
  if (Array.isArray(featuredImage) && featuredImage.length > 0) {
    if (featuredImage[0] && featuredImage[0].url) {
      return featuredImage[0].url;
    }
  }
  
  // Para string directo
  if (typeof featuredImage === 'string' && featuredImage.trim() !== '') {
    return featuredImage;
  }
  
  return null;
}

// Función principal de la página
export default async function PostPage(props) {
  try {
    // Extraer el slug de forma segura sin awaits
    const slug = String(props.params?.slug || '');
    
    if (!slug) {
      notFound();
    }
    
    // Cargar el post
    const initialPost = await airtable.getPostBySlug(slug);
    
    if (!initialPost) {
      notFound();
    }
    
    // Preparar datos para serialización
    const safePost = {
      ...initialPost,
      featuredImage: typeof initialPost.featuredImage === 'object' 
        ? JSON.stringify(initialPost.featuredImage) 
        : initialPost.featuredImage,
      categories: Array.isArray(initialPost.categories) 
        ? initialPost.categories 
        : [],
      tags: Array.isArray(initialPost.tags) 
        ? initialPost.tags 
        : []
    };
    
    // Renderizar el componente cliente
    return <PostPageClient initialPost={safePost} slug={slug} />;
  } catch (error) {
    console.error('Error cargando post:', error);
    
    // Extraer slug de forma segura para el fallback
    const fallbackSlug = String(props.params?.slug || '');
    
    // Mostrar componente cliente sin datos iniciales
    return <PostPageClient slug={fallbackSlug} />;
  }
} 