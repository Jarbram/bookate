import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // URL base de Airtable
    const airtableApiUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Posts`;
    
    // Configuración para obtener posts publicados
    const config = {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        filterByFormula: "{status}='published'",
        view: 'Grid view',
        fields: ['tags'] // Solo necesitamos el campo tags
      }
    };
    
    // Realizar petición a Airtable
    const response = await axios.get(airtableApiUrl, config);
    
    // Extraer tags únicos de los posts
    const tagMap = {};
    
    response.data.records.forEach(record => {
      const tags = record.fields.tags || [];
      
      tags.forEach(tag => {
        if (tag) {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        }
      });
    });
    
    // Convertir a array para la respuesta
    const tags = Object.entries(tagMap).map(([name, count]) => ({ 
      name, 
      count,
      slug: name.toLowerCase()
    }));
    
    // Ordenar por cantidad de posts
    tags.sort((a, b) => b.count - a.count);
    
    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error al obtener tags desde Airtable:', error);
    return NextResponse.json({ error: 'Error al obtener tags', tags: [] }, { status: 500 });
  }
} 