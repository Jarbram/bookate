import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';
  
  try {
    let query = supabase
      .from('posts')
      .select('id', { count: 'exact' })
      .eq('status', 'published');
    
    if (category) {
      query = query.contains('categories', [category]);
    }
    
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ total: count || 0 });
  } catch (error) {
    console.error('Error al contar posts:', error);
    return NextResponse.json({ error: 'Error al contar posts', total: 0 }, { status: 500 });
  }
} 