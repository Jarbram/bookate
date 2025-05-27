import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PostPageClient from '@/components/Posts/PostPageClient';

// Definir la generación estática/dinámica
export const dynamic = 'force-dynamic';

// Función auxiliar para extraer URL de imagen mejorada
function getImageUrlForMeta(featuredImage) {
  if (!featuredImage) return null;
  
  // Si ya tenemos un objeto normalizado (creado por _normalizeAirtableImage)
  if (featuredImage && typeof featuredImage === 'object' && featuredImage.url) {
    return featuredImage.url;
  }
  
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

// Función para serializar post para el cliente
function serializePostForClient(post) {
  if (!post) return null;
  
  // Preparar datos para serialización segura
  return {
    ...post,
    // Si featuredImage ya es string, lo dejamos, si no, lo convertimos a JSON
    featuredImage: typeof post.featuredImage === 'string' 
      ? post.featuredImage 
      : JSON.stringify(post.featuredImage),
    categories: Array.isArray(post.categories) 
      ? post.categories 
      : typeof post.categories === 'string'
        ? post.categories.split(',').map(cat => cat.trim()).filter(Boolean)
        : [],
    tags: Array.isArray(post.tags) 
      ? post.tags 
      : typeof post.tags === 'string'
        ? post.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : []
  };
}

// Función para obtener post por slug usando Supabase
async function getPostBySlug(slug) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) throw error;
  return post;
}

// Generación de metadatos para SEO
export async function generateMetadata(props) {
  // Esperar a que params se resuelva
  const params = await props.params;
  const slug = String(params?.slug || '');
  
  if (!slug) {
    return {
      title: 'Post no encontrado',
      description: 'El post que buscas no existe'
    };
  }
  
  try {
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return {
        title: 'Artículo no encontrado',
        description: 'El artículo que buscas no existe o ha sido eliminado.'
      };
    }
    
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

// Función principal de la página
export default async function PostPage(props) {
  try {
    // Esperar a que params se resuelva
    const params = await props.params;
    const slug = String(params?.slug || '');
    
    if (!slug) {
      notFound();
    }
    
    const initialPost = await getPostBySlug(slug);
    
    if (!initialPost) {
      notFound();
    }
    
    // Serializar post para cliente de forma segura
    const safePost = serializePostForClient(initialPost);
    
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