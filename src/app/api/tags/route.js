import { NextResponse } from 'next/server';
import airtableServer from '@/lib/airtable-server';

export async function GET() {
  try {
    const tags = await airtableServer.getTags();
    return NextResponse.json({ tags, success: true });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Error al obtener los tags', success: false },
      { status: 500 }
    );
  }
} 