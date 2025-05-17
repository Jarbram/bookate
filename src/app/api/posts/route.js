import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || 20;
  const offset = searchParams.get('offset') || 0;
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  
  try {
    // URL base de Airtable
    const airtableApiUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Posts`;
    
    // Configuración para la solicitud
    let params = {
      view: 'Grid view',
      pageSize: limit,
      filterByFormula: `{status}='published'`,
      'sort[0][field]': 'publishDate',
      'sort[0][direction]': 'desc'
    };
    
    // Añadir filtro de categoría si está presente
    if (category) {
      params.filterByFormula = `AND({status}='published', FIND("${category}", {categories}))`;
    }
    
    // Añadir búsqueda si está presente
    if (search) {
      const searchFormula = `OR(FIND("${search}", LOWER({title})), FIND("${search}", LOWER({content})))`;
      params.filterByFormula = category 
        ? `AND({status}='published', FIND("${category}", {categories}), ${searchFormula})`
        : `AND({status}='published', ${searchFormula})`;
    }
    
    const response = await axios.get(airtableApiUrl, {
      params,
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error al obtener posts de Airtable:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
} 