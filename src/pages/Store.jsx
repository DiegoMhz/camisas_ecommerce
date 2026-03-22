/**
 * Store.jsx
 * ----------
 * Página de tienda completa de GoodLuck (/tienda).
 *
 * Permite al usuario explorar todos los productos con:
 *  - Buscador por nombre de producto
 *  - Filtros por categoría: Todos, Oversize, MLB / NBA, Multimarcas
 *  - Ordenamiento: Relevancia, Menor precio, Mayor precio
 *
 * El filtrado y ordenamiento ocurren en el cliente (sin llamadas al servidor)
 * usando useMemo para no recalcular en cada render innecesariamente.
 *
 * No recibe props. Obtiene los datos desde Supabase vía productService.
 * Usa scroll infinito: carga 12 productos iniciales y añade más conforme
 * el usuario llega al final de la página (IntersectionObserver + .range()).
 *
 * Uso: Renderizado en la ruta "/tienda" del router.
 */

import { useState, useEffect, useRef } from "react";
import { getProductsPage } from "../services/productService";
import ProductCard from "../components/ProductCard";

// Productos que se cargan por cada "página" del scroll infinito
const PAGE_SIZE = 12;

// Categorías disponibles para filtrar.
// "todos" es la opción por defecto que no filtra nada.
const CATEGORIES = [
  { value: "todos",        label: "Todos" },
  { value: "oversize",     label: "Oversize" },
  { value: "mlb-nba",      label: "MLB / NBA" },
  { value: "multimarcas",  label: "Multimarcas" },
];

// Opciones de ordenamiento
const SORT_OPTIONS = [
  { value: "relevancia",     label: "Relevancia" },
  { value: "precio-asc",     label: "Menor precio" },
  { value: "precio-desc",    label: "Mayor precio" },
];

export default function Store() {
  // Acumulado de todos los productos cargados hasta ahora
  const [products, setProducts] = useState([]);

  // Total de resultados que coinciden con los filtros (devuelto por Supabase)
  const [total, setTotal] = useState(0);

  // true durante la carga inicial (primera página, o al cambiar filtros)
  const [loading, setLoading] = useState(true);

  // true mientras se cargan productos adicionales al hacer scroll
  const [loadingMore, setLoadingMore] = useState(false);

  // false cuando ya no hay más productos que cargar
  const [hasMore, setHasMore] = useState(true);

  // Mensaje de error si la consulta falla
  const [error, setError] = useState(null);

  // Página actual (base 0). Sube al llegar al final del scroll.
  const [page, setPage] = useState(0);

  // Valor del input en tiempo real (se actualiza con cada tecla)
  const [search, setSearch] = useState("");

  // Valor del buscador con debounce: se actualiza 400ms después de que el
  // usuario para de escribir. Es el que se manda a Supabase para no lanzar
  // una consulta por cada tecla presionada.
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Estado del filtro de categoría activo
  const [activeCategory, setActiveCategory] = useState("todos");

  // Estado del criterio de ordenamiento
  const [sortBy, setSortBy] = useState("relevancia");

  /**
   * Debounce del buscador: cada vez que `search` cambia, esperamos 400ms.
   * Si el usuario escribe otra letra antes de ese tiempo, el timer se reinicia.
   * Solo cuando paran 400ms se actualiza `debouncedSearch`, lo que dispara
   * el efecto de carga y lanza la consulta a Supabase.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      // Al aplicar el debounce, reseteamos el scroll para empezar desde página 0
      setDebouncedSearch(search);
      resetScroll();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Ref del elemento sentinel invisible al final del grid.
  // El IntersectionObserver lo observa para detectar cuándo el usuario llega al final.
  const sentinelRef = useRef(null);

  /**
   * Efecto de carga de productos.
   * - Si page === 0: es una carga inicial (o reset de filtros) → reemplaza productos
   * - Si page > 0: el usuario scrolleó al final → agrega productos al array existente
   *
   * React 18 batea los setState del mismo evento, por eso cuando un filtro cambia
   * y se llama setPage(0) + setFiltro(x) juntos, este efecto corre UNA sola vez
   * con ambos valores actualizados.
   */
  useEffect(() => {
    let cancelled = false;

    if (page === 0) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    getProductsPage(page, PAGE_SIZE, { search: debouncedSearch, category: activeCategory, sortBy })
      .then(({ products: data, total: count }) => {
        if (cancelled) return;
        // page 0 → nueva búsqueda, reemplazamos; page > 0 → scroll, agregamos
        setProducts((prev) => page === 0 ? data : [...prev, ...data]);
        setTotal(count);
        // Si los productos acumulados alcanzan el total, no hay más que cargar
        setHasMore((page + 1) * PAGE_SIZE < count);
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => { cancelled = true; };
  }, [page, debouncedSearch, activeCategory, sortBy]);

  /**
   * IntersectionObserver: cuando el sentinel (div invisible al fondo del grid)
   * entra en el viewport y hay más productos, incrementamos la página para
   * que el efecto anterior descargue el siguiente lote.
   */
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loadingMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading]);

  /**
   * Reinicia el scroll infinito: vacía los productos y vuelve a página 0.
   * Se llama siempre que cambia un filtro para empezar desde cero.
   */
  function resetScroll() {
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setActiveCategory("todos");
    setSortBy("relevancia");
    resetScroll();
  }

  function handleCategoryChange(category) {
    setActiveCategory(category);
    resetScroll();
  }

  function handleSortChange(e) {
    setSortBy(e.target.value);
    resetScroll();
  }

  // Solo actualiza el input visualmente — el debounce se encarga del resto
  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  // Comprueba si hay algún filtro activo para mostrar el botón "Limpiar"
  const hasActiveFilters = search.trim() || activeCategory !== "todos" || sortBy !== "relevancia";

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

      {/* ── Cabecera de la página ── */}
      <div className="bg-brand-dark border-b border-brand-gray">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium mb-2">
            Colección completa
          </p>
          <h1 className="text-brand-white text-4xl font-bold">
            Tienda
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── Barra de herramientas: buscador + filtros + orden ── */}
        <div className="flex flex-col gap-4 mb-8">

          {/* Fila superior: buscador */}
          <div className="relative">
            {/* Icono de lupa */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar productos..."
              className="w-full bg-brand-dark border border-brand-gray pl-10 pr-4 py-2.5 text-brand-white text-sm placeholder-brand-muted focus:outline-none focus:border-brand-gold transition-colors"
            />
            {/* Botón para limpiar el buscador */}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-white transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Fila inferior: filtros de categoría + selector de orden */}
          <div className="flex flex-wrap items-center justify-between gap-3">

            {/* Botones de categoría */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-4 py-1.5 text-xs uppercase tracking-wider font-medium border transition-colors ${
                    activeCategory === cat.value
                      ? "bg-brand-gold border-brand-gold text-black"       // categoría activa
                      : "border-brand-gray text-brand-muted hover:border-brand-muted hover:text-brand-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Selector de ordenamiento + botón limpiar */}
            <div className="flex items-center gap-3">
              {/* Botón para limpiar todos los filtros activos */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-brand-muted hover:text-brand-gold text-xs underline transition-colors"
                >
                  Limpiar filtros
                </button>
              )}

              {/* Select de ordenamiento */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-brand-dark border border-brand-gray text-brand-white text-xs uppercase tracking-wider px-3 py-1.5 focus:outline-none focus:border-brand-gold transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* ── Contador de resultados ── */}
        <p className="text-brand-muted text-sm mb-6">
          {loading
            ? "Cargando..."
            : total === 0
              ? "Sin resultados"
              : `${total} ${total === 1 ? "producto" : "productos"}`}
          {!loading && activeCategory !== "todos" && (
            <span className="text-brand-white"> en {activeCategory}</span>
          )}
          {!loading && search.trim() && (
            <span className="text-brand-white"> para "{search}"</span>
          )}
        </p>

        {/* ── Carga inicial ── */}
        {loading && (
          <p className="text-brand-muted text-sm text-center py-20 animate-pulse uppercase tracking-widest">
            Cargando productos...
          </p>
        )}

        {/* ── Grid de productos ── */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* ── Sin resultados ── */}
        {!loading && products.length === 0 && (
          <div className="text-center py-24">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-brand-gray mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p className="text-brand-muted text-lg mb-2">No encontramos productos</p>
            <p className="text-brand-muted text-sm mb-6">Intenta con otra búsqueda o categoría.</p>
            <button onClick={clearFilters} className="text-brand-gold underline text-sm">
              Ver todos los productos
            </button>
          </div>
        )}

        {/* ── Sentinel para IntersectionObserver ──
            Div invisible al final del grid. Cuando entra en el viewport,
            el observer detecta que el usuario llegó al fondo y carga más. */}
        {!loading && hasMore && (
          <div ref={sentinelRef} className="h-10" />
        )}

        {/* ── Spinner de carga de más productos ── */}
        {loadingMore && (
          <p className="text-brand-muted text-sm text-center py-8 animate-pulse uppercase tracking-widest">
            Cargando más...
          </p>
        )}

        {/* ── Fin del catálogo ── */}
        {!loading && !hasMore && products.length > 0 && (
          <p className="text-brand-muted text-xs text-center py-8 uppercase tracking-widest">
            — Fin del catálogo —
          </p>
        )}

      </div>
    </main>
  );
}
