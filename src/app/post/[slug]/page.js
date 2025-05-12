import { Metadata } from 'next';
import airtable from '@/lib/airtable';
import PostDetail from '@/components/Posts/PostDetail';

// Generación de metadatos para SEO
export async function generateMetadata({ params }) {
  const post = await airtable.getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe'
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.lastModified,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      image: post.featuredImage,
    },
  };
}

export default async function PostPage({ params }) {
  const post = await airtable.getPostBySlug(params.slug);
  
  if (!post) {
    return <div>Artículo no encontrado</div>;
  }
  
  return <PostDetail post={post} />;
} 