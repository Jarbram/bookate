import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Retornar datos estáticos para descartar problemas en la lógica
    const categoriesMock = [
      { name: "Desarrollo", count: 5, slug: "desarrollo" },
      { name: "Diseño", count: 3, slug: "diseño" },
      { name: "Marketing", count: 2, slug: "marketing" }
    ];
    
    return NextResponse.json({ categories: categoriesMock });
  } catch (error) {
    console.error('Error en endpoint de categorías:', error);
    return NextResponse.json({ 
      error: 'Error interno', 
      detail: error.message,
      categories: [] 
    }, { status: 500 });
  }
} 