const Airtable = require('airtable');

// Datos de ejemplo para usar cuando hay errores
const mockPosts = [
  {
    id: '1',
    title: 'Las mejores recetas para preparar en casa',
    slug: 'mejores-recetas-para-preparar-en-casa',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt: 'Descubre las recetas más deliciosas y fáciles de preparar en tu hogar.',
    featuredImage: 'https://picsum.photos/seed/food1/800/600',
    publishDate: '2023-11-15',
    lastModified: '2023-11-17',
    categories: ['Cocina', 'Hogar'],
    tags: ['recetas', 'cocina', 'comida'],
    seoTitle: 'Las 10 Mejores Recetas Caseras | Fáciles y Deliciosas',
    seoDescription: 'Aprende a preparar las recetas más deliciosas en casa con ingredientes simples.',
    seoKeywords: 'recetas caseras, cocinar en casa, recetas fáciles',
    adPositions: 'top,middle,bottom',
    views: 1250
  },
  {
    id: '2',
    title: 'Guía completa de jardinería para principiantes',
    slug: 'guia-completa-jardineria-principiantes',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt: 'Todo lo que necesitas saber para comenzar tu propio jardín desde cero.',
    featuredImage: 'https://picsum.photos/seed/garden1/800/600',
    publishDate: '2023-11-10',
    lastModified: '2023-11-12',
    categories: ['Jardinería', 'Hogar'],
    tags: ['plantas', 'jardín', 'naturaleza'],
    seoTitle: 'Guía Completa de Jardinería para Principiantes | Paso a Paso',
    seoDescription: 'Aprende a crear y mantener tu jardín desde cero con nuestra guía.',
    seoKeywords: 'jardinería para principiantes, cómo cuidar plantas, jardín en casa',
    adPositions: 'top,bottom',
    views: 980
  },
  {
    id: '3',
    title: '10 consejos para mejorar tu productividad trabajando desde casa',
    slug: '10-consejos-mejorar-productividad-teletrabajo',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    excerpt: 'Estrategias probadas para aumentar tu eficiencia cuando trabajas remotamente.',
    featuredImage: 'https://picsum.photos/seed/work1/800/600',
    publishDate: '2023-11-05',
    lastModified: '2023-11-07',
    categories: ['Productividad', 'Trabajo'],
    tags: ['teletrabajo', 'productividad', 'consejos'],
    seoTitle: '10 Consejos Efectivos para Trabajar desde Casa | Aumenta tu Productividad',
    seoDescription: 'Descubre cómo ser más productivo trabajando desde casa con estos consejos.',
    seoKeywords: 'productividad en casa, teletrabajo eficiente, consejos trabajo remoto',
    adPositions: 'middle',
    views: 1540
  }
];

const mockCategories = [
  { id: '1', name: 'Cocina', slug: 'cocina', description: 'Recetas, consejos culinarios y más' },
  { id: '2', name: 'Jardinería', slug: 'jardineria', description: 'Todo sobre plantas y jardines' },
  { id: '3', name: 'Productividad', slug: 'productividad', description: 'Consejos para ser más eficiente' },
  { id: '4', name: 'Hogar', slug: 'hogar', description: 'Ideas para mejorar tu casa' },
  { id: '5', name: 'Trabajo', slug: 'trabajo', description: 'Consejos profesionales' }
];

const mockTags = [
  { id: '1', name: 'recetas', slug: 'recetas' },
  { id: '2', name: 'cocina', slug: 'cocina' },
  { id: '3', name: 'plantas', slug: 'plantas' },
  { id: '4', name: 'jardín', slug: 'jardin' },
  { id: '5', name: 'productividad', slug: 'productividad' },
  { id: '6', name: 'teletrabajo', slug: 'teletrabajo' }
];

// Configuración de Airtable con manejo de errores
let base;
try {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.warn('⚠️ Variables de entorno Airtable no encontradas. Usando datos de ejemplo.');
  } else {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY,
    });
    base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    console.log('✅ Airtable configurado correctamente');
  }
} catch (error) {
  console.error('❌ Error al configurar Airtable:', error);
}

// Al inicio del archivo, añade más logging
console.log('Iniciando configuración de airtable-server...');
console.log('Variables de entorno disponibles:', {
  tieneApiKey: !!process.env.AIRTABLE_API_KEY,
  tieneBaseId: !!process.env.AIRTABLE_BASE_ID
});

// Funciones para interactuar con Airtable
const airtableServer = {
  // Obtener todos los posts publicados
  async getPosts({ limit = 10, offset = 0, category = null, tag = null, sortBy = 'publishDate', sortOrder = 'desc' } = {}) {
    try {
      console.log('airtable-server: Iniciando getPosts con params:', { limit, offset, category, tag });
      
      if (!base) {
        console.error('❌ Error: Airtable no está configurado correctamente');
        console.log('📄 Devolviendo datos de ejemplo debido a falta de configuración');
        // Devolver mockPosts en lugar de lanzar error para evitar problemas
        return mockPosts;
      }

      let filterFormula = "{status}='published'";
      
      if (category) {
        filterFormula = `AND({status}='published', FIND('${category}', {categoriesString}))`;
      }
      
      if (tag) {
        filterFormula = `AND({status}='published', FIND('${tag}', {tagsString}))`;
      }
      
      console.log(`📝 Consultando posts con filtro: ${filterFormula}, offset: ${offset}, limit: ${limit}`);
      
      // Primero obtener todos los registros que coinciden con el filtro
      const query = base('Posts').select({
        filterByFormula: filterFormula,
        sort: [{ field: sortBy || 'publishDate', direction: sortOrder || 'desc' }],
        view: 'Grid view',
      });
      
      // Para implementar la paginación correctamente
      let allRecords = [];
      let page = 1;
      
      // Obtener todos los registros primero (esto podría optimizarse más si hay muchos)
      await query.eachPage((records, fetchNextPage) => {
        allRecords = [...allRecords, ...records];
        fetchNextPage();
      });
      
      // Aplicar el offset y limit manualmente
      const paginatedRecords = allRecords.slice(offset, offset + limit);
      
      console.log(`✅ Encontrados ${paginatedRecords.length} posts (de un total de ${allRecords.length})`);
      return paginatedRecords.map(formatPostRecord);
    } catch (error) {
      console.error('❌ Error al obtener posts de Airtable:', error);
      console.log('📄 Devolviendo datos de ejemplo debido a error');
      return mockPosts; // Usar datos de ejemplo como fallback
    }
  },
  
  // Obtener un post específico por slug
  async getPostBySlug(slug) {
    try {
      if (!base) {
        console.log(`📄 Usando datos de ejemplo para post con slug: ${slug}`);
        return mockPosts.find(p => p.slug === slug) || null;
      }

      console.log(`📝 Buscando post con slug: ${slug}`);
      
      const records = await base('Posts')
        .select({
          filterByFormula: `AND({status}='published', {slug}='${slug}')`,
          maxRecords: 1,
        })
        .all();
      
      if (records.length === 0) {
        console.log(`❓ No se encontró post con slug: ${slug}`);
        return null;
      }
      
      console.log(`✅ Encontrado post con slug: ${slug}`);
      return formatPostRecord(records[0]);
    } catch (error) {
      console.error(`❌ Error al obtener post con slug ${slug} de Airtable:`, error);
      return mockPosts.find(p => p.slug === slug) || null;
    }
  },
  
  // Obtener todas las categorías
  async getCategories() {
    try {
      if (!base) {
        console.log('📄 Usando datos de ejemplo para categorías');
        return mockCategories;
      }

      console.log('📝 Consultando todas las categorías');
      
      // Verificación para ver si la tabla realmente existe
      const tables = await base.tables();
      const categoriesTable = tables.find(table => table.name === 'Categories');
      
      if (!categoriesTable) {
        console.warn('⚠️ Tabla Categories no encontrada en Airtable');
        return mockCategories;
      }
      
      const records = await base('Categories')
        .select({
          sort: [{ field: 'name', direction: 'asc' }],
        })
        .all();
      
      console.log(`✅ Encontradas ${records.length} categorías`);
      
      return records.map(record => ({
        id: record.id,
        name: record.get('name') || '',
        slug: record.get('slug') || '',
        description: record.get('description') || '',
      }));
    } catch (error) {
      console.error('❌ Error al obtener categorías de Airtable:', error);
      console.error('Detalles del error:', error.message);
      if (error.stack) console.error('Stack:', error.stack);
      return mockCategories;
    }
  },
  
  // Obtener todos los tags
  async getTags() {
    try {
      if (!base) {
        console.log('📄 Usando datos de ejemplo para tags');
        return mockTags;
      }

      console.log('📝 Consultando todos los tags');
      
      // Verificación para ver si la tabla realmente existe
      const tables = await base.tables();
      const tagsTable = tables.find(table => table.name === 'Tags');
      
      if (!tagsTable) {
        console.warn('⚠️ Tabla Tags no encontrada en Airtable');
        return mockTags;
      }
      
      const records = await base('Tags')
        .select({
          sort: [{ field: 'name', direction: 'asc' }],
        })
        .all();
      
      console.log(`✅ Encontrados ${records.length} tags`);
      
      return records.map(record => ({
        id: record.id,
        name: record.get('name') || '',
        slug: record.get('slug') || '',
      }));
    } catch (error) {
      console.error('❌ Error al obtener tags de Airtable:', error);
      return mockTags;
    }
  },
  
  // Lista de tablas disponibles
  async listTables() {
    try {
      if (!base) {
        return ['Posts (simulado)', 'Categories (simulado)', 'Tags (simulado)'];
      }
      
      const tables = await base.tables();
      return tables.map(table => table.name);
    } catch (error) {
      console.error('❌ Error al listar tablas de Airtable:', error);
      return [];
    }
  },

  // Obtener el conteo total de posts
  async getPostsCount({ category = null, tag = null } = {}) {
    try {
      if (!base) {
        console.log('📄 Usando datos de ejemplo para conteo de posts');
        return mockPosts.length;
      }

      let filterFormula = "{status}='published'";
      
      if (category) {
        filterFormula = `AND({status}='published', FIND('${category}', {categoriesString}))`;
      }
      
      if (tag) {
        filterFormula = `AND({status}='published', FIND('${tag}', {tagsString}))`;
      }
      
      console.log(`📊 Consultando conteo de posts con filtro: ${filterFormula}`);
      
      const query = await base('Posts')
        .select({
          filterByFormula: filterFormula,
          view: 'Grid view',
        });
      
      // Obtener el número total de registros que coinciden con el filtro
      const pageCount = await query.all();
      const total = pageCount.length;
      
      console.log(`✅ Total de posts encontrados: ${total}`);
      return total;
    } catch (error) {
      console.error('❌ Error al obtener conteo de posts de Airtable:', error);
      return mockPosts.length;
    }
  },
};

// Función para formatear los registros de posts
function formatPostRecord(record) {
  try {
    return {
      id: record.id,
      title: record.get('title') || '',
      slug: record.get('slug') || '',
      content: record.get('content') || '',
      excerpt: record.get('excerpt') || '',
      featuredImage: record.get('featuredImage') ? record.get('featuredImage')[0].url : null,
      publishDate: record.get('publishDate') || '',
      lastModified: record.get('lastModified') || '',
      categories: record.get('categories') || [],
      tags: record.get('tags') || [],
      seoTitle: record.get('seoTitle') || record.get('title') || '',
      seoDescription: record.get('seoDescription') || '',
      seoKeywords: record.get('seoKeywords') || '',
      adPositions: record.get('adPositions') || '',
      views: record.get('views') || 0,
    };
  } catch (error) {
    console.error('❌ Error al formatear registro de post:', error);
    return {
      id: record.id,
      title: 'Error al cargar post',
      slug: '',
      content: '',
      excerpt: 'No se pudo cargar la información del post correctamente.',
      featuredImage: null,
    };
  }
}

module.exports = airtableServer; 