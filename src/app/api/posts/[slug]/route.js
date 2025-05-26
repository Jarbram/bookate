import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  const slug = params.slug;
  
  if (!slug) {
    return NextResponse.json({ error: 'Slug no proporcionado' }, { status: 400 });
  }
  
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        categories:posts_categories(categories(*)),
        tags:posts_tags(tags(*))
      `)
      .eq('status', 'published')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error(`Error al obtener post con slug ${slug}:`, error);
    return NextResponse.json({ error: 'Error al obtener post' }, { status: 500 });
  }
} 