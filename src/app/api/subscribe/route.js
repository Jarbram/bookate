import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    // Obtener los datos del cuerpo de la petición
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email no válido' 
      }, { status: 400 });
    }
    
    // URL base de Airtable
    const airtableApiUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Subscribers`;
    
    // Verificar si el email ya existe
    const checkResponse = await axios.get(airtableApiUrl, {
      params: {
        filterByFormula: `{email}="${email}"`,
        maxRecords: 1
      },
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (checkResponse.data.records && checkResponse.data.records.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Ya estás suscrito a nuestro newsletter' 
      });
    }
    
    // Crear el registro en Airtable
    const createResponse = await axios.post(airtableApiUrl, {
      fields: {
        email: email,
        status: 'active'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: '¡Gracias por suscribirte!',
      data: createResponse.data
    });
  } catch (error) {
    console.error('Error al procesar suscripción:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al procesar tu suscripción',
      error: error.message 
    }, { status: 500 });
  }
} 