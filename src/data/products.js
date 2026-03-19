/**
 * products.js
 * ------------
 * Datos mock (simulados) de los productos de la tienda GoodLuck.
 *
 * Cada producto tiene la siguiente estructura:
 *  - id            (number)   : identificador único
 *  - name          (string)   : nombre del producto
 *  - price         (number)   : precio actual en dólares
 *  - originalPrice (number)   : precio anterior (si hay descuento, sino null)
 *  - category      (string)   : categoría del producto:
 *                               'oversize'    → camisas oversize
 *                               'mlb-nba'     → camisas de equipos MLB y NBA
 *                               'multimarcas' → camisas de marcas reconocidas
 *  - sizes         (string[]) : tallas disponibles
 *  - images        (string[]) : URLs de las imágenes del producto
 *  - description   (string)   : descripción del producto
 *  - featured      (boolean)  : true si aparece en la sección "Destacados" del Home
 *
 * Las imágenes provienen de Unsplash (fotos libres de uso).
 * En el futuro este archivo será reemplazado por llamadas a Supabase.
 */

export const products = [

  // ─────────────────────────────────────────
  // OVERSIZE
  // ─────────────────────────────────────────
  {
    id: 1,
    name: "Oversize Negro Básico",
    price: 18,
    originalPrice: null,
    category: "oversize",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    ],
    description:
      "Camisa oversize negra de algodón pesado. Corte amplio y relajado, ideal para el streetwear urbano.",
    featured: true,
  },
  {
    id: 2,
    name: "Oversize Blanca Premium",
    price: 20,
    originalPrice: 25,
    category: "oversize",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
      "https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=600&q=80",
    ],
    description:
      "Oversize blanca de tela premium 100% algodón. Perfecta para combinar con cualquier outfit.",
    featured: true,
  },
  {
    id: 3,
    name: "Oversize Gris Urban",
    price: 18,
    originalPrice: null,
    category: "oversize",
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=600&q=80",
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80",
    ],
    description:
      "Oversize gris con caída perfecta. Tela gruesa de alta calidad con costuras reforzadas.",
    featured: false,
  },
  {
    id: 4,
    name: "Oversize Tie-Dye",
    price: 22,
    originalPrice: 28,
    category: "oversize",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&q=80",
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    ],
    description:
      "Oversize con diseño tie-dye artesanal. Cada prenda es única, teñida a mano con colores intensos.",
    featured: false,
  },

  // ─────────────────────────────────────────
  // MLB / NBA
  // ─────────────────────────────────────────
  {
    id: 5,
    name: "Camiseta Lakers — LeBron #23",
    price: 25,
    originalPrice: null,
    category: "mlb-nba",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1612481566137-6a58e0b11eba?w=600&q=80",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80",
    ],
    description:
      "Camiseta oficial estilo NBA de Los Angeles Lakers. Tela Dry-Fit transpirable con el número 23.",
    featured: true,
  },
  {
    id: 6,
    name: "Camiseta Bulls — Chicago",
    price: 25,
    originalPrice: 30,
    category: "mlb-nba",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=600&q=80",
      "https://images.unsplash.com/photo-1562077981-4d7eafd44932?w=600&q=80",
    ],
    description:
      "Camiseta estilo NBA Chicago Bulls clásica roja. Tela mesh con bordados de alta calidad.",
    featured: true,
  },
  {
    id: 7,
    name: "Jersey Yankees — MLB",
    price: 28,
    originalPrice: null,
    category: "mlb-nba",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80",
      "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=600&q=80",
    ],
    description:
      "Jersey estilo MLB New York Yankees. Diseño clásico a rayas con el icónico logo bordado.",
    featured: false,
  },
  {
    id: 8,
    name: "Camiseta Warriors — Golden State",
    price: 25,
    originalPrice: 32,
    category: "mlb-nba",
    sizes: ["M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600&q=80",
    ],
    description:
      "Camiseta estilo NBA Golden State Warriors en su colorway azul dorado. Tela ligera y transpirable.",
    featured: false,
  },

  // ─────────────────────────────────────────
  // MULTIMARCAS
  // ─────────────────────────────────────────
  {
    id: 9,
    name: "Camisa Nike Sportswear",
    price: 30,
    originalPrice: null,
    category: "multimarcas",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    ],
    description:
      "Camisa Nike Sportswear de colección. Tela Dri-FIT con el swoosh bordado en el pecho.",
    featured: true,
  },
  {
    id: 10,
    name: "Camisa Adidas Trefoil",
    price: 28,
    originalPrice: 35,
    category: "multimarcas",
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
    ],
    description:
      "Camisa Adidas Originals con el trébol icónico. Algodón premium con fit clásico retro.",
    featured: false,
  },
  {
    id: 11,
    name: "Camisa Supreme Box Logo",
    price: 45,
    originalPrice: null,
    category: "multimarcas",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80",
      "https://images.unsplash.com/photo-1503342564462-3423a1fa3b01?w=600&q=80",
    ],
    description:
      "Camisa estilo Supreme con el box logo en el pecho. Algodón heavyweight de alta calidad.",
    featured: false,
  },
  {
    id: 12,
    name: "Camisa Jordan Brand",
    price: 35,
    originalPrice: 42,
    category: "multimarcas",
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    ],
    description:
      "Camisa Jordan Brand con el logo Jumpman. Tela premium con acabados de alta costura deportiva.",
    featured: false,
  },
];

/**
 * Retorna un producto por su ID.
 * @param {number} id - El ID del producto a buscar
 * @returns {object|undefined}
 */
export function getProductById(id) {
  return products.find((p) => p.id === Number(id));
}

/**
 * Retorna los productos marcados como destacados (featured: true).
 * Se usan en la sección "Destacados" de la página Home.
 * @returns {object[]}
 */
export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

/**
 * Retorna los productos de una categoría específica.
 * @param {string} category - 'oversize' | 'mlb-nba' | 'multimarcas'
 * @returns {object[]}
 */
export function getProductsByCategory(category) {
  return products.filter((p) => p.category === category);
}
