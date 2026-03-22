/**
 * supabase.js
 * ------------
 * Cliente de Supabase para GoodLuck E-Commerce.
 *
 * Centraliza la conexión a Supabase en un único lugar.
 * Todas las páginas y servicios que necesiten datos de la base de datos
 * deben importar `supabase` desde aquí.
 *
 * Las credenciales se leen desde las variables de entorno (.env):
 *  - VITE_SUPABASE_URL     → URL del proyecto en Supabase
 *  - VITE_SUPABASE_ANON_KEY → Clave pública (anon) del proyecto
 *
 * Vite expone las variables de entorno con el prefijo VITE_ a través de
 * `import.meta.env`. Nunca pongas las keys directamente en el código.
 */

import { createClient } from '@supabase/supabase-js';

/** URL del proyecto Supabase, leída desde .env */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

/** Clave pública anon, leída desde .env */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Instancia única del cliente de Supabase.
 * Exportada para ser usada en toda la app.
 *
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
