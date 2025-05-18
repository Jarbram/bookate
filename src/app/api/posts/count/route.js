import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';
  
  try {
    // URL base de Airtable
    const airtableApiUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Posts`;
    
    // Crear fórmula de filtro
    let filterByFormula = "{status}='published'";
    
    if (category) {
      filterByFormula = `AND({status}='published', FIND("${category}", {categories}))`;
    }
    
    if (tag) {
      filterByFormula = `AND({status}='published', FIND("${tag}", {tags}))`;
    }
    
    // Configuración para la solicitud (solo recuperar IDs para contar)
    const response = await axios.get(airtableApiUrl, {
      params: {
        filterByFormula,
        fields: ['id']
      },
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });
    
    const total = response.data.records.length;
    
    return NextResponse.json({ total });
  } catch (error) {
    console.error('Error al contar posts de Airtable:', error);
    return NextResponse.json({ error: 'Error al contar datos', total: 0 }, { status: 500 });
  }
} 