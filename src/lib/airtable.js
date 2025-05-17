import axios from 'axios';

// Acceso a las variables de entorno públicas
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

// Verificar si las variables de entorno están disponibles
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('Error: Variables de entorno de Airtable no configuradas correctamente');
}

// Cliente para interactuar directamente con Airtable API
const airtable = {
  // Obtener todos los posts publicados con paginación mejorada
  async getPosts({ limit = 20, offset = 0, sortBy = 'publishDate', sortOrder = 'desc', category = '', search = '' }) {
    try {
      // Verificar si las variables de entorno están disponibles
      if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
        throw new Error('Variables de entorno de Airtable no configuradas');
      }
      
      // URL base de Airtable
      const airtableApiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Posts`;
      
      // Función para escapar caracteres especiales
      const escapeAirtableValue = (value) => {
        if (!value) return '';
        return value.replace(/'/g, "\\'").replace(/\\/g, "\\\\");
      };
      
      // Crear objeto para parámetros de la consulta
      let params = {
        view: 'Grid view',
        pageSize: limit,
      };
      
      // Aplicar filtros a la consulta con escapado adecuado
      let filterByFormula = "{status}='published'";
      
      if (category) {
        const escapedCategory = escapeAirtableValue(category);
        filterByFormula = `AND({status}='published', FIND('${escapedCategory}', {categoriesString}))`;
      }
      
      if (search) {
        const escapedSearch = escapeAirtableValue(search);
        // Búsqueda en título o contenido
        filterByFormula = `AND({status}='published', OR(FIND('${escapedSearch}', LOWER({title})), FIND('${escapedSearch}', LOWER({content}))))`;
      }
      
      params.filterByFormula = filterByFormula;
      
      // Configurar ordenamiento
      const sortField = sortBy === 'publishDate' ? 'publishDate' : sortBy;
      params.sort = [{ field: sortField, direction: sortOrder === 'desc' ? 'desc' : 'asc' }];
      
      // Configuración para la petición
      const config = {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: params
      };
      
      // Realizar petición a Airtable
      const response = await axios.get(airtableApiUrl, config);
      
      // Procesar respuesta
      const records = response.data.records || [];
      
      // Aplicar paginación manualmente debido a limitaciones de la API de Airtable
      const paginatedRecords = records.slice(offset, offset + limit);
      
      // Formatear los registros a formato esperado por la aplicación
      const formattedPosts = paginatedRecords.map(record => {
        const fields = record.fields;
        return {
          id: record.id,
          title: fields.title || '',
          slug: fields.slug || '',
          content: fields.content || '',
          excerpt: fields.excerpt || '',
          featuredImage: fields.featuredImage || null,
          publishDate: fields.publishDate || '',
          author: fields.author || '',
          categories: fields.categories || [],
          tags: fields.tags || [],
          status: fields.status || 'draft',
          views: fields.views || 0
        };
      });
      
      return formattedPosts;
    } catch (error) {
      console.error('Error al obtener posts directamente de Airtable:', error);
      
      // Información de depuración adicional
      if (error.response) {
        console.error('Detalles de error de Airtable:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      // Intentar usar caché como fallback
      if (typeof window !== 'undefined') {
        const cachedAllPosts = sessionStorage.getItem('posts_all_nosearch');
        if (cachedAllPosts) {
          const { posts } = JSON.parse(cachedAllPosts);
          return posts.slice(offset, offset + limit);
        }
      }
      
      return [];
    }
  },
  
  // Obtener el conteo total de posts directamente de Airtable
  async getPostsCount({ category = null, tag = null } = {}) {
    try {
      // Crear una clave única para el caché
      const cacheKey = `postsCount_${category || 'all'}_${tag || 'all'}`;
      
      // Verificar caché existente
      const cachedCount = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
      if (cachedCount) {
        try {
          const { count, timestamp } = JSON.parse(cachedCount);
          if (Date.now() - timestamp < 300000) { // 5 minutos
            return { total: count };
          }
        } catch (e) {
          // Continuar si hay error al leer caché
        }
      }
      
      // URL base de Airtable
      const airtableApiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Posts`;
      
      // Función para escapar caracteres especiales en la fórmula
      const escapeAirtableValue = (value) => {
        if (!value) return '';
        // Escapar comillas simples duplicándolas y cualquier otro carácter especial
        return value.replace(/'/g, "\\'").replace(/\\/g, "\\\\");
      };
      
      // Crear fórmula de filtro con valores escapados
      let filterByFormula = "{status}='published'";
      
      if (category) {
        const escapedCategory = escapeAirtableValue(category);
        filterByFormula = `AND({status}='published', FIND('${escapedCategory}', {categoriesString}))`;
      }
      
      if (tag) {
        const escapedTag = escapeAirtableValue(tag);
        filterByFormula = `AND({status}='published', FIND('${escapedTag}', {tagsString}))`;
      }
      
      // Configuración para la petición
      const config = {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: {
          filterByFormula,
          view: 'Grid view',
          fields: ['id'] // Solo necesitamos el ID para contar
        }
      };
      
      console.log('Filtro aplicado:', filterByFormula); // Para depuración
      
      // Realizar petición a Airtable
      const response = await axios.get(airtableApiUrl, config);
      
      // Contar registros
      const total = response.data.records.length;
      
      // Guardar en caché
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({
            count: total,
            timestamp: Date.now()
          }));
        } catch (e) {
          // Error al guardar en caché, continuar
        }
      }
      
      return { total };
    } catch (error) {
      console.error('Error al obtener conteo directo de Airtable:', error);
      
      // Información de depuración adicional
      if (error.response) {
        console.error('Detalles de error de Airtable:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      const fallbackEstimate = await this.estimatePostCount({ category, tag });
      return { total: fallbackEstimate };
    }
  },
  
  // Método auxiliar para estimar el conteo total en caso de fallo
  async estimatePostCount({ category = null, tag = null } = {}) {
    try {
      const posts = await this.getPosts({
        limit: 20, 
        offset: 0,
        category,
        tag
      });
      
      if (posts.length < 20) {
        return posts.length;
      }
      
      return Math.max(posts.length * 2, 30);
    } catch (error) {
      console.error('Error al estimar conteo de posts:', error);
      return 12;
    }
  },
  
  // Obtener un post específico por slug directamente de Airtable
  async getPostBySlug(slug) {
    try {
      // URL base de Airtable
      const airtableApiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Posts`;
      
      // Crear fórmula de filtro para buscar por slug
      const filterByFormula = `AND({status}='published', {slug}='${slug}')`;
      
      // Configuración para la petición
      const config = {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: {
          filterByFormula,
          maxRecords: 1
        }
      };
      
      // Realizar petición a Airtable
      const response = await axios.get(airtableApiUrl, config);
      
      // Verificar si se encontró el post
      if (!response.data.records || response.data.records.length === 0) {
        return null;
      }
      
      // Formatear el registro
      const record = response.data.records[0];
      const fields = record.fields;
      
      return {
        id: record.id,
        title: fields.title || '',
        slug: fields.slug || '',
        content: fields.content || '',
        excerpt: fields.excerpt || '',
        featuredImage: fields.featuredImage || null,
        publishDate: fields.publishDate || '',
        author: fields.author || '',
        categories: fields.categories || [],
        tags: fields.tags || [],
        status: fields.status || 'draft',
        views: fields.views || 0
      };
    } catch (error) {
      console.error(`Error al obtener post con slug ${slug} directamente de Airtable:`, error);
      return null;
    }
  },
  
  // Obtener todas las categorías
  async getCategories() {
    try {
      // Obtener todos los posts para extraer categorías
      const posts = await this.getPosts({ limit: 100 });
      
      // Extraer categorías únicas de los posts
      const categoryMap = {};
      
      posts.forEach(post => {
        if (post.categories) {
          const categories = Array.isArray(post.categories) 
            ? post.categories 
            : post.categories.split(',').map(c => c.trim());
          
          categories.forEach(cat => {
            if (cat) {
              const formattedName = cat.charAt(0).toUpperCase() + cat.slice(1);
              categoryMap[formattedName] = (categoryMap[formattedName] || 0) + 1;
            }
          });
        }
      });
      
      // Convertir a array para la respuesta
      const categories = Object.entries(categoryMap).map(([name, count]) => ({ 
        name, 
        count,
        slug: name.toLowerCase()
      }));
      
      // Ordenar por cantidad de posts
      categories.sort((a, b) => b.count - a.count);
      
      return categories;
    } catch (error) {
      console.error('Error al obtener categorías directamente de Airtable:', error);
      return [];
    }
  },
  
  // Obtener todos los tags
  async getTags() {
    try {
      const response = await axios.get('/api/tags');
      return response.data.tags;
    } catch (error) {
      console.error('Error al obtener tags:', error);
      return [];
    }
  },
  
  // Método para carga progresiva de posts
  async getPostsBatch({ page = 1, batchSize = 20, sortBy = 'publishDate', sortOrder = 'desc' }) {
    try {
      const offset = (page - 1) * batchSize;
      
      // Obtener posts para este lote
      const posts = await this.getPosts({
        limit: batchSize,
        offset,
        sortBy,
        sortOrder
      });
      
      // Obtener conteo total para saber si hay más
      const { total } = await this.getPostsCount();
      
      // Determinar si hay más posts para cargar
      const hasMore = offset + posts.length < total;
      
      return {
        posts,
        hasMore,
        total
      };
    } catch (error) {
      console.error('Error al obtener lote de posts:', error);
      return { posts: [], hasMore: false, total: 0 };
    }
  },
};

export default airtable; 