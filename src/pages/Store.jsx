/**
 * Store.jsx
 * ----------
 * Página de tienda completa de GoodLuck (/tienda).
 *
 * Permite al usuario explorar todos los productos con:
 *  - Buscador por nombre de producto
 *  - Filtros por categoría: Todos, Casual, Formal, Sport
 *  - Ordenamiento: Relevancia, Menor precio, Mayor precio
 *
 * El filtrado y ordenamiento ocurren en el cliente (sin llamadas al servidor)
 * usando useMemo para no recalcular en cada render innecesariamente.
 *
 * No recibe props. Lee los datos desde products.js.
 *
 * Uso: Renderizado en la ruta "/tienda" del router.
 */

import { useState, useMemo } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

// Categorías disponibles para filtrar.
// "todos" es la opción por defecto que no filtra nada.
const CATEGORIES = [
  { value: "todos",  label: "Todos" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "sport",  label: "Sport" },
];

// Opciones de ordenamiento
const SORT_OPTIONS = [
  { value: "relevancia",     label: "Relevancia" },
  { value: "precio-asc",     label: "Menor precio" },
  { value: "precio-desc",    label: "Mayor precio" },
];

export default function Store() {
  // Estado del buscador (texto que escribe el usuario)
  const [search, setSearch] = useState("");

  // Estado del filtro de categoría activo
  const [activeCategory, setActiveCategory] = useState("todos");

  // Estado del criterio de ordenamiento
  const [sortBy, setSortBy] = useState("relevancia");

  /**
   * useMemo: calcula la lista filtrada y ordenada solo cuando cambia
   * search, activeCategory o sortBy. Evita recalcular en cada render.
   */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filtrar por texto de búsqueda (busca en el nombre, sin importar mayúsculas)
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    // 2. Filtrar por categoría (si no es "todos")
    if (activeCategory !== "todos") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // 3. Ordenar según el criterio seleccionado
    if (sortBy === "precio-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "precio-desc") {
      result.sort((a, b) => b.price - a.price);
    }
    // "relevancia" no modifica el orden original del array

    return result;
  }, [search, activeCategory, sortBy]);

  /**
   * Limpia todos los filtros y vuelve al estado inicial.
   */
  function clearFilters() {
    setSearch("");
    setActiveCategory("todos");
    setSortBy("relevancia");
  }

  // Comprueba si hay algún filtro activo para mostrar el botón "Limpiar"
  const hasActiveFilters = search.trim() || activeCategory !== "todos" || sortBy !== "relevancia";

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
              onChange={(e) => setSearch(e.target.value)}
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
                  onClick={() => setActiveCategory(cat.value)}
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
                onChange={(e) => setSortBy(e.target.value)}
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
          {filteredProducts.length === 0
            ? "Sin resultados"
            : `${filteredProducts.length} ${filteredProducts.length === 1 ? "producto" : "productos"}`}
          {activeCategory !== "todos" && (
            <span className="text-brand-white"> en {activeCategory}</span>
          )}
          {search.trim() && (
            <span className="text-brand-white"> para "{search}"</span>
          )}
        </p>

        {/* ── Grid de productos o mensaje vacío ── */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Mensaje cuando los filtros no devuelven resultados */
          <div className="text-center py-24">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-brand-gray mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p className="text-brand-muted text-lg mb-2">
              No encontramos productos
            </p>
            <p className="text-brand-muted text-sm mb-6">
              Intenta con otra búsqueda o categoría.
            </p>
            <button
              onClick={clearFilters}
              className="text-brand-gold underline text-sm"
            >
              Ver todos los productos
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
