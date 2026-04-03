import type { Carpa, TentUI } from '@/types';
import { GALLERY_IMAGES, STATIC_TENTS } from '@/constants';

/** Maps a Supabase Carpa record to the UI model */
export function mapCarpaToTentUI(item: Carpa, index: number): TentUI {
  return {
    id: item.id,
    title: item.nombre || 'Modelo TensaCover',
    tag: item.categoria || 'Premium',
    desc: item.descripcion || 'Elegancia y protección para tus eventos.',
    features: Array.isArray(item.caracteristicas)
      ? item.caracteristicas
      : item.caracteristicas
        ? JSON.parse(item.caracteristicas as unknown as string)
        : [],
    img: item.imagen_url || GALLERY_IMAGES[index % GALLERY_IMAGES.length],
    details: item.detalles || item.descripcion || '',
    popular: item.popular ?? false,
    dimensiones: item.dimensiones || 'Consultar',
    capacidad_personas: item.capacidad_personas || 0,
    precio_referencia: item.precio_referencia || 0,
  };
}

/** Returns static fallback tents */
export function getStaticTents(): TentUI[] {
  return STATIC_TENTS.map((t, i) => ({
    ...t,
    id: `static-${i}`,
    dimensiones: 'Varios',
    capacidad_personas: 100,
    precio_referencia: 0,
  }));
}

/** Format currency in EUR */
export function formatCurrency(amount: number, currency = 'UYU'): string {
  return new Intl.NumberFormat('es-UY', { style: 'currency', currency }).format(amount);
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
