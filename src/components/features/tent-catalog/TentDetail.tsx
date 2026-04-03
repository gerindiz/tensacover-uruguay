import { useRef } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { TentUI } from '@/types';

interface TentDetailProps {
  tent: TentUI | null;
  onClose: () => void;
}

export function TentDetail({ tent, onClose }: TentDetailProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {tent && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-24 pt-24 border-t border-slate-200 overflow-hidden"
        >
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-primary/10">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/20 text-primary border border-primary/30 rounded-full">
                  Modelo {tent.title}
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                  La excelencia en <span className="text-primary">cada detalle</span>
                </h3>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">{tent.details}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  {tent.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-background-light rounded-2xl border border-slate-100"
                    >
                      <div className="bg-primary p-2 rounded-lg shrink-0">
                        <CheckCircle2 size={20} className="text-background-dark" />
                      </div>
                      <span className="font-bold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2 transition-colors"
                >
                  Cerrar detalles <X size={18} />
                </button>
              </div>

              <div className="lg:w-1/2 relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={tent.img}
                    alt={tent.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary text-background-dark p-8 rounded-3xl shadow-xl max-w-[250px]">
                  <p className="text-sm font-black uppercase tracking-widest mb-2">Capacidad</p>
                  <p className="text-2xl font-extrabold">
                    {tent.capacidad_personas > 0
                      ? `+${tent.capacidad_personas} personas`
                      : 'Hasta 200 personas'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
