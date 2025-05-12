import { NextResponse } from 'next/server';
import airtableServer from '@/lib/airtable-server';

export async function GET() {
  try {
    const categories = await airtableServer.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ error: 'Error al cargar categorías' }, { status: 500 });
  }
} 