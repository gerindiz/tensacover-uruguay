// Tent / Carpa types
export interface Carpa {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  caracteristicas: string[];
  imagen_url: string | null;
  detalles: string;
  popular?: boolean;
  dimensiones: string;
  capacidad_personas: number;
  precio_referencia: number;
}

export interface TentUI {
  id: string;
  title: string;
  tag: string;
  desc: string;
  features: string[];
  img: string;
  details: string;
  popular?: boolean;
  dimensiones: string;
  capacidad_personas: number;
  precio_referencia: number;
}

// Lead / Contact form types
export type LeadStatus = 'Pendiente' | 'Contactado' | 'Cerrado';

export interface Lead {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  telefono: string;
  modelo_carpa: string;
  mensaje: string;
  estado: LeadStatus;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  sqm: string;
  message: string;
}
