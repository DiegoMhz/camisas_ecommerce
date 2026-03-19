/**
 * ScrollToTop.jsx
 * ----------------
 * Componente utilitario que resetea el scroll al tope de la página
 * cada vez que el usuario navega a una ruta diferente.
 *
 * ¿Por qué es necesario?
 *  React Router cambia el contenido de la página sin recargarla,
 *  por lo que el navegador mantiene la posición de scroll de la ruta anterior.
 *  Este componente escucha los cambios de URL con useLocation y, cada vez
 *  que la ruta cambia, fuerza el scroll al inicio (0, 0).
 *
 * No renderiza nada visible (retorna null).
 * Se coloca una sola vez dentro de <BrowserRouter>, en App.jsx.
 *
 * Uso: <ScrollToTop />
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  // useLocation retorna el objeto de la ruta actual.
  // Cada vez que navegamos, 'pathname' cambia (ej: "/" → "/producto/3")
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando pathname cambia, scrolleamos al tope de la página
    window.scrollTo(0, 0);
  }, [pathname]); // el efecto se ejecuta cada vez que cambia la ruta

  // Este componente no necesita renderizar nada
  return null;
}
