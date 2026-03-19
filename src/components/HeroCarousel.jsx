/**
 * HeroCarousel.jsx
 * -----------------
 * Carrusel hero en la parte superior de la página de Inicio.
 *
 * Usa la librería Swiper con:
 *  - Autoplay cada 4 segundos
 *  - Flechas de navegación (anterior / siguiente)
 *  - Indicadores de paginación (dots)
 *
 * Cada slide tiene:
 *  - Imagen de fondo a pantalla completa
 *  - Capa oscura encima para mejor legibilidad del texto
 *  - Título, subtítulo y botón CTA
 *
 * No recibe props. Los slides están definidos dentro del componente.
 *
 * Uso: <HeroCarousel />
 */

// Importamos los módulos de Swiper que vamos a usar
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Estilos base de Swiper (obligatorios)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Datos de los slides del hero
// Cada slide tiene: imagen de fondo, título, subtítulo y texto del botón CTA
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80",
    title: "Nueva Colección",
    subtitle: "Estilo urbano para cada momento",
    cta: "Ver colección",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
    title: "Ofertas Especiales",
    subtitle: "Descuentos exclusivos esta semana",
    cta: "Ver ofertas",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1400&q=80",
    title: "GoodLuck Style",
    subtitle: "Viste con actitud, vive sin límites",
    cta: "Explorar ahora",
  },
];

export default function HeroCarousel() {
  return (
    // El wrapper define la altura del carrusel
    <div className="w-full h-[480px] sm:h-[560px] overflow-hidden">
      <Swiper
        // Módulos que activa Swiper
        modules={[Autoplay, Navigation, Pagination]}
        // Configuración del autoplay: avanza cada 4 segundos
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        // Muestra las flechas de navegación
        navigation
        // Muestra los dots de paginación en la parte inferior
        pagination={{ clickable: true }}
        // El carrusel es infinito (vuelve al inicio al llegar al final)
        loop
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Contenedor del slide: imagen + overlay */}
            <div
              className="relative w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Capa oscura semitransparente para que el texto sea legible */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Contenido del slide (centrado verticalmente) */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-brand-gold text-sm uppercase tracking-[0.3em] mb-3 font-medium">
                  GoodLuck
                </h2>
                <h1 className="text-brand-white text-4xl sm:text-6xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-brand-muted text-lg mb-8 max-w-md">
                  {slide.subtitle}
                </p>
                <button className="bg-brand-gold text-black font-bold uppercase tracking-wider px-8 py-3 hover:bg-yellow-400 transition-colors">
                  {slide.cta}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
