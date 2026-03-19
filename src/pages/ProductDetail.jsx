/**
 * ProductDetail.jsx
 * ------------------
 * Página de detalle de un producto específico.
 *
 * Obtiene el ID del producto desde la URL (parámetro :id del router)
 * y busca el producto correspondiente en los datos mock.
 *
 * Muestra:
 *  - Botón "← Volver" para regresar a la página anterior
 *  - Galería de imágenes: imagen principal + miniaturas seleccionables
 *  - Nombre, precio (con precio tachado si hay descuento)
 *  - Descripción del producto
 *  - Selector de talla (botones toggle)
 *  - Botón "Agregar al carrito" (solo visual en el Paso 1)
 *
 * No recibe props. Lee el ID desde useParams().
 *
 * Uso: Renderizado en la ruta "/producto/:id" del router.
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../data/products";

export default function ProductDetail() {
  // useParams extrae el :id de la URL (ej: /producto/3 → id = "3")
  const { id } = useParams();

  // useNavigate permite navegar hacia atrás o a otras rutas
  const navigate = useNavigate();

  // Buscamos el producto por ID en los datos mock
  const product = getProductById(id);

  // Estado: índice de la imagen actualmente seleccionada en la galería
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Estado: talla actualmente seleccionada por el usuario
  const [selectedSize, setSelectedSize] = useState(null);

  // Si el producto no existe (ID inválido), mostramos un mensaje de error
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-brand-muted text-lg">Producto no encontrado.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-brand-gold underline"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // Comprobamos si hay descuento para mostrar el precio tachado
  const hasDiscount = product.originalPrice !== null && product.originalPrice > product.price;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Botón Volver ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-colors mb-8 text-sm uppercase tracking-wider"
      >
        {/* Flecha hacia la izquierda */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver
      </button>

      {/* ── Layout principal: galería a la izquierda, info a la derecha ── */}
      {/* En móvil se apila verticalmente; en desktop son 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ── Columna izquierda: Galería de imágenes ── */}
        <div className="flex flex-col gap-3">
          {/* Imagen principal (la que está seleccionada actualmente) */}
          <div className="aspect-[4/5] overflow-hidden bg-brand-dark">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Miniaturas: clic en una miniatura cambia la imagen principal */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? "border-brand-gold"     // borde dorado si está seleccionada
                      : "border-brand-gray hover:border-brand-muted"
                  }`}
                >
                  <img src={img} alt={`Vista ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Columna derecha: Información del producto ── */}
        <div className="flex flex-col">
          {/* Nombre */}
          <h1 className="text-brand-white text-3xl font-bold mb-3">
            {product.name}
          </h1>

          {/* Precio */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-brand-gold text-3xl font-bold">
              ${product.price}
            </span>
            {/* Precio original tachado (solo si hay descuento) */}
            {hasDiscount && (
              <span className="text-brand-muted text-xl line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Separador */}
          <div className="h-px bg-brand-gray mb-5" />

          {/* Descripción */}
          <p className="text-brand-muted text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          {/* ── Selector de Talla ── */}
          <div className="mb-8">
            <p className="text-brand-white text-sm font-semibold uppercase tracking-wider mb-3">
              Talla
              {/* Muestra la talla seleccionada junto al título */}
              {selectedSize && (
                <span className="text-brand-gold ml-2 normal-case tracking-normal font-normal">
                  — {selectedSize}
                </span>
              )}
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? "border-brand-gold bg-brand-gold text-black"  // talla seleccionada
                      : "border-brand-gray text-brand-white hover:border-brand-muted"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ── Botón Agregar al Carrito ── */}
          {/* En el Paso 1 solo es visual. En el Paso 2 tendrá funcionalidad. */}
          <button
            className="bg-brand-gold text-black font-bold uppercase tracking-widest py-4 hover:bg-yellow-400 transition-colors text-sm"
          >
            Agregar al carrito
          </button>

          {/* Nota de categoría */}
          <p className="text-brand-muted text-xs mt-4 capitalize">
            Categoría: <span className="text-brand-white">{product.category}</span>
          </p>
        </div>

      </div>
    </main>
  );
}
