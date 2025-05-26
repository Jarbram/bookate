import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;
    
    const { data: posts, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('publishDate', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      featuredImage: post.featuredImage || '',
      publishDate: post.publishDate || null,
      lastModified: post.lastModified || null,
      categories: Array.isArray(post.categories) ? post.categories : [],
      tags: Array.isArray(post.tags) ? post.tags : [],
      status: post.status || 'draft',
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      seoKeywords: Array.isArray(post.seoKeywords) ? post.seoKeywords : [],
      adPositions: Array.isArray(post.adPositions) ? post.adPositions : []
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener posts' }, { status: 500 });
  }
}

// Función auxiliar para validar y sanitizar parámetros
function sanitizeParams(params) {
  return {
    limit: Math.min(Math.max(parseInt(params.limit) || 20, 1), 100),
    offset: Math.max(parseInt(params.offset) || 0, 0),
    category: params.category?.trim(),
    search: params.search?.trim(),
    sortBy: ['publishDate', 'lastModified', 'title'].includes(params.sortBy) 
      ? params.sortBy 
      : 'publishDate',
    sortOrder: ['asc', 'desc'].includes(params.sortOrder) 
      ? params.sortOrder 
      : 'desc'
  };
}

// Método POST para crear nuevos posts (si es necesario)
export async function POST(request) {
  // ... implementación del método POST si se requiere
} 