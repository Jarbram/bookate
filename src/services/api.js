import { supabase } from '@/lib/supabase';

export const api = {
  posts: {
    async getAll({ limit = 20, offset = 0, category = '', search = '', sortBy = 'publishDate', sortOrder = 'desc' } = {}) {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('status', 'published');

      if (category) {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      const { data: records, error } = await query
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return records;
    },

    async getBySlug(slug) {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories:posts_categories(categories(*)),
          tags:posts_tags(tags(*))
        `)
        .eq('status', 'published')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },

    async getCount({ category = '', tag = '' } = {}) {
      let query = supabase
        .from('posts')
        .select('id', { count: 'exact' })
        .eq('status', 'published');

      if (category) {
        query = query.contains('categories.categories.slug', [category]);
      }

      if (tag) {
        query = query.contains('tags.tags.slug', [tag]);
      }

      const { count, error } = await query;
      if (error) throw error;
      return count;
    }
  },

  categories: {
    async getAll() {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('name, slug, id')
        .eq('status', 'published');

      if (error) throw error;

      const { data: postsCount, error: countError } = await supabase
        .from('posts_categories')
        .select('category_id, count', { count: 'exact' })
        .group_by('category_id');

      if (countError) throw countError;

      return categories.map(category => ({
        ...category,
        count: postsCount.find(p => p.category_id === category.id)?.count || 0
      }));
    }
  },

  tags: {
    async getAll() {
      const { data: tags, error } = await supabase
        .from('tags')
        .select(`
          name,
          slug,
          posts_tags(count)
        `)
        .eq('status', 'published');

      if (error) throw error;

      return tags.map(tag => ({
        name: tag.name,
        slug: tag.slug,
        count: tag.posts_tags?.length || 0
      }));
    }
  },

  subscribers: {
    async create(email) {
      const { data, error } = await supabase
        .from('subscribers')
        .select('email')
        .eq('email', email)
        .single();

      if (data) {
        return { success: true, message: 'Ya estás suscrito a nuestro newsletter' };
      }

      const { error: insertError } = await supabase
        .from('subscribers')
        .insert([{ email, status: 'active' }]);

      if (insertError) throw insertError;

      return { 
        success: true, 
        message: '¡Gracias por suscribirte!' 
      };
    }
  }
}; 