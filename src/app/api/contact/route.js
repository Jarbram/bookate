import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    
    // Validaciones básicas
    if (!name || !email || !message) {
      return NextResponse.json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      }, { status: 400 });
    }
    
    if (!email.includes('@')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email no válido' 
      }, { status: 400 });
    }
    
    // URL de Airtable
    const airtableApiUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Contactos`;
    
    // Crear el registro en Airtable
    const createResponse = await axios.post(airtableApiUrl, {
      fields: {
        nombre: name,
        email: email,
        mensaje: message,
        fecha: new Date().toISOString()
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: '¡Mensaje enviado con éxito!',
      data: createResponse.data
    });
    
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al enviar el mensaje',
      error: error.message 
    }, { status: 500 });
  }
} 