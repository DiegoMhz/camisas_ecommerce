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
 *  - Campo `to`: ruta a la que navega el botón CTA al hacer clic
 *
 * No recibe props. Los slides están definidos dentro del componente.
 *
 * Uso: <HeroCarousel />
 */

import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Datos de los slides del hero.
// El campo `to` indica a qué ruta navega el botón CTA de cada slide.
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80",
    title: "Nueva Colección",
    subtitle: "Estilo urbano para cada momento",
    cta: "Ver colección",
    to: "/",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
    title: "Ofertas Especiales",
    subtitle: "Descuentos exclusivos esta semana",
    cta: "Ver ofertas",
    to: "/ofertas",   // navega a la página de ofertas
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1400&q=80",
    title: "GoodLuck Style",
    subtitle: "Viste con actitud, vive sin límites",
    cta: "Explorar ahora",
    to: "/",
  },
];

export default function HeroCarousel() {
  // useNavigate para que los botones CTA puedan cambiar de página
  const navigate = useNavigate();

  return (
    <div className="w-full h-[480px] sm:h-[560px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
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
                {/* El botón navega a la ruta definida en slide.to */}
                <button
                  onClick={() => navigate(slide.to)}
                  className="bg-brand-gold text-black font-bold uppercase tracking-wider px-8 py-3 hover:bg-yellow-400 transition-colors"
                >
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
