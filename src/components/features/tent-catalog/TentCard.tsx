import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { TentUI } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface TentCardProps {
  tent: TentUI;
  onViewDetails: () => void;
}

export function TentCard({ tent, onViewDetails }: TentCardProps) {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] transition-all duration-300 ${
        tent.popular ? 'ring-2 ring-primary shadow-xl shadow-primary/10' : 'shadow-md'
      }`}
    >
      <div className="h-64 overflow-hidden relative">
        {tent.popular && (
          <div className="absolute top-4 left-4 z-10 bg-primary text-background-dark px-4 py-1 rounded-full text-xs font-black uppercase">
            Más popular
          </div>
        )}
        <img
          src={tent.img}
          alt={`Carpa beduina modelo ${tent.title}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold">{tent.title}</h3>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
            {tent.tag}
          </span>
        </div>

        <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">{tent.desc}</p>

        {(tent.dimensiones || tent.capacidad_personas > 0 || tent.precio_referencia > 0) && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs font-bold text-slate-400 uppercase">
            {tent.dimensiones && <span>{tent.dimensiones}</span>}
            {tent.capacidad_personas > 0 && <span>{tent.capacidad_personas} pax</span>}
            {tent.precio_referencia > 0 && (
              <span className="text-primary">Desde {formatCurrency(tent.precio_referencia)}</span>
            )}
          </div>
        )}

        <ul className="space-y-3 mb-8">
          {tent.features.slice(0, 2).map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 className="text-primary shrink-0" size={18} />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <button
            onClick={onViewDetails}
            className="w-full py-3 rounded-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-background-dark transition-all"
          >
            Ver Detalles
          </button>
          <a
            href="#presupuesto"
            className={`w-full py-3 rounded-lg font-bold text-center transition-all ${
              tent.popular
                ? 'bg-primary text-background-dark hover:opacity-90'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            Saber más
          </a>
        </div>
      </div>
    </motion.div>
  );
}
