/**
 * Admin.jsx
 * ----------
 * Panel de administración de GoodLuck (/admin).
 *
 * Permite gestionar el catálogo de productos directamente sobre Supabase:
 *  - Ver la lista completa de productos con opción de eliminar
 *  - Agregar nuevos productos mediante un formulario
 *
 * Por ahora es una página libre (sin autenticación).
 * En el futuro se protegerá para que solo usuarios con rol "admin" puedan acceder.
 *
 * Uso: Renderizado en la ruta "/admin" del router.
 */

import { useState, useEffect } from "react";
import { getProducts, createProduct, deleteProduct } from "../services/productService";

// Tallas disponibles para seleccionar al crear un producto
const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

// Categorías válidas del catálogo
const CATEGORIES = [
  { value: "oversize",     label: "Oversize" },
  { value: "mlb-nba",      label: "MLB / NBA" },
  { value: "multimarcas",  label: "Multimarcas" },
];

// Estado inicial del formulario de agregar producto
const EMPTY_FORM = {
  name:           "",
  price:          "",
  original_price: "",
  category:       "oversize",
  sizes:          [],
  image1:         "",   // Primera URL de imagen
  image2:         "",   // Segunda URL de imagen (opcional)
  description:    "",
  featured:       false,
};

export default function Admin() {
  // ── Estado de la lista de productos ──
  const [products, setProducts]   = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);

  // ── Estado del formulario ──
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Estado de eliminación (guarda el ID que se está eliminando) ──
  const [deletingId, setDeletingId] = useState(null);

  // ── Vista activa del panel (tabs) ──
  const [activeTab, setActiveTab] = useState("lista"); // "lista" | "agregar"

  // Cargamos los productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Recarga la lista de productos desde Supabase.
   * Se llama al montar y después de agregar o eliminar un producto.
   */
  function fetchProducts() {
    setLoadingList(true);
    setListError(null);
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setListError(err.message))
      .finally(() => setLoadingList(false));
  }

  // ─────────────────────────────────────────────────────────
  // Handlers del formulario
  // ─────────────────────────────────────────────────────────

  /**
   * Actualiza un campo del formulario cuando el usuario escribe o cambia un select.
   * @param {React.ChangeEvent} e - Evento del input/select/textarea
   */
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      // Los checkbox usan `checked`, el resto usa `value`
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /**
   * Agrega o quita una talla del array `sizes` al hacer clic en su botón.
   * @param {string} size - Talla a togglear (ej: "M")
   */
  function handleSizeToggle(size) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)   // si ya estaba → la quitamos
        : [...prev.sizes, size],                  // si no estaba → la agregamos
    }));
  }

  /**
   * Envía el formulario para crear un nuevo producto en Supabase.
   * Valida que los campos obligatorios estén completos antes de guardar.
   * @param {React.FormEvent} e
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    // Validaciones mínimas
    if (!form.name.trim())        return setSaveError("El nombre es obligatorio.");
    if (!form.price)              return setSaveError("El precio es obligatorio.");
    if (form.sizes.length === 0)  return setSaveError("Selecciona al menos una talla.");
    if (!form.image1.trim())      return setSaveError("Agrega al menos una URL de imagen.");
    if (!form.description.trim()) return setSaveError("La descripción es obligatoria.");

    // Construimos el array de imágenes (ignoramos image2 si está vacía)
    const images = [form.image1.trim()];
    if (form.image2.trim()) images.push(form.image2.trim());

    // Armamos el objeto en formato snake_case que espera Supabase
    const newProduct = {
      name:           form.name.trim(),
      price:          Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      category:       form.category,
      sizes:          form.sizes,
      images,
      description:    form.description.trim(),
      featured:       form.featured,
    };

    setSaving(true);
    try {
      await createProduct(newProduct);
      setSaveSuccess(true);
      setForm(EMPTY_FORM);     // limpiamos el formulario
      fetchProducts();          // refrescamos la lista
      setActiveTab("lista");    // volvemos a la lista para ver el nuevo producto
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ─────────────────────────────────────────────────────────
  // Handler de eliminación
  // ─────────────────────────────────────────────────────────

  /**
   * Elimina un producto después de pedir confirmación al usuario.
   * @param {string} id   - UUID del producto a eliminar
   * @param {string} name - Nombre del producto (para el mensaje de confirmación)
   */
  async function handleDelete(id, name) {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      // Actualizamos la lista localmente sin hacer otra consulta a Supabase
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  }

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      {/* ── Cabecera del panel ── */}
      <div className="mb-8">
        <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium mb-1">
          Panel de administración
        </p>
        <h1 className="text-brand-white text-3xl font-bold">
          GoodLuck Admin
        </h1>
      </div>

      {/* ── Tabs: Lista / Agregar ── */}
      <div className="flex gap-1 mb-8 border-b border-brand-gray">
        <button
          onClick={() => setActiveTab("lista")}
          className={`px-6 py-2.5 text-sm uppercase tracking-wider font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "lista"
              ? "border-brand-gold text-brand-gold"
              : "border-transparent text-brand-muted hover:text-brand-white"
          }`}
        >
          Productos ({products.length})
        </button>
        <button
          onClick={() => { setActiveTab("agregar"); setSaveSuccess(false); setSaveError(null); }}
          className={`px-6 py-2.5 text-sm uppercase tracking-wider font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "agregar"
              ? "border-brand-gold text-brand-gold"
              : "border-transparent text-brand-muted hover:text-brand-white"
          }`}
        >
          + Agregar producto
        </button>
      </div>

      {/* ══════════════════════════════════════════
          TAB 1 — Lista de productos
      ══════════════════════════════════════════ */}
      {activeTab === "lista" && (
        <section>
          {loadingList && (
            <p className="text-brand-muted text-sm animate-pulse">Cargando productos...</p>
          )}

          {listError && (
            <p className="text-red-400 text-sm">Error: {listError}</p>
          )}

          {!loadingList && !listError && products.length === 0 && (
            <p className="text-brand-muted text-sm">No hay productos en el catálogo.</p>
          )}

          {!loadingList && products.length > 0 && (
            <div className="flex flex-col gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 bg-brand-dark border border-brand-gray p-4"
                >
                  {/* Miniatura de imagen */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover flex-shrink-0"
                  />

                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-white text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-brand-muted text-xs mt-0.5">
                      {product.category} · ${product.price}
                      {product.originalPrice && (
                        <span className="line-through ml-1">${product.originalPrice}</span>
                      )}
                    </p>
                    <p className="text-brand-muted text-xs mt-0.5">
                      Tallas: {product.sizes.join(", ")}
                    </p>
                  </div>

                  {/* Badge destacado */}
                  {product.featured && (
                    <span className="text-brand-gold text-xs uppercase tracking-wider border border-brand-gold/30 px-2 py-0.5 flex-shrink-0">
                      Destacado
                    </span>
                  )}

                  {/* Botón eliminar */}
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="flex-shrink-0 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors px-3 py-1.5 text-xs uppercase tracking-wider disabled:opacity-40"
                  >
                    {deletingId === product.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════
          TAB 2 — Formulario para agregar producto
      ══════════════════════════════════════════ */}
      {activeTab === "agregar" && (
        <section>

          {/* Mensaje de éxito al guardar */}
          {saveSuccess && (
            <div className="mb-6 border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400 text-sm">
              Producto agregado correctamente.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* ── Nombre ── */}
            <div>
              <label className="block text-brand-white text-xs uppercase tracking-wider mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Oversize Negro Básico"
                className="w-full bg-brand-dark border border-brand-gray px-4 py-2.5 text-brand-white text-sm placeholder-brand-muted focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            {/* ── Precio y precio original ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-brand-white text-xs uppercase tracking-wider mb-2">
                  Precio (USD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ej: 25"
                  min="0"
                  step="0.01"
                  className="w-full bg-brand-dark border border-brand-gray px-4 py-2.5 text-brand-white text-sm placeholder-brand-muted focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-brand-white text-xs uppercase tracking-wider mb-2">
                  Precio original (opcional)
                </label>
                <input
                  type="number"
                  name="original_price"
                  value={form.original_price}
                  onChange={handleChange}
                  placeholder="Ej: 35 (si hay descuento)"
                  min="0"
                  step="0.01"
                  className="w-full bg-brand-dark border border-brand-gray px-4 py-2.5 text-brand-white text-sm placeholder-brand-muted focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
            </div>

            {/* ── Categoría ── */}
            <div>
              <label className="block text-brand-white text-xs uppercase tracking-wider mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-brand-gray px-4 py-2.5 text-brand-white text-sm focus:outline-none focus:border-brand-gold transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Tallas ── */}
            <div>
              <label className="block text-brand-white text-xs uppercase tracking-wider mb-2">
                Tallas disponibles *
              </label>
              <div className="flex gap-2 flex-wrap">
                {ALL_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`w-12 h-12 border text-sm font-medium transition-colors ${
                      form.sizes.includes(size)
                        ? "border-brand-gold bg-brand-gold text-black"
                        : "border-brand-gray text-brand-white hover:border-brand-muted"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Imágenes ── */}
            <div className="flex flex-col gap-3">
              <label className="block text-brand-white text-xs uppercase tracking-wider">
                Imágenes (URLs) *
              </label>
              <input
                type="url"
                name="image1"
                value={form.image1}
                onChange={handleChange}
                placeholder="URL de la imagen principal"
                className="w-full bg-brand-dark border border-brand-gray px-4 py-2.5 text-brand-white text-sm placeholder-brand-muted focus:outline-none focus:border-brand-gold transition-colors"
              />
              <input
                type="url"
                name="image2"
                value={form.image2}
                onChange={handleChange}
                placeholder="URL de imagen secundaria (opcional)"
                className="w-full bg-brand-dark border border-brand-gray px-4 py-2.5 text-brand-white text-sm placeholder-brand-muted focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            {/* ── Descripción ── */}
            <div>
              <label className="block text-brand-white text-xs uppercase tracking-wider mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe el material, corte, estilo del producto..."
                className="w-full bg-brand-dark border border-brand-gray px-4 py-2.5 text-brand-white text-sm placeholder-brand-muted focus:outline-none focus:border-brand-gold transition-colors resize-none"
              />
            </div>

            {/* ── Destacado ── */}
            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-yellow-400"
              />
              <span className="text-brand-white text-sm">
                Marcar como destacado (aparece en la sección "Destacados" del Home)
              </span>
            </label>

            {/* ── Error de guardado ── */}
            {saveError && (
              <p className="text-red-400 text-sm border border-red-500/30 bg-red-500/10 px-4 py-3">
                {saveError}
              </p>
            )}

            {/* ── Botón submit ── */}
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-gold text-black font-bold uppercase tracking-widest py-4 text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando..." : "Agregar producto"}
            </button>

          </form>
        </section>
      )}

    </main>
  );
}
