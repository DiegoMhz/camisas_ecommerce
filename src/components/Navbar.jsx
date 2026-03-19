/**
 * Navbar.jsx
 * -----------
 * Barra de navegación principal de GoodLuck.
 *
 * Muestra:
 *  - Logo "GoodLuck" a la izquierda (enlace a Inicio)
 *  - Links de navegación en el centro: Inicio y Tienda
 *  - Icono de carrito a la derecha (sin funcionalidad aún)
 *
 * No recibe props. Se coloca una sola vez en App.jsx.
 *
 * Uso: <Navbar />
 */

import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-brand-dark border-b border-brand-gray sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

        {/* ── Logo ── */}
        <Link to="/" className="text-brand-gold font-bold text-2xl tracking-widest uppercase">
          GoodLuck
        </Link>

        {/* ── Links de navegación ── */}
        <ul className="hidden sm:flex gap-8 list-none m-0 p-0">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-brand-gold font-semibold text-sm uppercase tracking-wider"
                  : "text-brand-muted hover:text-brand-white text-sm uppercase tracking-wider transition-colors"
              }
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tienda"
              className={({ isActive }) =>
                isActive
                  ? "text-brand-gold font-semibold text-sm uppercase tracking-wider"
                  : "text-brand-muted hover:text-brand-white text-sm uppercase tracking-wider transition-colors"
              }
            >
              Tienda
            </NavLink>
          </li>
        </ul>

        {/* ── Icono carrito ── */}
        {/* Por ahora es solo visual, en el Paso 2 tendrá funcionalidad */}
        <button
          aria-label="Ver carrito"
          className="relative text-brand-white hover:text-brand-gold transition-colors p-2"
        >
          {/* Icono SVG de bolsa de compras */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
            />
          </svg>
        </button>

      </div>
    </nav>
  );
}
