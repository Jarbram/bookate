import axios from 'axios';

// Acceso a las variables de entorno públicas
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

// Cliente para interactuar directamente con Airtable API
const airtable = {
  // Obtener todos los posts publicados con paginación mejorada
  async getPosts({ limit = 20, offset = 0, sortBy = 'publishDate', sortOrder = 'desc', category = '', search = '' }) {
    try {
      console.log(`Iniciando petición a API interna con parámetros:`, { limit, offset, category, search });
      
      // Llamar a nuestra API en lugar de Airtable directamente
      const params = new URLSearchParams({
        limit,
        offset,
        category,
        search
      });
      
      const response = await axios.get(`/api/posts?${params}`);
      
      // Procesar los datos como antes...
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
      
      console.log(`Respuesta recibida con ${formattedPosts.length} posts`);
      
      return formattedPosts;
    } catch (error) {
      console.error('Error al obtener posts desde API interna:', error);
      return { posts: [], hasMore: false, total: 0 };
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
            console.log(`Usando conteo en caché para ${cacheKey}: ${count}`);
            return { total: count };
          }
        } catch (e) {
          console.warn('Error al leer caché de conteo:', e);
        }
      }
      
      // URL base de Airtable
      const airtableApiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Posts`;
      
      // Crear fórmula de filtro
      let filterByFormula = "{status}='published'";
      
      if (category) {
        filterByFormula = `AND({status}='published', FIND('${category}', {categoriesString}))`;
      }
      
      if (tag) {
        filterByFormula = `AND({status}='published', FIND('${tag}', {tagsString}))`;
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
      
      console.log(`Obteniendo conteo directo desde Airtable`);
      
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
          console.warn('Error al guardar caché de conteo:', e);
        }
      }
      
      return { total };
    } catch (error) {
      console.error('Error al obtener conteo directo de Airtable:', error);
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
      
      console.log(`Buscando post con slug: ${slug} directamente en Airtable`);
      
      // Realizar petición a Airtable
      const response = await axios.get(airtableApiUrl, config);
      
      // Verificar si se encontró el post
      if (!response.data.records || response.data.records.length === 0) {
        console.log(`No se encontró post con slug: ${slug}`);
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