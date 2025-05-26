import { supabase } from '@/lib/supabase';

export async function uploadImageToSupabase(imageUrl) {
  try {
    // Obtener la imagen
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Generar nombre único
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const filePath = `images/${fileName}`;

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return null;
  }
} 