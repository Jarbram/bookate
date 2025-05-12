import { NextResponse } from 'next/server';
import airtableServer from '@/lib/airtable-server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');

  try {
    // Implementación del conteo de posts
    const totalCount = await airtableServer.getPostsCount({ category, tag });
    
    return NextResponse.json({ 
      total: totalCount,
      success: true 
    });
  } catch (error) {
    console.error('Error obteniendo conteo de posts:', error);
    return NextResponse.json(
      { error: 'Error al obtener el conteo de posts', success: false },
      { status: 500 }
    );
  }
} 