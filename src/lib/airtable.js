import axios from 'axios';
import { absoluteUrl } from '@/lib/utils';

// Elimino los mockPosts y mockCategories

// Cliente para interactuar con nuestras API routes
const airtable = {
  // Obtener todos los posts publicados con paginación mejorada
  async getPosts({ limit = 20, offset = 0, sortBy = 'publishDate', sortOrder = 'desc', category = '', search = '' }) {
    try {
      // Construir URL de la API con parámetros necesarios
      let url = `/api/posts?limit=${limit}&offset=${offset}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      // Para búsquedas y categorías, usar el caché y filtrado local cuando sea posible
      const shouldUseServer = !category && !search;
      
      if (shouldUseServer) {
        // Sin filtros, podemos confiar en la paginación del servidor
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        console.log(`Llamando a API para paginación: ${url}`);
        
        try {
          const response = await fetch(url);
          
          if (!response.ok) {
            console.error(`Error en solicitud API: ${response.status} - ${response.statusText}`);
            // En lugar de lanzar un error fatal, buscaremos datos en caché o devolveremos un array vacío
            const cachedAllPosts = sessionStorage.getItem('posts_all_nosearch');
            if (cachedAllPosts) {
              console.log('Usando datos de caché como respaldo por error del servidor');
              const { posts } = JSON.parse(cachedAllPosts);
              return posts.slice(offset, offset + limit);
            }
            return [];
          }
          
          const data = await response.json();
          return data.posts || [];
        } catch (error) {
          console.error(`Error al procesar solicitud de posts: ${error.message}`);
          // Intentamos recuperar del error usando caché
          const cachedAllPosts = sessionStorage.getItem('posts_all_nosearch');
          if (cachedAllPosts) {
            console.log('Usando datos de caché como respaldo tras error de red');
            const { posts } = JSON.parse(cachedAllPosts);
            return posts.slice(offset, offset + limit);
          }
          return [];
        }
      } else {
        // Para filtros complejos, necesitamos más datos para filtrar en cliente
        // Implementamos un caché por categorías
        
        // Verificar si tenemos un caché específico para esta categoría
        const cacheKey = `posts_${category || 'all'}_${search || 'nosearch'}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        
        if (cachedData) {
          const { posts, timestamp } = JSON.parse(cachedData);
          // Caché válido por 5 minutos
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            console.log(`Usando caché específico para ${cacheKey}`);
            
            // Aplicar paginación y ordenamiento en cliente
            let filteredPosts = [...posts];
            
            if (sortBy === 'publishDate') {
              filteredPosts.sort((a, b) => {
                const dateA = new Date(a.publishDate || a.date || 0);
                const dateB = new Date(b.publishDate || b.date || 0);
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
              });
            } else if (sortBy === 'popular') {
              filteredPosts.sort((a, b) => {
                return sortOrder === 'desc' ? (b.views || 0) - (a.views || 0) : (a.views || 0) - (b.views || 0);
              });
            }
            
            return filteredPosts.slice(offset, offset + limit);
          }
        }
        
        // Si no hay caché, hacer una solicitud con un límite mayor para crear caché
        const fetchLimit = Math.min(200, limit * 4); // Limitar a 200 para no sobrecargar
        url = `/api/posts?limit=${fetchLimit}&offset=0&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        
        if (category) {
          url += `&category=${encodeURIComponent(category)}`;
        }
        
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        console.log(`Cargando posts para caché: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        let posts = data.posts || [];
        
        // Guardar en caché específico
        sessionStorage.setItem(cacheKey, JSON.stringify({
          posts,
          timestamp: Date.now()
        }));
        
        // Devolver solo la porción solicitada
        return posts.slice(0, limit);
      }
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return [];
    }
  },
  
  // Obtener el conteo total de posts con caché
  async getPostsCount({ category = null, tag = null } = {}) {
    try {
      // Crear una clave única para el caché
      const cacheKey = `postsCount_${category || 'all'}_${tag || 'all'}`;
      
      // Verificar caché existente
      const cachedCount = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
      if (cachedCount) {
        try {
          const { count, timestamp } = JSON.parse(cachedCount);
          // Caché válido por 5 minutos
          if (Date.now() - timestamp < 300000) {
            console.log(`Usando conteo en caché para ${cacheKey}: ${count}`);
            return { total: count };
          }
        } catch (e) {
          console.warn('Error al leer caché de conteo:', e);
        }
      }
      
      // Si hay categoría, debemos usar un enfoque diferente para contar con precisión
      if (category) {
        // Para categorías, obtener todos los posts y contar después del filtrado
        const allPosts = await this.getPosts({
          limit: 1000,  // Número alto para obtener la mayoría de posts
          offset: 0,
          category
        });
        
        const total = allPosts.length;
        
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
      }
      
      // Sin categoría, usar el endpoint de conteo normal
      let url = `/api/posts/count`;
      
      if (tag) {
        url += `?tag=${encodeURIComponent(tag)}`;
      }
      
      console.log(`Obteniendo conteo desde: ${url}`);
      
      try {
        const response = await axios.get(url);
        
        // Guardar en caché
        if (typeof window !== 'undefined' && response.data.total) {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({
              count: response.data.total,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.warn('Error al guardar caché de conteo:', e);
          }
        }
        
        return response.data;
      } catch (error) {
        console.error(`Error al obtener conteo desde API (${url}):`, error);
        const fallbackEstimate = await this.estimatePostCount({ category, tag });
        return { total: fallbackEstimate };
      }
    } catch (error) {
      console.error('Error general al obtener conteo de posts:', error);
      return { total: 12 };
    }
  },
  
  // Método auxiliar para estimar el conteo total en caso de fallo
  async estimatePostCount({ category = null, tag = null } = {}) {
    try {
      // Obtener un lote grande de posts para estimar
      const posts = await this.getPosts({
        limit: 20, 
        offset: 0,
        category,
        tag
      });
      
      // Si tenemos menos de 20, ese es probablemente el total
      if (posts.length < 20) {
        return posts.length;
      }
      
      // De lo contrario, asumimos que hay más - devolvemos un valor mayor
      return Math.max(posts.length * 2, 30);
    } catch (error) {
      console.error('Error al estimar conteo de posts:', error);
      return 12; // Valor predeterminado
    }
  },
  
  // Obtener un post específico por slug
  async getPostBySlug(slug) {
    try {
      // Verificamos si estamos en el cliente o en el servidor
      if (typeof window === 'undefined') {
        // Estamos en el servidor, usamos directamente el módulo
        // Pero asegurémonos de obtener la exportación correcta
        const { default: airtableServer } = require('./airtable-server');
        
        // Si el módulo es un objeto con getPostBySlug, úsalo directamente
        if (airtableServer && typeof airtableServer.getPostBySlug === 'function') {
          return await airtableServer.getPostBySlug(slug);
        }
        
        // Como alternativa, intentamos acceder directamente al módulo importado
        // ya que podría estar usando module.exports = {...}
        const serverModule = require('./airtable-server');
        if (typeof serverModule.getPostBySlug === 'function') {
          return await serverModule.getPostBySlug(slug);
        }
        
        // Si todo falla, buscar en los mockPosts
        console.error('No se pudo encontrar el método getPostBySlug en airtable-server');
        const mockPosts = require('./airtable-server').mockPosts || [];
        return mockPosts.find(p => p.slug === slug) || null;
      } else {
        // Estamos en el cliente, usamos axios con la ruta relativa
        const response = await axios.get(`/api/posts/${slug}`);
        return response.data.post;
      }
    } catch (error) {
      console.error('Error al obtener post por slug:', error);
      return null;
    }
  },
  
  // Obtener todas las categorías
  async getCategories() {
    try {
      const response = await axios.get('/api/categories');
      return response.data.categories;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return []; // Devolvemos array vacío en lugar de mockData
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
  
  // Nuevo método para carga progresiva
  async getPostsBatch({ page = 1, batchSize = 20, sortBy = 'publishDate', sortOrder = 'desc' }) {
    try {
      const offset = (page - 1) * batchSize;
      const url = `/api/posts/batch?page=${page}&batchSize=${batchSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      console.log(`Solicitando lote #${page} (${batchSize} posts)`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        posts: data.posts || [],
        hasMore: data.hasMore || false,
        total: data.total || 0
      };
    } catch (error) {
      console.error('Error al obtener lote de posts:', error);
      return { posts: [], hasMore: false, total: 0 };
    }
  },
};

export default airtable; 