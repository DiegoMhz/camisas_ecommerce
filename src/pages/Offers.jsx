/**
 * Offers.jsx
 * -----------
 * Página de ofertas y promociones de GoodLuck (/ofertas).
 *
 * Muestra únicamente los productos que tienen un precio original mayor
 * al precio actual (es decir, productos con descuento activo).
 *
 * Secciones:
 *  - Banner de cabecera con título y descripción
 *  - Contador de cuántas ofertas hay disponibles
 *  - Grid de productos en oferta usando ProductCard
 *
 * No recibe props. Filtra los datos desde products.js.
 *
 * Uso: Renderizado en la ruta "/ofertas" del router.
 */

import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Offers() {
  const navigate = useNavigate();

  // Filtramos solo los productos que tienen descuento activo
  // Un producto tiene descuento cuando originalPrice existe y es mayor al precio actual
  const offerProducts = products.filter(
    (p) => p.originalPrice !== null && p.originalPrice > p.price
  );

  return (
    <main>

      {/* ── Banner de cabecera ── */}
      <div className="relative bg-brand-dark border-b border-brand-gray overflow-hidden">
        {/* Fondo decorativo: gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            {/* Etiqueta superior */}
            <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium mb-2">
              Tiempo limitado
            </p>
            <h1 className="text-brand-white text-4xl font-bold mb-2">
              Ofertas Especiales
            </h1>
            <p className="text-brand-muted max-w-md">
              Descuentos exclusivos en nuestra selección de camisas. No te los pierdas.
            </p>
          </div>

          {/* Badge con cantidad de ofertas disponibles */}
          <div className="bg-brand-gold/10 border border-brand-gold/30 px-6 py-4 text-center flex-shrink-0">
            <p className="text-brand-gold text-4xl font-bold">{offerProducts.length}</p>
            <p className="text-brand-muted text-xs uppercase tracking-wider mt-1">
              {offerProducts.length === 1 ? "oferta disponible" : "ofertas disponibles"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Grid de productos en oferta ── */}
      <section className="max-w-6xl mx-auto px-4 py-12">

        {offerProducts.length === 0 ? (
          /* Mensaje cuando no hay ofertas activas */
          <div className="text-center py-20">
            <p className="text-brand-muted text-lg mb-4">
              No hay ofertas disponibles en este momento.
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-brand-gold underline text-sm"
            >
              Ver toda la colección
            </button>
          </div>
        ) : (
          <>
            {/* Encabezado del grid con información del descuento */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-brand-white text-xl font-bold uppercase tracking-wider">
                Productos en Oferta
              </h2>
              <div className="flex-1 h-px bg-brand-gray" />
              {/* Indicador visual de ahorro */}
              <span className="flex items-center gap-1 text-brand-gold text-xs uppercase tracking-wider font-medium">
                {/* Icono de etiqueta de precio */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
                Precios rebajados
              </span>
            </div>

            {/* Grid responsive igual que en Home */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {offerProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Enlace para ver toda la colección */}
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/")}
                className="border border-brand-gray text-brand-muted hover:border-brand-gold hover:text-brand-gold transition-colors text-sm uppercase tracking-wider px-8 py-3"
              >
                Ver toda la colección
              </button>
            </div>
          </>
        )}
      </section>

    </main>
  );
}
