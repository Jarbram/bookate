import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
  const slug = params.slug;
  
  if (!slug) {
    return NextResponse.json({ error: 'Slug no proporcionado' }, { status: 400 });
  }
  
  try {
    // URL base de Airtable
    const airtableApiUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Posts`;
    
    // Escapar el slug para evitar problemas con caracteres especiales
    const escapedSlug = slug.replace(/"/g, '\\"');
    const filterByFormula = `AND({status}="published", {slug}="${escapedSlug}")`;
    
    // Realizar petición a Airtable
    const response = await axios.get(airtableApiUrl, {
      params: {
        filterByFormula,
        maxRecords: 1
      },
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });
    
    if (!response.data.records || response.data.records.length === 0) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }
    
    const record = response.data.records[0];
    return NextResponse.json({ post: record });
  } catch (error) {
    console.error(`Error al obtener post con slug ${slug}:`, error);
    return NextResponse.json({ error: 'Error al obtener post' }, { status: 500 });
  }
} 