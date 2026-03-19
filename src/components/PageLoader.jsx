/**
 * PageLoader.jsx
 * ---------------
 * Indicador de carga que se muestra mientras una página está siendo procesada.
 *
 * Se usa como fallback de React Suspense en App.jsx.
 * Cuando el usuario navega a una ruta, React carga el chunk de esa página
 * de forma lazy (bajo demanda). Mientras ese chunk llega, Suspense muestra
 * este componente en su lugar.
 *
 * Muestra una animación de spinner centrada en la pantalla.
 *
 * No recibe props.
 *
 * Uso: <Suspense fallback={<PageLoader />}>...</Suspense>
 */

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-brand-black/80 flex items-center justify-center z-50">
      {/* Spinner animado con el color dorado de la marca */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-gray border-t-brand-gold rounded-full animate-spin" />
        <p className="text-brand-muted text-xs uppercase tracking-widest">
          Cargando...
        </p>
      </div>
    </div>
  );
}
