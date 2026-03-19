# GoodLuck E-Commerce — Estado del Proyecto

## Implementado

### Stack
- **Vite + React + JavaScript**
- **Tailwind CSS v4** con plugin `@tailwindcss/vite` (sin `tailwind.config.js`, tema definido con `@theme` en `index.css`)
- **React Router v6** con `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`
- **Swiper** para el carrusel hero
- **React Context + useReducer** para el carrito global

### Rutas disponibles
| Ruta | Página |
|---|---|
| `/` | Home — hero carrusel, destacados, grid completo |
| `/tienda` | Tienda — buscador, filtros por categoría, ordenamiento |
| `/ofertas` | Ofertas — productos con descuento activo |
| `/producto/:id` | Detalle de producto — galería, tallas, agregar al carrito |
| `/carrito` | Carrito — lista de items, cantidades, total |
| `/checkout` | Checkout — formulario de pago (datos personales, dirección, tarjeta) |

### Componentes
- `Navbar` — logo, navegación activa, badge del carrito
- `HeroCarousel` — 3 slides con Swiper, autoplay, navegación a rutas
- `ProductCard` — imagen clickeable con `<Link>`, badge oferta, botón "Ver más"
- `Footer` — links de navegación, copyright
- `ScrollToTop` — resetea scroll al navegar entre rutas
- `PageLoader` — spinner mostrado por `React.lazy` + `Suspense` durante carga de chunks

### Funcionalidades
- **Carrito global** con `CartContext`: agregar, quitar, cambiar cantidad, limpiar
- **Checkout** con validación de campos, formato automático de tarjeta (XXXX XXXX...) y vencimiento (MM/AA), prefijo fijo 🇻🇪 +58 para teléfono
- **Confirmación de pedido** con pantalla de éxito y limpieza del carrito
- **Filtros en /tienda**: búsqueda por nombre, categorías (Oversize / MLB·NBA / Multimarcas), orden por precio
- **Code splitting**: cada página es un chunk JS independiente cargado bajo demanda

### Categorías de productos
- `oversize` — camisas oversized
- `mlb-nba` — camisetas de equipos MLB y NBA
- `multimarcas` — Nike, Adidas, Supreme, Jordan

### Datos
- Actualmente mock en `src/data/products.js` (12 productos)
- Supabase aún **no conectado**

---

## Próximos 3 pasos

### Paso 4 — Integración con Supabase
- Crear proyecto en Supabase y tabla `products` con los mismos campos del mock
- Instalar `@supabase/supabase-js` y configurar el cliente en `src/lib/supabase.js`
- Reemplazar `src/data/products.js` por llamadas reales a Supabase en cada página
- Usar variables de entorno (`.env`) para las keys de Supabase

### Paso 5 — Panel de Administrador
- Ruta `/admin` protegida con contraseña simple (sin login complejo)
- Listar todos los productos con opción de eliminar
- Formulario para agregar nuevos productos (nombre, precio, categoría, tallas, imágenes, descripción)
- Las operaciones de escritura/borrado se harán directamente sobre Supabase

### Paso 6 — Deploy
- Subir la app a **Vercel** o **Netlify** (compatible con Vite)
- Configurar las variables de entorno de Supabase en la plataforma de deploy
- Verificar que todas las rutas funcionen en producción (configurar redirects para SPA)
