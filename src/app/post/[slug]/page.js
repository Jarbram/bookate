import { notFound } from 'next/navigation';
import airtable from '@/lib/airtable';
import PostPageClient from '@/components/Posts/PostPageClient';

// Generación de metadatos para SEO (ahora funciona porque está en un componente del servidor)
export async function generateMetadata({ params }) {
  const post = await airtable.getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe o ha sido eliminado.'
    };
  }
  
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords || '',
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

// Función del lado del servidor para obtener el post
export default async function PostPage({ params }) {
  try {
    // Intentamos pre-cargar el post en el servidor para SEO y rendimiento
    const initialPost = await airtable.getPostBySlug(params.slug);
    
    if (!initialPost) {
      // Si no se encuentra el post, mostramos la página 404
      notFound();
    }
    
    // Pasamos el post al componente cliente como prop inicial
    return <PostPageClient initialPost={initialPost} slug={params.slug} />;
  } catch (error) {
    console.error('Error cargando post en servidor:', error);
    // En caso de error, renderizamos el componente cliente sin datos iniciales
    return <PostPageClient slug={params.slug} />;
  }
} 