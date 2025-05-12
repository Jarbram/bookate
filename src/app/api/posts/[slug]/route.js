import { NextResponse } from 'next/server';
import airtableServer from '@/lib/airtable-server';

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const post = await airtableServer.getPostBySlug(slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado', success: false },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ post, success: true });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Error al obtener el post', success: false },
      { status: 500 }
    );
  }
} 