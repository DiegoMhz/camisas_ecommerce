/**
 * main.jsx
 * ---------
 * Punto de entrada de la aplicación React.
 *
 * Monta el componente raíz <App /> en el elemento #root del HTML.
 *
 * Orden de los proveedores (de afuera hacia adentro):
 *  1. StrictMode    : advertencias extra en desarrollo
 *  2. BrowserRouter : habilita las rutas con React Router
 *  3. CartProvider  : provee el estado global del carrito a toda la app
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* CartProvider debe estar dentro de BrowserRouter para que
          los componentes del carrito puedan usar useNavigate */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
