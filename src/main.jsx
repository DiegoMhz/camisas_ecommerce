/**
 * main.jsx
 * ---------
 * Punto de entrada de la aplicación React.
 *
 * Monta el componente raíz <App /> en el elemento #root del HTML.
 *
 * BrowserRouter: habilita el sistema de rutas de React Router,
 * usando la URL del navegador para determinar qué página mostrar.
 *
 * StrictMode: activa advertencias adicionales de React durante el
 * desarrollo (no afecta la versión de producción).
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter envuelve toda la app para que React Router funcione */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
