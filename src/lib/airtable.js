import axios from 'axios';

// Acceso a las variables de entorno solo en servidor
// Esto evita exponer claves API en el cliente
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY; // Ya no usa NEXT_PUBLIC
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID; // Ya no usa NEXT_PUBLIC

// Función auxiliar para detectar entorno local
const isLocalEnvironment = () => {
  return typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
};

// Función auxiliar para detectar entorno servidor vs cliente
const isServer = () => {
  return typeof window === 'undefined';
};

// Cliente para interactuar con Airtable API
const airtable = {
  // Obtener todos los posts publicados con paginación
  async getPosts({ limit = 20, offset = 0, sortBy = 'publishDate', sortOrder = 'desc', category = '', search = '' }) {
    try {
      // En el servidor, conectamos directamente con Airtable
      if (isServer()) {
        return await this._getPostsDirectFromAirtable({ 
          limit, 
          offset, 
          category, 
          search,
          sortBy,
          sortOrder
        });
      }
      
      // En cliente o entorno local, SIEMPRE usar la API interna 
      // (eliminamos el fallback directo a Airtable desde cliente)
      const params = new URLSearchParams({
        limit,
        offset,
        category,
        search,
        sortBy,
        sortOrder
      });
      
      const response = await axios.get(`/api/posts?${params}`);
      
      // Procesar los datos
      const records = response.data.records || [];
      
      // Aplicar paginación
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
      console.error('Error al obtener posts:', error);
      return [];
    }
  },
  
  // Método para acceso directo a Airtable (solo usado por el servidor)
  async _getPostsDirectFromAirtable({ limit = 20, offset = 0, category = '', search = '', sortBy = 'publishDate', sortOrder = 'desc' }) {
    // Solo ejecutar en servidor para proteger las credenciales
    if (!isServer()) {
      console.error('Error: Intento de acceso directo a Airtable desde el cliente');
      return [];
    }
    
    try {
      // URL base de Airtable
      const airtableApiUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Posts`;
      
      // Crear fórmula de filtro
      let filterByFormula = "{status}='published'";
      
      if (category) {
        const escapedCategory = category.replace(/'/g, "\\'");
        filterByFormula = `AND({status}='published', FIND('${escapedCategory}', {categoriesString}))`;
      }
      
      if (search) {
        const escapedSearch = search.replace(/'/g, "\\'").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
        const searchFilter = `OR(FIND('${escapedSearch}', LOWER({title})), FIND('${escapedSearch}', LOWER({content})))`;
        filterByFormula = `AND(${filterByFormula}, ${searchFilter})`;
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
          'sort[0][field]': sortBy,
          'sort[0][direction]': sortOrder,
          pageSize: limit,
          offset: offset > 0 ? offset : undefined
        }
      };
      
      const response = await axios.get(airtableApiUrl, config);
      
      // Formatear los registros
      const formattedPosts = response.data.records.map(record => {
        const fields = record.fields;
        return {
          id: record.id,
          title: fields.title || '',
          slug: fields.slug || '',
          content: fields.content || '',
          excerpt: fields.excerpt || '',
          featuredImage: this._normalizeAirtableImage(fields.featuredImage),
          publishDate: fields.publishDate || '',
          author: fields.author || '',
          categories: fields.categories || [],
          tags: fields.tags || [],
          status: fields.status || 'draft',
          views: fields.views || 0,
          seoTitle: fields.seoTitle || '',
          seoDescription: fields.seoDescription || '',
          seoKeywords: fields.seoKeywords || ''
        };
      });
      
      return formattedPosts;
    } catch (error) {
      console.error('Error al obtener posts directamente de Airtable:', error);
      
      if (error.response) {
        console.error('Detalles del error:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      return [];
    }
  },
  
  // Obtener el conteo total de posts
  async getPostsCount({ category = null, tag = null } = {}) {
    try {
      // Verificar caché existente (sólo en cliente)
      const cacheKey = `postsCount_${category || 'all'}_${tag || 'all'}`;
      const cachedCount = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
      
      if (cachedCount) {
        try {
          const { count, timestamp } = JSON.parse(cachedCount);
          if (Date.now() - timestamp < 300000) { // 5 minutos
            return { total: count };
          }
        } catch (e) {
          console.warn('Error al leer caché de conteo:', e);
        }
      }
      
      // En servidor, conectar directo a Airtable
      if (isServer()) {
        return await this._getPostsCountDirect({ category, tag });
      }
      
      // En cliente, usar API interna
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (tag) params.append('tag', tag);
        
        const response = await axios.get(`/api/posts/count?${params}`);
        const total = response.data.total || 0;
        
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
        console.error('Error al obtener conteo desde API:', error);
        const fallbackEstimate = await this.estimatePostCount({ category, tag });
        return { total: fallbackEstimate };
      }
    } catch (error) {
      console.error('Error al obtener conteo de posts:', error);
      return { total: 0 };
    }
  },
  
  // Método directo para contar posts (solo servidor)
  async _getPostsCountDirect({ category = null, tag = null } = {}) {
    if (!isServer()) {
      console.error('Error: Intento de contar posts directamente desde el cliente');
      return { total: 0 };
    }
    
    try {
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
      
      const response = await axios.get(airtableApiUrl, config);
      const total = response.data.records.length;
      
      return { total };
    } catch (error) {
      console.error('Error al obtener conteo directo de Airtable:', error);
      return { total: 0 };
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
  
  // Obtener un post específico por slug
  async getPostBySlug(slug) {
    try {
      // En servidor, hacer petición directa
      if (isServer()) {
        return await this._getPostBySlugDirect(slug);
      }
      
      // En cliente, usar API interna
      const response = await axios.get(`/api/post/${slug}`);
      
      if (response.data && response.data.post) {
        return response.data.post;
      }
      
      return null;
    } catch (error) {
      console.error(`Error al obtener post con slug ${slug}:`, error);
      return null;
    }
  },
  
  // Método directo para obtener post por slug (solo servidor)
  async _getPostBySlugDirect(slug) {
    if (!isServer()) {
      console.error('Error: Intento de acceso directo a Airtable desde el cliente');
      return null;
    }
    
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
      
      // Formatear y normalizar datos
      return {
        id: record.id,
        title: fields.title || '',
        slug: fields.slug || '',
        content: fields.content || '',
        excerpt: fields.excerpt || '',
        featuredImage: this._normalizeAirtableImage(fields.featuredImage),
        publishDate: fields.publishDate || '',
        author: fields.author || '',
        categories: fields.categories || [],
        tags: fields.tags || [],
        status: fields.status || 'draft',
        views: fields.views || 0,
        seoTitle: fields.seoTitle || '',
        seoDescription: fields.seoDescription || '',
        seoKeywords: fields.seoKeywords || ''
      };
    } catch (error) {
      console.error(`Error al obtener post con slug ${slug} directamente de Airtable:`, error);
      return null;
    }
  },
  
  // Método para normalizar imágenes de Airtable
  _normalizeAirtableImage(attachmentField) {
    if (!attachmentField) return null;
    
    // Formato típico de campo attachment: array de objetos
    if (Array.isArray(attachmentField) && attachmentField.length > 0) {
      return {
        url: attachmentField[0].url || '',
        thumbnails: attachmentField[0].thumbnails || null,
        filename: attachmentField[0].filename || '',
        id: attachmentField[0].id || '',
        size: attachmentField[0].size || 0,
        type: attachmentField[0].type || ''
      };
    }
    
    // Para casos donde ya se ha extraído la URL
    if (typeof attachmentField === 'string') {
      return { url: attachmentField };
    }
    
    // Si es un objeto JSON serializado
    if (typeof attachmentField === 'string' && attachmentField.startsWith('{')) {
      try {
        return JSON.parse(attachmentField);
      } catch (e) {
        return { url: attachmentField };
      }
    }
    
    return attachmentField;
  },
  
  // Obtener todas las categorías
  async getCategories() {
    try {
      // En servidor, obtener directamente
      if (isServer()) {
        // Obtener todos los posts para extraer categorías
        const posts = await this._getPostsDirectFromAirtable({ limit: 100 });
        return this._extractCategoriesFromPosts(posts);
      }
      
      // En cliente, usar API interna
      try {
        const response = await axios.get('/api/categories');
        if (response.data && response.data.categories) {
          return response.data.categories;
        }
        throw new Error('Formato de respuesta inesperado');
      } catch (error) {
        console.error('Error en API de categorías:', error);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  },
  
  // Método auxiliar para extraer categorías de posts
  _extractCategoriesFromPosts(posts) {
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
  },
  
  // Obtener todos los tags
  async getTags() {
    try {
      // En servidor, obtener directamente
      if (isServer()) {
        const posts = await this._getPostsDirectFromAirtable({ limit: 100 });
        return this._extractTagsFromPosts(posts);
      }
      
      // En cliente, usar API interna
      try {
        const response = await axios.get('/api/tags');
        return response.data.tags;
      } catch (error) {
        console.error('Error en API de tags:', error);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener tags:', error);
      return [];
    }
  },
  
  // Método auxiliar para extraer tags de posts
  _extractTagsFromPosts(posts) {
    // Extraer tags únicos de los posts
    const tagMap = {};
    
    posts.forEach(post => {
      if (post.tags) {
        const tags = Array.isArray(post.tags) 
          ? post.tags 
          : post.tags.split(',').map(t => t.trim());
        
        tags.forEach(tag => {
          if (tag) {
            tagMap[tag] = (tagMap[tag] || 0) + 1;
          }
        });
      }
    });
    
    // Convertir a array para la respuesta
    const tags = Object.entries(tagMap).map(([name, count]) => ({ 
      name, 
      count,
      slug: name.toLowerCase()
    }));
    
    // Ordenar por cantidad de posts
    tags.sort((a, b) => b.count - a.count);
    
    return tags;
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