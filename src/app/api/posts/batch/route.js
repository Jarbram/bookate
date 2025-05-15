import airtableServer from '../../../../lib/airtable-server';

export async function GET(request) {
  // Añadimos un breve retraso para evitar múltiples solicitudes simultáneas
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const batchSize = parseInt(searchParams.get('batchSize')) || 20;
    const sortBy = searchParams.get('sortBy') || 'publishDate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const lastId = searchParams.get('lastId'); // Para evitar duplicados
    
    // Calcula el offset basado en la página
    const offset = (page - 1) * batchSize;
    
    // Primero obtener el recuento total para saber si hay más
    const totalCount = await airtableServer.getPostsCount();
    
    // Obtener el lote de posts
    const posts = await airtableServer.getPosts({
      limit: batchSize, 
      offset,
      sortBy,
      sortOrder,
      lastId // Pasamos el último ID para evitar duplicados
    });
    
    // Filtrar posts que ya fueron entregados (si lastId está presente)
    const filteredPosts = lastId 
      ? posts.filter(post => post.id !== lastId)
      : posts;
    
    // Determinar si hay más posts para cargar
    const hasMore = offset + filteredPosts.length < totalCount;
    
    // Añadir un ID de lote único para depuración
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    console.log(`Lote ${batchId}: Entregando ${filteredPosts.length} posts (página ${page})`);
    
    return Response.json({
      posts: filteredPosts,
      page,
      batchSize,
      hasMore,
      total: totalCount,
      batchId // Para depuración
    });
  } catch (error) {
    console.error('Error al procesar solicitud de lote:', error);
    return Response.json(
      { 
        error: 'Error al obtener lote de posts',
        message: error.message 
      },
      { status: 500 }
    );
  }
} 