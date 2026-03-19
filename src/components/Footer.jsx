/**
 * Footer.jsx
 * -----------
 * Pie de página de la tienda GoodLuck.
 *
 * Muestra:
 *  - Logo y slogan de la marca
 *  - Links rápidos de navegación
 *  - Créditos de copyright
 *
 * No recibe props. Se coloca una sola vez en App.jsx.
 *
 * Uso: <Footer />
 */

import { Link } from "react-router-dom";

export default function Footer() {
  // Año actual para el copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark border-t border-brand-gray mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── Contenido principal del footer ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">

          {/* Columna: Marca */}
          <div>
            <p className="text-brand-gold font-bold text-xl tracking-widest uppercase mb-2">
              GoodLuck
            </p>
            <p className="text-brand-muted text-sm max-w-xs">
              Estilo urbano para cada momento. Camisas de calidad con actitud.
            </p>
          </div>

          {/* Columna: Links rápidos */}
          <div>
            <p className="text-brand-white font-semibold uppercase tracking-wider text-sm mb-3">
              Navegación
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              <li>
                <Link to="/" className="text-brand-muted hover:text-brand-gold text-sm transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/tienda" className="text-brand-muted hover:text-brand-gold text-sm transition-colors">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Separador y copyright ── */}
        <div className="border-t border-brand-gray mt-8 pt-6 text-center">
          <p className="text-brand-muted text-xs">
            © {currentYear} GoodLuck. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}
