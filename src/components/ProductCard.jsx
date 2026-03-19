/**
 * ProductCard.jsx
 * ----------------
 * Tarjeta visual de un producto individual en el grid.
 *
 * Muestra:
 *  - Imagen del producto con efecto zoom al pasar el cursor
 *  - Badge "OFERTA" si el producto tiene un precio original (descuento)
 *  - Nombre del producto
 *  - Precio actual y precio tachado (si aplica descuento)
 *  - Botón "Ver más" que navega al detalle del producto
 *
 * Props:
 *  - product (object): objeto de producto con la estructura definida en products.js
 *    Campos usados: id, name, price, originalPrice, images
 *
 * Uso: <ProductCard product={producto} />
 */

import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  // useNavigate nos permite navegar a otra ruta de forma programática
  const navigate = useNavigate();

  // La primera imagen del array es la imagen principal de la tarjeta
  const mainImage = product.images[0];

  // Calcula si hay descuento para mostrar el badge y el precio tachado
  const hasDiscount = product.originalPrice !== null && product.originalPrice > product.price;

  return (
    <div className="bg-brand-dark border border-brand-gray group overflow-hidden flex flex-col">

      {/* ── Contenedor de imagen ── */}
      {/* overflow-hidden para que el zoom no desborde la tarjeta */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badge de "OFERTA" — solo aparece si hay descuento */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-brand-gold text-black text-xs font-bold uppercase px-2 py-1 tracking-wider">
            Oferta
          </span>
        )}
      </div>

      {/* ── Información del producto ── */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-brand-white font-semibold text-base mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Precio: si hay descuento muestra el precio original tachado */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-brand-gold font-bold text-lg">
            ${product.price}
          </span>
          {hasDiscount && (
            <span className="text-brand-muted text-sm line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Botón que lleva al detalle del producto */}
        {/* mt-auto empuja el botón al final de la tarjeta */}
        <button
          onClick={() => navigate(`/producto/${product.id}`)}
          className="mt-auto bg-transparent border border-brand-gold text-brand-gold text-sm uppercase tracking-wider py-2 hover:bg-brand-gold hover:text-black transition-colors font-medium"
        >
          Ver más
        </button>
      </div>

    </div>
  );
}
