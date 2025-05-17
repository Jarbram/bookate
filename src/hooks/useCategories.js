import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import airtable from '../lib/airtable';

// Función auxiliar para normalizar categorías
export const normalizeCategoryString = (categoryString) => {
  if (!categoryString) return [];
  
  return typeof categoryString === 'string'
    ? categoryString.split(',').map(cat => cat.trim().toLowerCase()).filter(Boolean)
    : Array.isArray(categoryString)
      ? categoryString.map(cat => typeof cat === 'string' ? cat.trim().toLowerCase() : '').filter(Boolean)
      : [];
};

export default function useCategories({ onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get('category') || '';
  
  // Manejo de selección de categoría con acción instantánea
  const handleCategoryClick = useCallback((categoryName) => {
    // Acción instantánea: establecer la categoría inmediatamente
    if (currentCategory === categoryName) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('category');
      params.delete('page'); // Aseguramos que volvemos a página 1
      router.push(`?${params.toString()}`, { scroll: false }); // Evita scroll automático
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', categoryName);
      params.delete('page'); // Aseguramos que volvemos a página 1
      router.push(`?${params.toString()}`, { scroll: false }); // Evita scroll automático
    }
    
    // Emisión de evento para PostGrid y otros componentes interesados
    const event = new CustomEvent('categoryChanged', { 
      detail: { 
        category: categoryName,
        previousCategory: currentCategory,
        immediate: true // Indicar que es acción inmediata
      } 
    });
    window.dispatchEvent(event);
    
    // Notificar al componente padre si se proporcionó callback
    if (typeof onCategoryChange === 'function') {
      onCategoryChange(categoryName, true); // Segundo parámetro indica acción inmediata
    }
  }, [currentCategory, searchParams, router, onCategoryChange]);
  
  // Optimización del fetch y procesamiento de categorías
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      
      // Usar sessionStorage para cachear resultados temporalmente
      const cachedData = sessionStorage.getItem('blogCategories');
      if (cachedData) {
        const { categories: cachedCategories, timestamp } = JSON.parse(cachedData);
        // Si el caché es menor a 5 minutos, usarlo
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setCategories(cachedCategories);
          setLoading(false);
          return;
        }
      }
      
      // Obtener todos los posts para extraer categorías
      const allPosts = await airtable.getPosts({ limit: 100 });
      
      // Extraer categorías con mejor normalización
      const categoryMap = {};
      
      allPosts.forEach(post => {
        if (post.categories) {
          // Normalizar categorías con nuestra función auxiliar
          const categoriesArray = normalizeCategoryString(post.categories);
          
          // Incrementar contador para cada categoría
          categoriesArray.forEach(cat => {
            if (cat) {
              // Capitalizar primera letra para mostrar
              const formattedName = cat.charAt(0).toUpperCase() + cat.slice(1);
              categoryMap[formattedName] = (categoryMap[formattedName] || 0) + 1;
            }
          });
        }
      });
      
      // Convertir a array para mostrar
      const categoryArray = Object.entries(categoryMap).map(([name, count]) => ({ 
        name, 
        count,
        slug: name.toLowerCase() // Añadir slug para comparaciones
      }));
      
      // Ordenar por cantidad de posts (mayor a menor)
      categoryArray.sort((a, b) => b.count - a.count);
      
      // Guardar en sessionStorage
      sessionStorage.setItem('blogCategories', JSON.stringify({
        categories: categoryArray,
        timestamp: Date.now()
      }));
      
      setCategories(categoryArray);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError(true);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Optimización: Memoizar las categorías ordenadas con la seleccionada al principio
  const orderedCategories = useMemo(() => {
    if (!currentCategory || categories.length === 0) return categories;
    
    // Clonar el array para no mutar el original
    const result = [...categories];
    
    // Normalizar la categoría actual para comparación
    const normalizedCurrentCategory = currentCategory.toLowerCase().trim();
    
    // Encontrar el índice de la categoría seleccionada
    const selectedIndex = result.findIndex(cat => 
      cat.slug === normalizedCurrentCategory || 
      cat.name.toLowerCase() === normalizedCurrentCategory
    );
    
    // Si se encontró, moverla al principio
    if (selectedIndex !== -1) {
      const [selected] = result.splice(selectedIndex, 1);
      result.unshift(selected);
    }
    
    return result;
  }, [categories, currentCategory]);
  
  // Función auxiliar para determinar si una categoría está seleccionada
  const isCategorySelected = useCallback((category) => {
    if (!currentCategory) return false;
    const normalizedCurrentCategory = currentCategory.toLowerCase().trim();
    return category.slug === normalizedCurrentCategory || 
           category.name.toLowerCase() === normalizedCurrentCategory;
  }, [currentCategory]);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  return {
    categories,
    orderedCategories,
    loading,
    error,
    currentCategory,
    handleCategoryClick,
    isCategorySelected
  };
} 