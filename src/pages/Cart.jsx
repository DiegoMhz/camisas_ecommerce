/**
 * Cart.jsx
 * ---------
 * Página del carrito de compras (/carrito).
 *
 * Muestra:
 *  - Lista de productos agregados al carrito con imagen, nombre, talla y precio
 *  - Controles de cantidad: botones [−] y [+] para cambiar la cantidad
 *  - Botón de eliminar para quitar un producto del carrito
 *  - Resumen con el subtotal total
 *  - Botón "Proceder al pago" → navega a /checkout (Paso 3)
 *  - Botón "Seguir comprando" → regresa al inicio
 *  - Mensaje especial si el carrito está vacío
 *
 * No recibe props. Lee el estado del carrito desde useCart().
 *
 * Uso: Renderizado en la ruta "/carrito" del router.
 */

import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();

  // Extraemos lo que necesitamos del contexto del carrito
  const { cartState, dispatch, totalItems, totalPrice } = useCart();

  // ── Handlers de acciones ──

  /**
   * Incrementa en 1 la cantidad de un item.
   * @param {object} item - El item del carrito a modificar
   */
  function handleIncrease(item) {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: item.id, size: item.size, quantity: item.quantity + 1 },
    });
  }

  /**
   * Decrementa en 1 la cantidad de un item.
   * Si llega a 0, el reducer lo elimina automáticamente.
   * @param {object} item - El item del carrito a modificar
   */
  function handleDecrease(item) {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: item.id, size: item.size, quantity: item.quantity - 1 },
    });
  }

  /**
   * Elimina completamente un item del carrito.
   * @param {object} item - El item a eliminar
   */
  function handleRemove(item) {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { id: item.id, size: item.size },
    });
  }

  // ── Carrito vacío ──
  // Si no hay items, mostramos un mensaje y un enlace para seguir comprando
  if (cartState.items.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        {/* Icono de bolsa vacía */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-20 h-20 text-brand-gray mx-auto mb-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
          />
        </svg>
        <h2 className="text-brand-white text-2xl font-bold mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-brand-muted mb-8">
          Agrega productos para comenzar tu compra.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-brand-gold text-black font-bold uppercase tracking-widest px-8 py-3 hover:bg-yellow-400 transition-colors text-sm"
        >
          Explorar productos
        </button>
      </main>
    );
  }

  // ── Carrito con items ──
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">

      {/* Encabezado de la página */}
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-brand-white text-2xl font-bold uppercase tracking-wider">
          Tu Carrito
        </h1>
        <span className="text-brand-muted text-sm">
          ({totalItems} {totalItems === 1 ? "producto" : "productos"})
        </span>
      </div>

      {/* Layout: lista de items a la izquierda, resumen a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Columna izquierda: Lista de items (ocupa 2/3 del ancho en desktop) ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartState.items.map((item) => (
            // Clave única: combinamos id + talla para diferenciar misma prenda en distinta talla
            <div
              key={`${item.id}-${item.size}`}
              className="bg-brand-dark border border-brand-gray flex gap-4 p-4"
            >
              {/* Imagen del producto */}
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-24 h-28 object-cover flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/producto/${item.id}`)}
              />

              {/* Información del item */}
              <div className="flex flex-col flex-1 min-w-0">
                {/* Nombre */}
                <h3
                  className="text-brand-white font-semibold text-base mb-1 cursor-pointer hover:text-brand-gold transition-colors truncate"
                  onClick={() => navigate(`/producto/${item.id}`)}
                >
                  {item.name}
                </h3>

                {/* Talla seleccionada */}
                <p className="text-brand-muted text-sm mb-3">
                  Talla: <span className="text-brand-white">{item.size}</span>
                </p>

                {/* Fila inferior: controles de cantidad + precio + eliminar */}
                <div className="flex items-center justify-between mt-auto flex-wrap gap-3">

                  {/* Controles de cantidad [− cantidad +] */}
                  <div className="flex items-center border border-brand-gray">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="w-9 h-9 flex items-center justify-center text-brand-white hover:text-brand-gold hover:bg-brand-gray transition-colors text-lg"
                      aria-label="Reducir cantidad"
                    >
                      −
                    </button>
                    {/* Cantidad actual */}
                    <span className="w-10 text-center text-brand-white text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item)}
                      className="w-9 h-9 flex items-center justify-center text-brand-white hover:text-brand-gold hover:bg-brand-gray transition-colors text-lg"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  {/* Precio total de este item (precio × cantidad) */}
                  <span className="text-brand-gold font-bold text-lg">
                    ${item.price * item.quantity}
                  </span>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-brand-muted hover:text-red-400 transition-colors p-1"
                    aria-label="Eliminar producto"
                  >
                    {/* Icono de basura */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>

                </div>
              </div>
            </div>
          ))}

          {/* Enlace para seguir comprando */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-colors text-sm mt-2 w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Seguir comprando
          </button>
        </div>

        {/* ── Columna derecha: Resumen del pedido ── */}
        <div className="lg:col-span-1">
          <div className="bg-brand-dark border border-brand-gray p-6 sticky top-20">
            <h2 className="text-brand-white font-bold text-lg uppercase tracking-wider mb-6">
              Resumen
            </h2>

            {/* Desglose por item */}
            <div className="flex flex-col gap-2 mb-4">
              {cartState.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                  <span className="text-brand-muted truncate pr-2">
                    {item.name} ×{item.quantity}
                  </span>
                  <span className="text-brand-white flex-shrink-0">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Separador */}
            <div className="h-px bg-brand-gray my-4" />

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-brand-white font-semibold uppercase tracking-wider text-sm">
                Total
              </span>
              <span className="text-brand-gold font-bold text-2xl">
                ${totalPrice}
              </span>
            </div>

            {/* Botón de checkout */}
            {/* En el Paso 3 navegará a /checkout con el formulario de pago */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-brand-gold text-black font-bold uppercase tracking-widest py-4 hover:bg-yellow-400 transition-colors text-sm"
            >
              Proceder al pago →
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
