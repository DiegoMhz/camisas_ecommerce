/**
 * Home.jsx
 * ---------
 * Página de inicio de la tienda GoodLuck.
 *
 * Secciones:
 *  1. HeroCarousel  — carrusel banner en la parte superior
 *  2. Destacados    — grid con los productos marcados como featured
 *  3. Todos los Productos — grid completo con todos los productos
 *
 * No recibe props. Obtiene los datos desde Supabase vía productService.
 *
 * Uso: Renderizado en la ruta "/" del router.
 */

import { useState, useEffect } from "react";
import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

export default function Home() {
  // Lista completa de productos cargados desde Supabase
  const [products, setProducts] = useState([]);

  // true mientras se espera la respuesta de Supabase
  const [loading, setLoading] = useState(true);

  // Mensaje de error si la consulta falla
  const [error, setError] = useState(null);

  // Al montar el componente, cargamos todos los productos una sola vez
  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Derivamos los destacados filtrando el array ya cargado (sin llamada extra)
  const featuredProducts = products.filter((p) => p.featured);

  // ── Estado de carga ──
  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-brand-muted text-sm uppercase tracking-widest animate-pulse">
          Cargando productos...
        </p>
      </main>
    );
  }

  // ── Estado de error ──
  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400 text-sm">Error al cargar productos: {error}</p>
      </main>
    );
  }

  return (
    <main>

      {/* ── Sección 1: Hero Carrusel ── */}
      <HeroCarousel />

      {/* ── Sección 2: Productos Destacados ── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        {/* Encabezado de sección con línea decorativa */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-brand-white text-2xl font-bold uppercase tracking-wider">
            Destacados
          </h2>
          <div className="flex-1 h-px bg-brand-gray" />
          <span className="text-brand-gold text-xs uppercase tracking-widest font-medium">
            Selección especial
          </span>
        </div>

        {/* Grid responsive: 2 columnas en móvil, 4 en desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Sección 3: Todos los Productos ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {/* Encabezado de sección */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-brand-white text-2xl font-bold uppercase tracking-wider">
            Toda la Colección
          </h2>
          <div className="flex-1 h-px bg-brand-gray" />
          <span className="text-brand-muted text-xs uppercase tracking-widest">
            {products.length} productos
          </span>
        </div>

        {/* Grid responsive: 2 columnas en móvil, 3 en tablet, 4 en desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </main>
  );
}
