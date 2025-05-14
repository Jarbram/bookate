/**
 * Genera una URL absoluta
 * @param {string} path - La ruta relativa
 * @param {Request} [req] - Objeto de solicitud (opcional)
 * @returns {string} URL absoluta
 */
export function absoluteUrl(path, req) {
  // Si estamos en el cliente, simplemente devolvemos la URL relativa
  if (typeof window !== 'undefined') return path;
  
  // En el servidor, construimos la URL absoluta
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (req ? `${req.protocol}://${req.headers.host}` : 'http://localhost:3000');
  
  return `${baseUrl}${path}`;
} 