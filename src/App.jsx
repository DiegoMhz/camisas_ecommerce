/**
 * App.jsx
 * --------
 * Componente raíz de la aplicación GoodLuck.
 *
 * Responsabilidades:
 *  - Define las rutas de la aplicación usando React Router
 *  - Renderiza el layout global: Navbar arriba, contenido en medio, Footer abajo
 *
 * Rutas disponibles:
 *  - "/"              → Página de inicio (Home)
 *  - "/producto/:id"  → Detalle de un producto específico (ProductDetail)
 *  - "/carrito"       → Carrito de compras (Cart)
 *
 * Uso: Este componente es montado por main.jsx dentro de <BrowserRouter> y <CartProvider>.
 */

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Offers from "./pages/Offers";

export default function App() {
  return (
    // Wrapper principal: columna flex para que el Footer siempre quede abajo
    <div className="min-h-screen flex flex-col bg-brand-black">

      {/* Resetea el scroll al tope cada vez que cambia la ruta */}
      <ScrollToTop />

      {/* Barra de navegación fija en la parte superior */}
      <Navbar />

      {/* Área de contenido: crece para ocupar el espacio disponible */}
      <div className="flex-1">
        <Routes>
          {/* Ruta de inicio */}
          <Route path="/" element={<Home />} />

          {/* Ruta de detalle de producto — :id es el identificador dinámico */}
          <Route path="/producto/:id" element={<ProductDetail />} />

          {/* Ruta del carrito de compras */}
          <Route path="/carrito" element={<Cart />} />

          {/* Ruta del formulario de pago */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Ruta de ofertas y promociones */}
          <Route path="/ofertas" element={<Offers />} />
        </Routes>
      </div>

      {/* Pie de página */}
      <Footer />

    </div>
  );
}
