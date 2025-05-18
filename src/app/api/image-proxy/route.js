import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  // Extraer la URL de la imagen de los parámetros
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');
  
  if (!imageUrl) {
    return NextResponse.json({ error: 'URL de imagen no proporcionada' }, { status: 400 });
  }
  
  try {
    // Verificar si la URL es válida
    new URL(imageUrl);
    
    // Obtener la imagen
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    
    // Determinar el tipo MIME
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    // Devolver la imagen
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400' // Caché por 1 día
      }
    });
  } catch (error) {
    console.error('Error al obtener imagen:', error);
    
    // Devolver una imagen de fallback
    return NextResponse.redirect(
      'https://via.placeholder.com/800x600?text=Imagen+no+disponible'
    );
  }
} 