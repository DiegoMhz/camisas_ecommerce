/**
 * Home.jsx
 * ---------
 * Página de inicio de la tienda GoodLuck.
 *
 * Secciones:
 *  1. HeroCarousel  — carrusel banner en la parte superior
 *  2. Destacados    — grid con los 4 productos marcados como featured
 *  3. Todos los Productos — grid completo con todos los productos
 *
 * No recibe props. Obtiene los datos desde src/data/products.js.
 *
 * Uso: Renderizado en la ruta "/" del router.
 */

import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";
import { products, getFeaturedProducts } from "../data/products";

export default function Home() {
  // Obtenemos solo los productos destacados para la primera sección
  const featuredProducts = getFeaturedProducts();

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
