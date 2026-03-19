/**
 * products.js
 * ------------
 * Datos mock (simulados) de los productos de la tienda GoodLuck.
 *
 * Cada producto tiene la siguiente estructura:
 *  - id          (number)   : identificador único
 *  - name        (string)   : nombre del producto
 *  - price       (number)   : precio actual en pesos
 *  - originalPrice (number) : precio anterior (si hay descuento, sino null)
 *  - category    (string)   : categoría del producto ('casual', 'formal', 'sport')
 *  - sizes       (string[]) : tallas disponibles
 *  - images      (string[]) : URLs de las imágenes del producto
 *  - description (string)   : descripción del producto
 *  - featured    (boolean)  : true si aparece en la sección "Destacados"
 *
 * Las imágenes provienen de Unsplash (fotos libres de uso).
 * En el futuro este archivo será reemplazado por llamadas a Supabase.
 */

export const products = [
  {
    id: 1,
    name: "Camisa Urban Negro",
    price: 299,
    originalPrice: null,
    category: "casual",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    ],
    description:
      "Camisa de algodón 100% con corte urbano. Perfecta para el día a día con un look oscuro y minimalista.",
    featured: true,
  },
  {
    id: 2,
    name: "Camisa Slim Blanca",
    price: 349,
    originalPrice: 420,
    category: "formal",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
      "https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=600&q=80",
    ],
    description:
      "Camisa slim fit de tela premium. Ideal para ocasiones formales o una salida elegante.",
    featured: true,
  },
  {
    id: 3,
    name: "Camisa Oversized Gris",
    price: 279,
    originalPrice: null,
    category: "casual",
    sizes: ["M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=600&q=80",
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80",
    ],
    description:
      "Camisa oversized en tono gris oscuro. Corte relajado para un estilo streetwear auténtico.",
    featured: true,
  },
  {
    id: 4,
    name: "Camisa Sport Dry-Fit",
    price: 319,
    originalPrice: 380,
    category: "sport",
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=80",
    ],
    description:
      "Camisa deportiva de tela Dry-Fit. Transpirable y cómoda para entrenamiento o uso casual.",
    featured: true,
  },
  {
    id: 5,
    name: "Camisa Manga Larga Oxford",
    price: 399,
    originalPrice: null,
    category: "formal",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80",
    ],
    description:
      "Camisa Oxford de manga larga con tela resistente. Estilo clásico adaptado al look moderno.",
    featured: false,
  },
  {
    id: 6,
    name: "Camisa Cuadros Urban",
    price: 259,
    originalPrice: 310,
    category: "casual",
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=600&q=80",
      "https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?w=600&q=80",
    ],
    description:
      "Camisa a cuadros de franela suave. Diseño clásico con un giro urbano contemporáneo.",
    featured: false,
  },
  {
    id: 7,
    name: "Camisa Polo Negra",
    price: 229,
    originalPrice: null,
    category: "casual",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
    ],
    description:
      "Polo de punto piqué. Versátil, cómoda y elegante para cualquier ocasión.",
    featured: false,
  },
  {
    id: 8,
    name: "Camisa Lino Verano",
    price: 289,
    originalPrice: 340,
    category: "casual",
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=600&q=80",
      "https://images.unsplash.com/photo-1503342564462-3423a1fa3b01?w=600&q=80",
    ],
    description:
      "Camisa de lino ligero y transpirable. Perfecta para el calor con un estilo fresco y relajado.",
    featured: false,
  },
];

/**
 * Retorna un producto por su ID.
 * Uso: getProductById(3) → objeto del producto con id=3, o undefined si no existe.
 *
 * @param {number} id - El ID del producto a buscar
 * @returns {object|undefined}
 */
export function getProductById(id) {
  return products.find((p) => p.id === Number(id));
}

/**
 * Retorna los productos marcados como destacados (featured: true).
 * Se usan en la sección "Destacados" de la página Home.
 *
 * @returns {object[]}
 */
export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}
