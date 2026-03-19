/**
 * App.jsx
 * --------
 * Componente raíz de la aplicación GoodLuck.
 *
 * Responsabilidades:
 *  - Define las rutas de la aplicación usando React Router
 *  - Renderiza el layout global: Navbar arriba, contenido en medio, Footer abajo
 *
 * Code splitting con lazy + Suspense:
 *  Cada página se importa con React.lazy(), lo que hace que Vite genere
 *  un chunk (archivo JS) separado por página. El navegador solo descarga
 *  el chunk de la página que el usuario visita, no todas a la vez.
 *  Mientras ese chunk carga, Suspense muestra el <PageLoader />.
 *
 * Rutas disponibles:
 *  - "/"              → Home
 *  - "/producto/:id"  → ProductDetail
 *  - "/carrito"       → Cart
 *  - "/checkout"      → Checkout
 *  - "/ofertas"       → Offers
 *
 * Uso: Montado por main.jsx dentro de <BrowserRouter> y <CartProvider>.
 */

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";

// Importación lazy de cada página.
// React.lazy(() => import(...)) carga el módulo solo cuando se necesita.
const Home          = lazy(() => import("./pages/Home"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart          = lazy(() => import("./pages/Cart"));
const Checkout      = lazy(() => import("./pages/Checkout"));
const Offers        = lazy(() => import("./pages/Offers"));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-black">

      {/* Resetea el scroll al tope cada vez que cambia la ruta */}
      <ScrollToTop />

      {/* Barra de navegación fija en la parte superior */}
      <Navbar />

      {/* Área de contenido: crece para ocupar el espacio disponible */}
      <div className="flex-1">
        {/*
          Suspense: mientras el chunk de la página lazy está descargando,
          muestra el PageLoader como pantalla de carga.
          Al terminar la descarga, renderiza la página real.
        */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito"      element={<Cart />} />
            <Route path="/checkout"     element={<Checkout />} />
            <Route path="/ofertas"      element={<Offers />} />
          </Routes>
        </Suspense>
      </div>

      {/* Pie de página */}
      <Footer />

    </div>
  );
}
