/**
 * Checkout.jsx
 * -------------
 * Página de pago de la tienda GoodLuck (/checkout).
 *
 * Muestra un formulario dividido en 3 secciones:
 *  1. Información personal (nombre, email, teléfono)
 *  2. Dirección de envío (calle, ciudad, estado, código postal)
 *  3. Datos de pago (número de tarjeta, titular, vencimiento, CVV)
 *
 * A la derecha muestra un resumen del pedido (igual que en /carrito).
 *
 * Al enviar el formulario:
 *  - Valida que todos los campos estén completos
 *  - Muestra una pantalla de confirmación de pedido
 *  - Limpia el carrito con CLEAR_CART
 *
 * No hay integración de pago real (Paso 4 con Supabase lo manejará).
 * No recibe props. Lee el carrito desde useCart().
 *
 * Uso: Renderizado en la ruta "/checkout" del router.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// ── Estado inicial del formulario ──
// Todos los campos comienzan vacíos
const emptyForm = {
  // Sección 1: Información personal
  nombre: "",
  email: "",
  telefono: "",
  // Sección 2: Dirección de envío
  calle: "",
  ciudad: "",
  estado: "",
  codigoPostal: "",
  // Sección 3: Datos de tarjeta
  titularTarjeta: "",
  numeroTarjeta: "",
  vencimiento: "",
  cvv: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartState, dispatch, totalItems, totalPrice } = useCart();

  // Estado del formulario: objeto con todos los campos
  const [form, setForm] = useState(emptyForm);

  // Estado de errores: campos que fallaron la validación
  const [errors, setErrors] = useState({});

  // Estado: true cuando el pedido fue enviado exitosamente
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Si el carrito está vacío y el pedido aún no fue enviado, redirigimos
  // (evita que alguien entre a /checkout sin productos)
  if (cartState.items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-brand-muted text-lg mb-4">
          Tu carrito está vacío.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-brand-gold text-black font-bold uppercase tracking-widest px-8 py-3 hover:bg-yellow-400 transition-colors text-sm"
        >
          Explorar productos
        </button>
      </div>
    );
  }

  // ── Pantalla de confirmación ──
  // Se muestra después de enviar el formulario correctamente
  if (orderPlaced) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Icono de check */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-brand-white text-3xl font-bold mb-3">
          ¡Pedido confirmado!
        </h1>
        <p className="text-brand-muted mb-2">
          Gracias, <span className="text-brand-white">{form.nombre}</span>. Tu pedido ha sido recibido.
        </p>
        <p className="text-brand-muted text-sm mb-8">
          Recibirás una confirmación en <span className="text-brand-white">{form.email}</span>.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-brand-gold text-black font-bold uppercase tracking-widest px-8 py-3 hover:bg-yellow-400 transition-colors text-sm"
        >
          Seguir comprando
        </button>
      </main>
    );
  }

  // ── Handlers ──

  /**
   * Actualiza el campo correspondiente en el estado del formulario.
   * Usamos el atributo `name` del input para saber qué campo actualizar.
   */
  function handleChange(e) {
    const { name, value } = e.target;

    // Formateo automático del número de tarjeta: agrega espacio cada 4 dígitos
    if (name === "numeroTarjeta") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
      setForm((prev) => ({ ...prev, numeroTarjeta: formatted }));
      // Limpiamos el error de ese campo al escribir
      if (errors.numeroTarjeta) setErrors((prev) => ({ ...prev, numeroTarjeta: "" }));
      return;
    }

    // Formateo automático del vencimiento: agrega "/" después de MM
    if (name === "vencimiento") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setForm((prev) => ({ ...prev, vencimiento: formatted }));
      if (errors.vencimiento) setErrors((prev) => ({ ...prev, vencimiento: "" }));
      return;
    }

    // Para el resto de campos, simplemente actualizamos el valor
    setForm((prev) => ({ ...prev, [name]: value }));

    // Limpiamos el error de ese campo al escribir
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  /**
   * Valida todos los campos del formulario.
   * Retorna true si todo está correcto, false si hay errores.
   * Los errores se guardan en el estado `errors` para mostrarlos bajo cada campo.
   */
  function validate() {
    const newErrors = {};

    // Validaciones de información personal
    if (!form.nombre.trim())   newErrors.nombre   = "El nombre es requerido.";
    if (!form.email.trim())    newErrors.email    = "El email es requerido.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email inválido.";
    // Teléfono venezolano: 10 u 11 dígitos (ej: 4121234567 o 04121234567)
    const telefonoDigits = form.telefono.replace(/\D/g, "");
    if (!telefonoDigits) newErrors.telefono = "El teléfono es requerido.";
    else if (telefonoDigits.length < 10) newErrors.telefono = "Ingresa un número venezolano válido (ej: 412 000 0000).";

    // Validaciones de dirección
    if (!form.calle.trim())        newErrors.calle        = "La calle es requerida.";
    if (!form.ciudad.trim())       newErrors.ciudad       = "La ciudad es requerida.";
    if (!form.estado.trim())       newErrors.estado       = "El estado es requerido.";
    if (!form.codigoPostal.trim()) newErrors.codigoPostal = "El código postal es requerido.";

    // Validaciones de tarjeta
    if (!form.titularTarjeta.trim()) newErrors.titularTarjeta = "El titular es requerido.";
    const cardDigits = form.numeroTarjeta.replace(/\s/g, "");
    if (cardDigits.length !== 16)    newErrors.numeroTarjeta  = "Ingresa los 16 dígitos de la tarjeta.";
    if (!/^\d{2}\/\d{2}$/.test(form.vencimiento)) newErrors.vencimiento = "Formato MM/AA requerido.";
    if (form.cvv.length < 3)         newErrors.cvv            = "CVV inválido (3-4 dígitos).";

    setErrors(newErrors);

    // Si el objeto de errores está vacío, la validación pasó
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Maneja el envío del formulario.
   * Valida, y si todo está bien, marca el pedido como enviado y limpia el carrito.
   */
  function handleSubmit(e) {
    e.preventDefault(); // evita que la página recargue al enviar el form

    if (!validate()) return; // si hay errores, no continuamos

    // Vaciamos el carrito
    dispatch({ type: "CLEAR_CART" });

    // Mostramos la pantalla de confirmación
    setOrderPlaced(true);
  }

  // ── Componente auxiliar: campo de formulario ──
  // Evita repetir el mismo markup para cada input
  function FormField({ label, name, type = "text", placeholder, maxLength }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-brand-white text-xs uppercase tracking-wider font-medium">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`bg-brand-black border px-3 py-2 text-brand-white text-sm placeholder-brand-gray focus:outline-none focus:border-brand-gold transition-colors ${
            errors[name] ? "border-red-500" : "border-brand-gray"
          }`}
        />
        {/* Mensaje de error bajo el campo */}
        {errors[name] && (
          <p className="text-red-400 text-xs">{errors[name]}</p>
        )}
      </div>
    );
  }

  // ── Renderizado principal ──
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">

      {/* Encabezado */}
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-brand-white text-2xl font-bold uppercase tracking-wider">
          Finalizar Compra
        </h1>
        <div className="flex-1 h-px bg-brand-gray" />
      </div>

      {/* Layout: formulario a la izquierda, resumen a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Formulario (ocupa 2/3 del ancho en desktop) ── */}
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 flex flex-col gap-8">

          {/* ── Sección 1: Información personal ── */}
          <div className="bg-brand-dark border border-brand-gray p-6">
            <h2 className="text-brand-white font-semibold uppercase tracking-wider text-sm mb-5 flex items-center gap-2">
              <span className="bg-brand-gold text-black w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full flex-shrink-0">1</span>
              Información Personal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Nombre completo" name="nombre" placeholder="Juan García" />
              <FormField label="Email" name="email" type="email" placeholder="juan@email.com" />
              {/* Campo de teléfono con prefijo fijo de Venezuela */}
              <div className="flex flex-col gap-1">
                <label className="text-brand-white text-xs uppercase tracking-wider font-medium">
                  Teléfono
                </label>
                <div className={`flex border transition-colors ${errors.telefono ? "border-red-500" : "border-brand-gray focus-within:border-brand-gold"}`}>
                  {/* Prefijo fijo: bandera + código de país — no editable */}
                  <span className="bg-brand-gray/40 px-3 flex items-center gap-2 text-brand-white text-sm border-r border-brand-gray flex-shrink-0 select-none">
                    🇻🇪 +58
                  </span>
                  {/* Input solo para el número local (sin el +58) */}
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="412 000 0000"
                    maxLength={11}
                    className="flex-1 bg-brand-black px-3 py-2 text-brand-white text-sm placeholder-brand-gray focus:outline-none"
                  />
                </div>
                {errors.telefono && (
                  <p className="text-red-400 text-xs">{errors.telefono}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Sección 2: Dirección de envío ── */}
          <div className="bg-brand-dark border border-brand-gray p-6">
            <h2 className="text-brand-white font-semibold uppercase tracking-wider text-sm mb-5 flex items-center gap-2">
              <span className="bg-brand-gold text-black w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full flex-shrink-0">2</span>
              Dirección de Envío
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* La calle ocupa el ancho completo */}
              <div className="sm:col-span-2">
                <FormField label="Calle y número" name="calle" placeholder="Av. Reforma 123, Col. Centro" />
              </div>
              <FormField label="Ciudad" name="ciudad" placeholder="Ciudad de México" />
              <FormField label="Estado" name="estado" placeholder="CDMX" />
              <FormField label="Código postal" name="codigoPostal" placeholder="06600" maxLength={5} />
            </div>
          </div>

          {/* ── Sección 3: Datos de pago ── */}
          <div className="bg-brand-dark border border-brand-gray p-6">
            <h2 className="text-brand-white font-semibold uppercase tracking-wider text-sm mb-5 flex items-center gap-2">
              <span className="bg-brand-gold text-black w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full flex-shrink-0">3</span>
              Datos de Pago
            </h2>

            {/* Aviso de entorno de pruebas */}
            <div className="bg-brand-gray/40 border border-brand-gray px-3 py-2 mb-5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-brand-gold flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <p className="text-brand-muted text-xs">
                Entorno de pruebas. No se realizará ningún cobro real.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Número de tarjeta ocupa ancho completo */}
              <div className="sm:col-span-2">
                <FormField
                  label="Número de tarjeta"
                  name="numeroTarjeta"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </div>
              <FormField label="Titular de la tarjeta" name="titularTarjeta" placeholder="JUAN GARCIA" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Vencimiento" name="vencimiento" placeholder="MM/AA" maxLength={5} />
                <FormField label="CVV" name="cvv" placeholder="123" maxLength={4} />
              </div>
            </div>
          </div>

          {/* ── Botón de envío ── */}
          <button
            type="submit"
            className="w-full bg-brand-gold text-black font-bold uppercase tracking-widest py-4 hover:bg-yellow-400 transition-colors text-sm"
          >
            Confirmar pedido — ${totalPrice}
          </button>

          {/* Enlace para volver al carrito */}
          <button
            type="button"
            onClick={() => navigate("/carrito")}
            className="flex items-center gap-2 text-brand-muted hover:text-brand-gold transition-colors text-sm w-fit mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al carrito
          </button>

        </form>

        {/* ── Resumen del pedido (columna derecha) ── */}
        <div className="lg:col-span-1">
          <div className="bg-brand-dark border border-brand-gray p-6 sticky top-20">
            <h2 className="text-brand-white font-bold text-sm uppercase tracking-wider mb-5">
              Resumen del pedido
            </h2>

            {/* Lista de items */}
            <div className="flex flex-col gap-3 mb-4">
              {cartState.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 items-center">
                  {/* Miniatura del producto */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-white text-xs font-medium truncate">{item.name}</p>
                    <p className="text-brand-muted text-xs">Talla: {item.size} · ×{item.quantity}</p>
                  </div>
                  <span className="text-brand-white text-xs font-semibold flex-shrink-0">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Separador */}
            <div className="h-px bg-brand-gray my-4" />

            {/* Totales */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal ({totalItems} productos)</span>
                <span className="text-brand-white">${totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Envío</span>
                <span className="text-green-400 text-xs font-medium">Gratis</span>
              </div>
            </div>

            <div className="h-px bg-brand-gray mb-4" />

            {/* Total final */}
            <div className="flex justify-between items-center">
              <span className="text-brand-white font-semibold uppercase tracking-wider text-sm">Total</span>
              <span className="text-brand-gold font-bold text-2xl">${totalPrice}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
