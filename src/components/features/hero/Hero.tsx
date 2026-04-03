import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onOpenVideo: () => void;
}

export function Hero({ onOpenVideo }: HeroProps) {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden pt-20">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
          {/* Fallback si no hay video */}
          <img
            src="/images/hero-fallback.jpg"
            alt="Carpa beduina de lujo para eventos en Uruguay"
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
          Eventos de Alto Nivel — Uruguay
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight"
        >
          Exclusividad y Magia <br />
          <span className="text-primary">Bajo las Estrellas</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 font-medium"
        >
          Transformamos tus eventos con carpas beduinas de lujo diseñadas para momentos inolvidables.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#modelos"
            className="bg-primary text-background-dark px-10 py-4 rounded-xl text-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            Ver Catálogo <ArrowRight size={20} />
          </a>
          <button
            onClick={onOpenVideo}
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Play size={20} fill="currentColor" /> Ver Video
          </button>
          <a
            href="#presupuesto"
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all"
          >
            Presupuesto Gratis
          </a>
        </motion.div>
      </div>
    </section>
  );
}
