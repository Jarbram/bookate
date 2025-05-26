import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('name, slug, id')
      .eq('status', 'published');

    if (error) throw error;

    // Obtener el conteo de posts por categoría
    const { data: postsCount, error: countError } = await supabase
      .from('posts_categories')
      .select('category_id, count', { count: 'exact' })
      .group_by('category_id');

    if (countError) throw countError;

    // Combinar la información
    const categoriesWithCount = categories.map(category => ({
      ...category,
      count: postsCount.find(p => p.category_id === category.id)?.count || 0
    }));

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error) {
    console.error('Error en endpoint de categorías:', error);
    return NextResponse.json({ 
      error: 'Error interno', 
      detail: error.message,
      categories: [] 
    }, { status: 500 });
  }
} 