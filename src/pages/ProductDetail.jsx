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
 *  - Botón "Agregar al carrito" — funcional, usa CartContext
 *
 * No recibe props. Lee el ID desde useParams() y consulta Supabase.
 *
 * Uso: Renderizado en la ruta "/producto/:id" del router.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  // useParams extrae el :id de la URL (UUID del producto)
  const { id } = useParams();

  // useNavigate permite navegar hacia atrás o a otras rutas
  const navigate = useNavigate();

  // Accedemos al dispatch del carrito para poder agregar productos
  const { dispatch } = useCart();

  // Producto cargado desde Supabase (null mientras carga o si no existe)
  const [product, setProduct] = useState(null);

  // true mientras se espera la respuesta de Supabase
  const [loading, setLoading] = useState(true);

  // Estado: índice de la imagen actualmente seleccionada en la galería
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Estado: talla actualmente seleccionada por el usuario
  const [selectedSize, setSelectedSize] = useState(null);

  // Estado: controla si se muestra el mensaje de confirmación "¡Agregado!"
  const [added, setAdded] = useState(false);

  // Cargamos el producto cuando cambia el ID de la URL
  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setSelectedImageIndex(0);
    setSelectedSize(null);
    getProductById(id)
      .then((data) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Estado de carga ──
  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-brand-muted text-sm uppercase tracking-widest animate-pulse">
          Cargando producto...
        </p>
      </main>
    );
  }

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

  /**
   * Agrega el producto al carrito.
   * Valida que el usuario haya seleccionado una talla antes de agregar.
   * Muestra un mensaje de confirmación durante 2 segundos.
   */
  function handleAddToCart() {
    // Si no se seleccionó talla, no hacemos nada (el UI ya muestra el indicador)
    if (!selectedSize) return;

    // Despachamos la acción al CartContext
    dispatch({
      type: "ADD_ITEM",
      payload: { product, size: selectedSize },
    });

    // Mostramos el mensaje de confirmación "¡Agregado!"
    setAdded(true);

    // Después de 2 segundos, volvemos al estado normal del botón
    setTimeout(() => setAdded(false), 2000);
  }

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
                  <img src={img} alt={`Vista ${index + 1}`} loading="lazy" className="w-full h-full object-cover" />
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
              {/* Aviso si el usuario intentó agregar sin elegir talla */}
              {!selectedSize && added === false && (
                <span className="text-brand-muted ml-2 normal-case tracking-normal font-normal text-xs">
                  (selecciona una)
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
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`font-bold uppercase tracking-widest py-4 transition-colors text-sm ${
              added
                ? "bg-green-500 text-white"           // estado: recién agregado
                : selectedSize
                  ? "bg-brand-gold text-black hover:bg-yellow-400"  // estado: listo para agregar
                  : "bg-brand-gray text-brand-muted cursor-not-allowed"  // estado: sin talla elegida
            }`}
          >
            {/* El texto del botón cambia según el estado */}
            {added ? "¡Agregado al carrito!" : "Agregar al carrito"}
          </button>

          {/* Enlace rápido al carrito (aparece solo después de agregar) */}
          {added && (
            <button
              onClick={() => navigate("/carrito")}
              className="mt-2 text-brand-gold text-sm underline text-center"
            >
              Ver carrito →
            </button>
          )}

          {/* Nota de categoría */}
          <p className="text-brand-muted text-xs mt-4 capitalize">
            Categoría: <span className="text-brand-white">{product.category}</span>
          </p>
        </div>

      </div>
    </main>
  );
}
