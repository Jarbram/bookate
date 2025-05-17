import { notFound } from 'next/navigation';
import airtable from '@/lib/airtable';
import PostPageClient from '@/components/Posts/PostPageClient';

// Generación de metadatos para SEO
export async function generateMetadata(props) {
  // Acceso seguro a slug con manejo explícito de promesas
  const slug = props?.params?.slug 
    ? (typeof props.params.slug.then === 'function' 
        ? await props.params.slug 
        : props.params.slug)
    : null;
  
  if (!slug) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe o ha sido eliminado.'
    };
  }
  
  const post = await airtable.getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe o ha sido eliminado.'
    };
  }
  
  // Extraer URL de imagen de forma segura para los metadatos
  const getImageUrlForMeta = (featuredImage) => {
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
  };
  
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
}

// Función del lado del servidor para obtener el post
export default async function PostPage(props) {
  try {
    // Acceso seguro a slug con manejo explícito de promesas
    const slug = props?.params?.slug 
      ? (typeof props.params.slug.then === 'function' 
          ? await props.params.slug 
          : props.params.slug)
      : null;
    
    if (!slug) {
      notFound();
    }
    
    // Intentamos pre-cargar el post en el servidor para SEO y rendimiento
    const initialPost = await airtable.getPostBySlug(slug);
    
    if (!initialPost) {
      // Si no se encuentra el post, mostramos la página 404
      notFound();
    }
    
    // Asegurarnos de que el post es serializable correctamente
    const safePost = {
      ...initialPost,
      // Asegurar que los campos complejos sean manejados correctamente
      featuredImage: typeof initialPost.featuredImage === 'object' 
        ? JSON.stringify(initialPost.featuredImage) 
        : initialPost.featuredImage,
      // Otros campos que podrían necesitar tratamiento especial
      categories: Array.isArray(initialPost.categories) 
        ? initialPost.categories 
        : [],
      tags: Array.isArray(initialPost.tags) 
        ? initialPost.tags 
        : []
    };
    
    // Pasamos el post al componente cliente como prop inicial
    return <PostPageClient initialPost={safePost} slug={slug} />;
  } catch (error) {
    console.error('Error cargando post en servidor:', error);
    
    // En caso de error, intentamos acceder al slug de manera segura
    const fallbackSlug = props?.params?.slug 
      ? (typeof props.params.slug.then === 'function' 
          ? await props.params.slug 
          : props.params.slug)
      : null;
    
    // En caso de error, renderizamos el componente cliente sin datos iniciales
    return <PostPageClient slug={fallbackSlug} />;
  }
} 