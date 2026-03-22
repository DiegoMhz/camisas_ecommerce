# GoodLuck E-Commerce — Estado del Proyecto

## Implementado

### Stack
- **Vite + React + JavaScript**
- **Tailwind CSS v4** con plugin `@tailwindcss/vite` (sin `tailwind.config.js`, tema definido con `@theme` en `index.css`)
- **React Router v6** con `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`
- **Swiper** para el carrusel hero
- **React Context + useReducer** para el carrito global
- **Supabase** como base de datos (tabla `products`)

### Rutas disponibles
| Ruta | Página |
|---|---|
| `/` | Home — hero carrusel, destacados, grid completo |
| `/tienda` | Tienda — buscador con debounce, filtros, orden, scroll infinito |
| `/ofertas` | Ofertas — productos con descuento activo |
| `/producto/:id` | Detalle de producto — galería, tallas, agregar al carrito |
| `/carrito` | Carrito — lista de items, cantidades, total |
| `/checkout` | Checkout — formulario de pago (datos personales, dirección, tarjeta) |
| `/admin` | Panel admin — listar, buscar, agregar, editar y eliminar productos |

### Componentes
- `Navbar` — logo, navegación activa, badge del carrito
- `HeroCarousel` — 3 slides con Swiper, autoplay, navegación a rutas
- `ProductCard` — imagen clickeable con `<Link>`, badge oferta, botón "Ver más", lazy loading
- `Footer` — links de navegación, copyright
- `ScrollToTop` — resetea scroll al navegar entre rutas
- `PageLoader` — spinner mostrado por `React.lazy` + `Suspense` durante carga de chunks

### Funcionalidades
- **Carrito global** con `CartContext`: agregar, quitar, cambiar cantidad, limpiar
- **Checkout** con validación de campos, formato automático de tarjeta y vencimiento, prefijo +58
- **Confirmación de pedido** con pantalla de éxito y limpieza del carrito
- **Tienda `/tienda`**: buscador con debounce 400ms, filtros por categoría, orden por precio, scroll infinito (12 productos por lote, server-side con Supabase `.range()`)
- **Panel Admin `/admin`**: buscador, listado con editar/eliminar, formulario dual agregar/editar
- **Code splitting**: cada página es un chunk JS independiente cargado bajo demanda
- **Lazy loading** en imágenes de: ProductCard, Admin, ProductDetail (miniaturas), Cart, Checkout

### Datos
- Supabase conectado — tabla `products` con 12 productos reales
- `src/services/productService.js` — getProducts, getProductsPage, getProductById, getOfferProducts, createProduct, updateProduct, deleteProduct
- `src/data/products.js` conservado como referencia pero ya no se usa

---

## Pendiente antes de seguir

### Verificar en produccion
- [ ] Confirmar que los filtros (categoria, orden, busqueda) funcionan correctamente con Supabase
- [ ] Confirmar que el lazy loading de imagenes se aplica correctamente en todos los componentes

---

## Proximos pasos

### Paso 6 — Subida de imagenes a Supabase Storage
- Reemplazar URLs externas (Unsplash) por imagenes propias almacenadas en Supabase Storage
- En el formulario del admin, agregar un input de tipo `file` para subir imagenes directamente
- Al guardar el producto, subir la imagen a un bucket de Supabase y guardar la URL publica generada
- Eliminar la imagen del bucket cuando se elimina el producto

### Paso 7 — Login y autenticacion
- Usar Supabase Auth (email + password) para el sistema de login
- Crear tabla `profiles` vinculada a `auth.users` con campo `role` ('customer' / 'admin')
- Proteger la ruta `/admin` para que solo usuarios con rol 'admin' puedan acceder
- Ruta `/login` con formulario de inicio de sesion
- Ruta `/registro` para nuevos clientes
- Historial de pedidos vinculado al usuario autenticado (tabla `orders`)

### Paso 8 — Deploy
- Subir la app a **Vercel** o **Netlify** (compatible con Vite)
- Configurar las variables de entorno de Supabase en la plataforma de deploy
- Verificar que todas las rutas funcionen en produccion (configurar redirects para SPA)
