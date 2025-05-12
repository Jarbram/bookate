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
      { error: 'Error al obtener los posts', success: false },
      { status: 500 }
    );
  }
} 