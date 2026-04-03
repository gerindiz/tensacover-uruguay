import type { TentUI } from '@/types';

export const GALLERY_IMAGES = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-5.jpg',
  '/images/gallery-6.jpg',
];

export const STATIC_TENTS: Omit<TentUI, 'id' | 'dimensiones' | 'capacidad_personas' | 'precio_referencia'>[] = [
  {
    title: 'Standard',
    tag: 'Versátil',
    desc: 'Elegancia versátil para cualquier entorno. Perfecta para jardines privados y eventos boutique.',
    features: [
      '100% Waterproof',
      'Montaje en 4 horas',
      'Resistencia al viento hasta 80km/h',
      'Tejido elástico de alta densidad',
    ],
    img: '/images/model-standard.jpg',
    details:
      'Nuestra carpa Standard es la opción ideal para quienes buscan una solución elegante y funcional. Su diseño orgánico se adapta a cualquier terreno, permitiendo configuraciones abiertas o cerradas según el clima.',
  },
  {
    title: 'Premium',
    tag: 'Lujo',
    desc: 'Diseño superior con acabados de alta gama y mástiles de madera natural tratada para un look rústico chic.',
    features: [
      'Tejidos técnicos Ignífugos',
      'Iluminación perimetral incluida',
      'Mástiles de madera de eucalipto',
      'Acabados artesanales',
    ],
    img: '/images/model-premium.jpg',
    popular: true,
    details:
      'El modelo Premium eleva la experiencia beduina a un nivel superior. Los mástiles de madera natural no solo proporcionan una estructura robusta, sino que añaden una calidez estética inigualable.',
  },
  {
    title: 'Gran XL',
    tag: 'Mega',
    desc: 'Máxima capacidad para eventos a gran escala. Estructuras modulares que cubren hasta 1000m².',
    features: [
      'Capacidad +500 personas',
      'Ingeniería certificada',
      'Configuración modular',
      'Doble refuerzo estructural',
    ],
    img: '/images/model-granxl.jpg',
    details:
      'Para eventos multitudinarios, la Gran XL es la respuesta. Su sistema modular permite unir varias carpas de forma estanca, creando espacios diáfanos de dimensiones impresionantes.',
  },
];

export const EVENT_TYPES = ['Boda', 'Corporativo', 'Privado / Fiesta', 'Otro'] as const;

export const WHATSAPP_NUMBER = '59899000000'; // Uruguay prefix
export const CONTACT_PHONE = '+598 99 000 000';
export const CONTACT_EMAIL = 'info@tensacover.com.uy';
export const INSTAGRAM_URL = 'https://instagram.com/tensacover';
export const FACEBOOK_URL = 'https://facebook.com/tensacover';
