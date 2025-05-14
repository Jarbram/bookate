import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import airtable from '@/lib/airtable';
import PostDetail from '@/components/Posts/PostDetail';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Box, Container, Typography } from '@mui/material';

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
    // Usamos notFound() para mostrar la página 404
    notFound();
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <PostDetail post={post} />
      </Box>
      <Footer />
    </Box>
  );
} 