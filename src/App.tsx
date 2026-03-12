/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Menu, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Tent,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import { getSupabase } from './lib/supabase';

// --- Types ---
interface Carpa {
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

// For UI mapping
interface ModelUI extends Omit<Carpa, 'nombre' | 'categoria' | 'descripcion' | 'caracteristicas' | 'imagen_url' | 'detalles'> {
  title: string;
  tag: string;
  desc: string;
  features: string[];
  img: string;
  details: string;
}

// --- Constants ---
const galleryImages = [
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
];

const MODELS = [
  {
    title: "Standard",
    tag: "Versátil",
    desc: "Elegancia versátil para cualquier entorno. Perfecta para jardines privados y eventos boutique.",
    features: ["100% Waterproof", "Montaje en 4 horas", "Resistencia al viento hasta 80km/h", "Tejido elástico de alta densidad"],
    img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
    details: "Nuestra carpa Standard es la opción ideal para quienes buscan una solución elegante y funcional. Su diseño orgánico se adapta a cualquier terreno, permitiendo configuraciones abiertas o cerradas según el clima. Es perfecta para cenas íntimas, zonas de cóctel o pequeños escenarios."
  },
  {
    title: "Premium",
    tag: "Lujo",
    desc: "Diseño superior con acabados de alta gama y mástiles de madera natural tratada para un look rústico chic.",
    features: ["Tejidos técnicos Ignífugos", "Iluminación perimetral incluida", "Mástiles de madera de eucalipto", "Acabados artesanales"],
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800",
    popular: true,
    details: "El modelo Premium eleva la experiencia beduina a un nivel superior. Los mástiles de madera natural no solo proporcionan una estructura robusta, sino que añaden una calidez estética inigualable. Incluye un sistema de iluminación LED regulable que crea una atmósfera mágica al caer la noche."
  },
  {
    title: "Gran XL",
    tag: "Mega",
    desc: "Máxima capacidad para eventos a gran escala. Estructuras modulares que cubren hasta 1000m².",
    features: ["Capacidad +500 personas", "Ingeniería certificada", "Configuración modular", "Doble refuerzo estructural"],
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    details: "Para eventos multitudinarios, la Gran XL es la respuesta. Su sistema modular permite unir varias carpas de forma estanca, creando espacios diáfanos de dimensiones impresionantes. Es la elección preferida para festivales, bodas de gran formato y eventos corporativos de alto impacto."
  }
];

// --- Components ---

const TensaCoverLogo = ({ light = false, className = "" }: { light?: boolean, className?: string }) => (
  <div className={`flex items-center gap-3 group ${className}`}>
    <img 
      src="https://storage.googleapis.com/content-studio-static/user_uploads/ais-dev-n6ibeay4llmvoksan3e3x7-165380226435.us-east1.run.app/logo_tensacover.jpg" 
      alt="TensaCover Logo" 
      className="h-16 w-auto object-contain"
      referrerPolicy="no-referrer"
    />
  </div>
);

const Lightbox = ({ index, onClose, onNext, onPrev }: { index: number, onClose: () => void, onNext: () => void, onPrev: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110] bg-white/10 p-2 rounded-full"
      >
        <X size={32} />
      </button>

      <button 
        onClick={onPrev}
        className="absolute left-4 sm:left-10 text-white/70 hover:text-white transition-colors z-[110] bg-white/10 p-3 rounded-full hover:scale-110 active:scale-95"
      >
        <ChevronLeft size={40} />
      </button>

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-5xl max-h-[80vh] flex items-center justify-center"
      >
        <img 
          src={galleryImages[index]}
          className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <button 
        onClick={onNext}
        className="absolute right-4 sm:right-10 text-white/70 hover:text-white transition-colors z-[110] bg-white/10 p-3 rounded-full hover:scale-110 active:scale-95"
      >
        <ChevronRight size={40} />
      </button>

      <div className="absolute bottom-10 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white/80 text-sm font-bold tracking-widest">
        {index + 1} / {galleryImages.length}
      </div>
    </motion.div>
  );
};

const VideoModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[70] bg-white/10 p-3 rounded-full backdrop-blur-md"
      >
        <X size={32} />
      </button>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-5xl aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
          title="TensaCover Presentation"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </motion.div>
    </motion.div>
  );
};

const WhatsAppButton = () => {
  const phoneNumber = "34600000000"; // Placeholder number
  const message = encodeURIComponent("Hola, me gustaría recibir más información sobre las soluciones de TensaCover.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
      {/* Pulsing Ring Effect */}
      <motion.div
        className="absolute inset-0 bg-[#25D366] rounded-full"
        animate={{ 
          scale: [1, 1.6],
          opacity: [0.6, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeOut" 
        }}
      />
      
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, y: -5 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <svg 
          viewBox="0 0 24 24" 
          width="28" 
          height="28" 
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </div>
  );
};

function HomePage() {
  const [models, setModels] = useState<ModelUI[]>(MODELS.slice(0, 4).map((m, i) => ({ ...m, id: String(i), dimensiones: '', capacidad_personas: 0, precio_referencia: 0 })));
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Boda',
    date: '',
    sqm: '',
    message: ''
  });
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setIsLoadingModels(true);
      const supabase = getSupabase();
      if (!supabase) {
        setModels(MODELS.map((m, i) => ({ ...m, id: String(i), dimensiones: '', capacidad_personas: 0, precio_referencia: 0 })));
        return;
      }

      const { data, error } = await supabase
        .from('carpas')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const mappedModels: ModelUI[] = data.slice(0, 4).map((item, index) => ({
          id: item.id,
          title: item.nombre || 'Modelo TensaCover',
          tag: item.categoria || 'Premium',
          desc: item.descripcion || 'Elegancia y protección para tus eventos.',
          features: Array.isArray(item.caracteristicas) ? item.caracteristicas : (item.caracteristicas ? JSON.parse(item.caracteristicas) : []),
          // Fallback to galleryImages if imagen_url is null
          img: item.imagen_url || galleryImages[index % galleryImages.length],
          details: item.detalles || item.descripcion || '',
          popular: item.popular || false,
          dimensiones: item.dimensiones || 'Consultar',
          capacidad_personas: item.capacidad_personas || 0,
          precio_referencia: item.precio_referencia || 0
        }));

        // If we have few models in DB, supplement with static ones that aren't duplicates by title
        if (mappedModels.length < 3) {
          const existingTitles = new Set(mappedModels.map(m => m.title.toLowerCase()));
          const extraModels = MODELS
            .filter(m => !existingTitles.has(m.title.toLowerCase()))
            .map((m, i) => ({ ...m, id: `static-${i}`, dimensiones: 'Varios', capacidad_personas: 100, precio_referencia: 0 }));
          
          setModels([...mappedModels, ...extraModels].slice(0, 6));
        } else {
          setModels(mappedModels);
        }
      } else {
        // No data in DB, use all static models
        setModels(MODELS.map((m, i) => ({ ...m, id: String(i), dimensiones: 'Varios', capacidad_personas: 100, precio_referencia: 0 })));
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels(MODELS.map((m, i) => ({ ...m, id: String(i), dimensiones: '', capacidad_personas: 0, precio_referencia: 0 })));
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase no está configurado. Por favor, añade las variables de entorno.');
      }

      const { error } = await supabase
        .from('consultas_clientes')
        .insert([
          {
            nombre: formData.name,
            email: formData.email,
            telefono: formData.phone,
            modelo_carpa: selectedModel !== null ? models[selectedModel].title : 'General',
            mensaje: `Tipo Evento: ${formData.eventType}, Fecha: ${formData.date}, m2: ${formData.sqm}. Mensaje: ${formData.message}`,
            estado: 'Pendiente'
          }
        ]);

      if (error) throw error;

      // Enviar a Webhook de Make (Google Sheets)
      try {
        await fetch('https://hook.us2.make.com/haii242pqj329ql1ljkcn8pv3r7q59os', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.name,
            email: formData.email,
            telefono: formData.phone,
            modelo_carpa: selectedModel !== null ? models[selectedModel].title : 'General',
            mensaje: formData.message
          }),
        });
      } catch (webhookError) {
        console.error('Error al enviar al webhook de Make:', webhookError);
      }

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: 'Boda',
        date: '',
        sqm: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentGalleryIndex((prev) => (prev + newDirection + galleryImages.length) % galleryImages.length);
  };

  const handleViewDetails = (idx: number) => {
    setSelectedModel(idx);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const nextImage = () => {
    setLightboxIndex(prev => (prev === null ? null : (prev + 1) % galleryImages.length));
  };

  const prevImage = () => {
    setLightboxIndex(prev => (prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length));
  };

  return (
    <div className="min-h-screen font-sans">
      <AnimatePresence>
        {isVideoModalOpen && (
          <VideoModal 
            isOpen={isVideoModalOpen} 
            onClose={() => setIsVideoModalOpen(false)} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox 
            index={lightboxIndex} 
            onClose={() => setLightboxIndex(null)}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <TensaCoverLogo />
            </div>
            <nav className="hidden md:flex items-center gap-10">
              <a href="#models" className="text-sm font-semibold hover:text-primary transition-colors">Modelos</a>
              <a href="#gallery" className="text-sm font-semibold hover:text-primary transition-colors">Galería</a>
              <a 
                href="#quote" 
                className="bg-primary text-background-dark px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                Pedir Presupuesto
              </a>
            </nav>
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-700 hover:text-primary transition-colors"
                aria-label="Abrir menú"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white/95 backdrop-blur-lg border-t border-primary/10 overflow-hidden"
            >
              <nav className="flex flex-col p-6 space-y-4">
                <a 
                  href="#models" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-slate-800 hover:text-primary transition-colors py-2 border-b border-slate-100"
                >
                  Modelos
                </a>
                <a 
                  href="#gallery" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-slate-800 hover:text-primary transition-colors py-2 border-b border-slate-100"
                >
                  Galería
                </a>
                <a 
                  href="#quote" 
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-primary text-background-dark px-6 py-4 rounded-xl text-center font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Pedir Presupuesto
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10"></div>
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-over-a-tent-40340-large.mp4" type="video/mp4" />
            <img 
              src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1920" 
              alt="Carpas Beduinas" 
              className="w-full h-full object-cover"
            />
          </video>
        </div>
        <div className="relative z-20 max-w-4xl px-4 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/20 text-primary border border-primary/30 rounded-full backdrop-blur-sm"
          >
            Eventos de Alto Nivel
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight"
          >
            Exclusividad y Magia <br/><span className="text-primary">Bajo las Estrellas</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 font-medium"
          >
            Transformamos tus eventos con carpas beduinas de lujo diseñadas para momentos inolvidables. Estética orgánica y protección total.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#models" className="bg-primary text-background-dark px-10 py-4 rounded-xl text-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              Ver Catálogo <ArrowRight size={20} />
            </a>
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Play size={20} fill="currentColor" /> Ver Video
            </button>
            <a href="#quote" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all">
              Presupuesto Gratis
            </a>
          </motion.div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="models">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Modelos</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 max-w-xl mx-auto">Selecciona la estructura que mejor se adapte a tu evento. Todas nuestras carpas son 100% impermeables y resistentes al viento.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {models.map((model, idx) => (
            <motion.div 
              key={model.id || idx}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] transition-all duration-300 ${model.popular ? 'ring-2 ring-primary shadow-xl shadow-primary/10' : 'shadow-md'}`}
            >
              <div className="h-64 overflow-hidden relative">
                {model.popular && (
                  <div className="absolute top-4 left-4 z-10 bg-primary text-background-dark px-4 py-1 rounded-full text-xs font-black uppercase">Más popular</div>
                )}
                <img 
                  src={model.img} 
                  alt={model.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                  loading="lazy"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{model.title}</h3>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">{model.tag}</span>
                </div>
                <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">{model.desc}</p>
                
                {/* Supabase dynamic fields */}
                {(model.dimensiones || model.capacidad_personas || model.precio_referencia > 0) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs font-bold text-slate-400 uppercase">
                    {model.dimensiones && <span>{model.dimensiones}</span>}
                    {model.capacidad_personas > 0 && <span>{model.capacidad_personas} pax</span>}
                    {model.precio_referencia > 0 && (
                      <span className="text-primary">
                        Desde {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(model.precio_referencia)}
                      </span>
                    )}
                  </div>
                )}

                <ul className="space-y-3 mb-8">
                  {model.features.slice(0, 2).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                      <CheckCircle2 className="text-primary" size={18} /> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleViewDetails(idx)}
                    className="w-full py-3 rounded-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-background-dark transition-all"
                  >
                    Ver Detalles
                  </button>
                  <a 
                    href="#quote"
                    className={`w-full py-3 rounded-lg font-bold text-center transition-all ${model.popular ? 'bg-primary text-background-dark hover:opacity-90' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    Saber más
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Model Details Section */}
        <AnimatePresence>
          {selectedModel !== null && (
            <motion.div 
              ref={detailsRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-24 pt-24 border-t border-slate-200 overflow-hidden"
            >
              <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-primary/10">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-1/2">
                    <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/20 text-primary border border-primary/30 rounded-full">
                      Detalles del Modelo {models[selectedModel].title}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                      La excelencia en <span className="text-primary">cada detalle</span>
                    </h3>
                    <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                      {models[selectedModel].details}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                      {models[selectedModel].features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-background-light rounded-2xl border border-slate-100">
                          <div className="bg-primary p-2 rounded-lg">
                            <CheckCircle2 size={20} className="text-background-dark" />
                          </div>
                          <span className="font-bold text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setSelectedModel(null)}
                      className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2 transition-colors"
                    >
                      Cerrar detalles <X size={18} />
                    </button>
                  </div>
                  <div className="lg:w-1/2 relative">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                      <img 
                        src={models[selectedModel].img} 
                        alt={models[selectedModel].title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute -bottom-6 -left-6 bg-primary text-background-dark p-8 rounded-3xl shadow-xl max-w-[250px]">
                      <p className="text-sm font-black uppercase tracking-widest mb-2">Capacidad</p>
                      <p className="text-2xl font-extrabold">
                        {models[selectedModel].capacidad_personas ? `+${models[selectedModel].capacidad_personas} personas` : (selectedModel === 2 ? '+500 personas' : 'Hasta 200 personas')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Clients Section - Professional Logo Cloud */}
      <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Empresas que confían en nosotros</h2>
          <div className="w-12 h-1 bg-primary/30 mx-auto rounded-full"></div>
        </div>
        
        <div className="relative flex overflow-x-hidden">
          <motion.div 
            className="flex whitespace-nowrap gap-12 md:gap-24 items-center py-4"
            animate={{ x: [0, -1920] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              }
            }}
          >
            {/* First set of logos */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div 
                key={`client-${i}`} 
                className="flex items-center justify-center min-w-[150px] md:min-w-[200px] grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer group"
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -15,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="relative">
                  {/* Placeholder for actual logo */}
                  <div className="h-12 md:h-16 w-32 md:w-48 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-300">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-primary/50">Logo Cliente {i}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Duplicate set for infinite scroll effect */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div 
                key={`client-dup-${i}`} 
                className="flex items-center justify-center min-w-[150px] md:min-w-[200px] grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer group"
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -15,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="relative">
                  <div className="h-12 md:h-16 w-32 md:w-48 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-300">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-primary/50">Logo Cliente {i}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Gradient Overlays for smooth fade effect at edges */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* Gallery Section - Carousel Version */}
      <section className="py-24 bg-background-light" id="gallery">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Galería de Inspiración</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 max-w-xl mx-auto">Momentos únicos capturados en nuestros montajes. Estética, lujo y funcionalidad en cada detalle.</p>
          </div>
          
          <div className="relative group max-w-5xl mx-auto">
            <div className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative bg-slate-900 border border-white/10 group/carousel">
              {/* Background Blur for smoother transitions */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <AnimatePresence initial={false}>
                  <motion.img 
                    key={`blur-${currentGalleryIndex}`}
                    src={galleryImages[currentGalleryIndex]} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="w-full h-full object-cover blur-3xl scale-110" 
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
              </div>

              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentGalleryIndex}
                  custom={direction}
                  variants={{
                    enter: (direction: number) => ({
                      x: direction > 0 ? '100%' : '-100%',
                      opacity: 0,
                      scale: 1.15,
                      rotateY: direction > 0 ? 15 : -15,
                      perspective: 1200
                    }),
                    center: {
                      zIndex: 1,
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      rotateY: 0,
                      perspective: 1200
                    },
                    exit: (direction: number) => ({
                      zIndex: 0,
                      x: direction < 0 ? '100%' : '-100%',
                      opacity: 0,
                      scale: 0.85,
                      rotateY: direction < 0 ? -15 : 15,
                      perspective: 1200
                    })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 180, damping: 24 },
                    opacity: { duration: 0.6 },
                    scale: { duration: 0.7 },
                    rotateY: { duration: 0.7 }
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <motion.div 
                    className="w-full h-full relative overflow-hidden"
                    variants={{
                      enter: (direction: number) => ({
                        x: direction > 0 ? '-40%' : '40%',
                      }),
                      center: {
                        x: '0%',
                      },
                      exit: (direction: number) => ({
                        x: direction < 0 ? '-40%' : '30%',
                      })
                    }}
                    transition={{
                      x: { type: "spring", stiffness: 180, damping: 24 }
                    }}
                  >
                    <motion.img
                      src={galleryImages[currentGalleryIndex]}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(_, { offset, velocity }) => {
                        const swipe = Math.abs(offset.x) * velocity.x;
                        if (swipe < -10000) {
                          paginate(1);
                        } else if (swipe > 10000) {
                          paginate(-1);
                        }
                      }}
                      animate={{ 
                        scale: [1.1, 1.2, 1.1],
                      }}
                      whileHover={{ scale: 1.25, filter: "brightness(1.1)" }}
                      transition={{ 
                        scale: { duration: 25, repeat: Infinity, ease: "linear" },
                        filter: { duration: 0.3 }
                      }}
                      className="w-full h-full object-cover cursor-pointer active:cursor-grabbing transition-all duration-500"
                      onClick={() => setLightboxIndex(currentGalleryIndex)}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    {/* Vignette effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none z-10"></div>
                    
                    {/* Progress Bar for the active slide */}
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      key={`progress-${currentGalleryIndex}`}
                      transition={{ duration: 6, ease: "linear" }}
                      onAnimationComplete={() => paginate(1)}
                      className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary origin-left z-30 shadow-[0_0_15px_rgba(102,188,41,0.5)]"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows - More visible and glass-like */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-10 pointer-events-none z-30">
                <button 
                  onClick={() => paginate(-1)}
                  className="pointer-events-auto bg-white/5 backdrop-blur-2xl hover:bg-primary hover:text-background-dark text-white p-3 md:p-6 rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover/carousel:opacity-100 border border-white/10 shadow-2xl active:scale-90 group/btn"
                >
                  <ChevronLeft size={20} className="md:w-10 md:h-10 group-hover/btn:-translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => paginate(1)}
                  className="pointer-events-auto bg-white/5 backdrop-blur-2xl hover:bg-primary hover:text-background-dark text-white p-3 md:p-6 rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover/carousel:opacity-100 border border-white/10 shadow-2xl active:scale-90 group/btn"
                >
                  <ChevronRight size={20} className="md:w-10 md:h-10 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Caption / Counter Overlay */}
              <div className="absolute top-4 left-4 md:top-10 md:left-10 z-30">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`counter-${currentGalleryIndex}`}
                  className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-white shadow-2xl"
                >
                  <span className="text-primary font-black text-base md:text-lg mr-2">{String(currentGalleryIndex + 1).padStart(2, '0')}</span>
                  <span className="text-white/40 font-bold text-xs md:text-sm uppercase tracking-widest">/ {String(galleryImages.length).padStart(2, '0')}</span>
                </motion.div>
              </div>

              {/* Index Indicator - Organic dots */}
              <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4 bg-black/20 backdrop-blur-2xl px-4 md:px-8 py-2 md:py-4 rounded-full border border-white/5 z-30">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentGalleryIndex ? 1 : -1);
                      setCurrentGalleryIndex(idx);
                    }}
                    className="relative group/dot"
                  >
                    <div className={`h-1.5 md:h-2.5 rounded-full transition-all duration-700 ease-out ${idx === currentGalleryIndex ? 'bg-primary w-8 md:w-14' : 'bg-white/20 w-1.5 md:w-2.5 group-hover/dot:bg-white/40'}`} />
                    {idx === currentGalleryIndex && (
                      <motion.div 
                        layoutId="activeDot"
                        className="absolute inset-0 bg-primary blur-sm opacity-50 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Swipe Hint for Mobile */}
            <div className="mt-8 text-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                <span className="hidden sm:inline">Imagen {currentGalleryIndex + 1} de {galleryImages.length} • Haz clic para ampliar</span>
                <span className="sm:hidden flex items-center gap-2 animate-pulse">
                  <ArrowRight size={14} /> Desliza para ver más
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="quote">
        <div className="bg-primary/5 rounded-[2rem] border border-primary/20 overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-2/5 p-12 lg:p-16 flex flex-col justify-center bg-primary text-background-dark">
            <h2 className="text-4xl font-extrabold mb-6">Empecemos a planificar</h2>
            <p className="text-lg opacity-90 mb-8 font-medium">Completa el formulario y uno de nuestros asesores técnicos te contactará en menos de 24 horas con una propuesta personalizada.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-background-dark/10 p-2 rounded-lg">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold opacity-60">Llámanos</p>
                  <p className="text-lg font-bold">+34 900 123 456</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-background-dark/10 p-2 rounded-lg">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold opacity-60">Escríbenos</p>
                  <p className="text-lg font-bold">info@carpaspremium.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-3/5 p-12 lg:p-16 bg-white relative">
            <AnimatePresence>
              {isSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="bg-primary/20 p-4 rounded-full mb-6">
                    <CheckCircle2 size={48} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-slate-600">Gracias por contactarnos. Un asesor técnico se pondrá en contacto contigo muy pronto.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-primary font-bold hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {submitError && (
                <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle size={18} />
                  {submitError}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Nombre Completo</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text" 
                  className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Ej: Juan Pérez" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Email</label>
                <input 
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email" 
                  className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="juan@ejemplo.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Teléfono</label>
                <input 
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel" 
                  className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="+34 600 000 000" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Tipo de Evento</label>
                <select 
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                >
                  <option>Boda</option>
                  <option>Corporativo</option>
                  <option>Privado / Fiesta</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">Fecha Estimada</label>
                <input 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  type="date" 
                  className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold opacity-70">M² Estimados</label>
                <input 
                  name="sqm"
                  value={formData.sqm}
                  onChange={handleInputChange}
                  type="number" 
                  className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Ej: 150" 
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-sm font-bold opacity-70">Mensaje / Detalles adicionales</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Cuéntanos más sobre tu visión..." 
                  rows={4}
                ></textarea>
              </div>
              <div className="sm:col-span-2 mt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full bg-primary text-background-dark py-4 rounded-xl text-lg font-bold transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full"
                      />
                      Enviando...
                    </>
                  ) : 'Solicitar Presupuesto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-dark text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <TensaCoverLogo light className="mb-6" />
            <p className="max-w-sm mb-8">Especialistas en la creación de espacios efímeros de lujo y soluciones de cubrición tensada para los eventos más exigentes.</p>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Síguenos</h4>
              <div className="flex gap-4">
                <motion.a 
                  href="https://instagram.com/#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  whileHover={{ scale: 1.1, backgroundColor: "#E4405F", borderColor: "#E4405F", color: "#fff" }}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 text-slate-400"
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a 
                  href="https://facebook.com/#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  whileHover={{ scale: 1.1, backgroundColor: "#1877F2", borderColor: "#1877F2", color: "#fff" }}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 text-slate-400"
                >
                  <Facebook size={20} />
                </motion.a>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Navegación</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="#models" className="hover:text-primary transition-colors">Modelos</a></li>
              <li><a href="#gallery" className="hover:text-primary transition-colors">Galería</a></li>
              <li><a href="#quote" className="hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-primary transition-colors">Aviso Legal</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-sm">
          <p>© {new Date().getFullYear()} TensaCover. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Floating Widgets */}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
