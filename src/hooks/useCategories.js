import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Función utilitaria para normalizar strings de categorías
export function normalizeCategoryString(category) {
  return category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('categories')
        .eq('status', 'published');

      if (error) throw error;

      // Crear un mapa para contar las ocurrencias de cada categoría
      const categoryCount = {};
      postsData.forEach(post => {
        post.categories.forEach(category => {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
      });

      // Convertir el mapa en un array de objetos de categoría
      return Object.entries(categoryCount).map(([category, count]) => ({
        id: category,
        name: category,
        slug: normalizeCategoryString(category),
        count: count
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  });
}