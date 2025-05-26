import { createClient } from '@supabase/supabase-js'

// Validar variables de entorno
const validateEnvVars = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Error de configuración: Faltan variables de entorno de Supabase. ' +
      'Asegúrate de que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén definidas.'
    )
  }

  return { supabaseUrl, supabaseKey }
}

// Configuración del cliente
const createSupabaseClient = () => {
  const { supabaseUrl, supabaseKey } = validateEnvVars()

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'blog'
      }
    }
  })
}

// Exportar cliente inicializado
export const supabase = createSupabaseClient()

// Exportar función de reinicialización para testing
export const reinitializeSupabase = () => createSupabaseClient() 