import axios from 'axios';
import { absoluteUrl } from '@/lib/utils';

// Elimino los mockPosts y mockCategories

// Cliente para interactuar con nuestras API routes
const airtable = {
  // Obtener todos los posts publicados con filtrado mejorado
  async getPosts({ limit = 10, offset = 0, sortBy = 'publishDate', sortOrder = 'desc', category = '', search = '' }) {
    try {
      // Construir URL de la API con parámetros necesarios
      let url = `/api/posts?limit=${limit}&offset=${offset}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      // Si hay categoría, primero obtener todos los posts y filtrar en cliente
      // para garantizar coincidencias exactas
      const useClientFiltering = !!category;
      
      // Si vamos a filtrar en cliente, solicitamos más posts para compensar
      // los que se filtrarán después
      const apiLimit = useClientFiltering ? Math.max(limit * 3, 50) : limit;
      url = `/api/posts?limit=${apiLimit}&offset=${offset}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      
      // Añadir parámetro de búsqueda si existe
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      console.log(`Llamando a API: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      let posts = data.posts || [];
      
      // Filtrado preciso por categoría en el cliente
      if (category && posts.length > 0) {
        console.log(`Filtrando ${posts.length} posts por categoría "${category}" en cliente`);
        
        // Filtrar para asegurar coincidencias exactas con límites de palabra
        posts = posts.filter(post => {
          // Normalizar categorías para comparación
          const categoriesArray = typeof post.categories === 'string'
            ? post.categories.split(',').map(cat => cat.trim().toLowerCase())
            : Array.isArray(post.categories)
              ? post.categories.map(cat => typeof cat === 'string' ? cat.toLowerCase() : '')
              : [];
          
          // Verificar si la categoría exacta existe en el array
          return categoriesArray.includes(category.toLowerCase());
        });
        
        console.log(`Después del filtrado preciso quedan ${posts.length} posts`);
        
        // Aplicar límite después del filtrado
        posts = posts.slice(0, limit);
      }
      
      return posts;
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
};

export default airtable; 