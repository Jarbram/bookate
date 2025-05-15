import { NextResponse } from 'next/server';
import airtableServer from '@/lib/airtable-server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const sortBy = searchParams.get('sortBy') || 'publishDate';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  console.log('API Request - GET /api/posts:', { limit, offset, category, tag, sortBy, sortOrder });

  try {
    // Obtener los posts para la página actual
    const posts = await airtableServer.getPosts({ 
      limit, 
      offset, 
      category, 
      tag,
      sortBy,
      sortOrder
    });
    
    console.log(`API Response - Obtenidos ${posts.length} posts`);
    
    // Obtener el conteo total siempre
    const totalCount = await airtableServer.getPostsCount({ category, tag });
    
    return NextResponse.json({ 
      posts, 
      total: totalCount,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener los posts', 
        message: error.message,
        success: false 
      },
      { status: 500 }
    );
  }
} 