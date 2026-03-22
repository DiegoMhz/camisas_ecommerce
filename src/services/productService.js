/**
 * productService.js
 * ------------------
 * Funciones para obtener productos desde Supabase.
 *
 * Centraliza todas las consultas relacionadas a la tabla `products`.
 * También convierte los nombres de columna de snake_case (como los usa
 * Supabase/PostgreSQL) a camelCase (como los usa el resto de la app).
 *
 * Ejemplo de conversión:
 *   original_price  →  originalPrice
 *
 * Todas las funciones son async y devuelven Promesas.
 * En caso de error de Supabase, lanzan una excepción con el mensaje del error.
 */

import { supabase } from '../lib/supabase';

/**
 * Convierte una fila de la tabla `products` de Supabase
 * al formato camelCase que usa la app internamente.
 *
 * @param {object} row - Fila cruda devuelta por Supabase
 * @returns {object} Producto con formato camelCase
 */
function mapProduct(row) {
  return {
    id:            row.id,
    name:          row.name,
    price:         Number(row.price),
    // original_price puede ser null si no hay descuento
    originalPrice: row.original_price ? Number(row.original_price) : null,
    category:      row.category,
    sizes:         row.sizes,       // text[] de Supabase → array JS
    images:        row.images,      // text[] de Supabase → array JS
    description:   row.description,
    featured:      row.featured,
  };
}

/**
 * Obtiene todos los productos del catálogo, ordenados por fecha de creación.
 *
 * @returns {Promise<object[]>} Lista de todos los productos
 * @throws {Error} Si la consulta a Supabase falla
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at');

  if (error) throw new Error(error.message);
  return data.map(mapProduct);
}

/**
 * Obtiene un producto específico por su ID (UUID).
 * Devuelve null si el producto no existe (en vez de lanzar error).
 *
 * @param {string} id - UUID del producto
 * @returns {Promise<object|null>} El producto encontrado, o null
 */
export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  // .single() lanza error si no encuentra filas — lo tratamos como "no encontrado"
  if (error) return null;
  return mapProduct(data);
}

/**
 * Obtiene los productos que tienen un precio rebajado
 * (original_price no es null y es mayor al precio actual).
 *
 * @returns {Promise<object[]>} Lista de productos en oferta
 * @throws {Error} Si la consulta a Supabase falla
 */
export async function getOfferProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .not('original_price', 'is', null)
    .order('created_at');

  if (error) throw new Error(error.message);

  // Filtramos en JS para asegurarnos que original_price > price
  return data.map(mapProduct).filter(p => p.originalPrice > p.price);
}
