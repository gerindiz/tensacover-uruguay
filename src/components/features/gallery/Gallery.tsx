import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_IMAGES } from '@/constants';

function Lightbox({
  index,
  onClose,
  onNext,
  onPrev,
}: {
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white z-[110] bg-white/10 p-2 rounded-full"
      >
        <X size={32} />
      </button>
      <button
        onClick={onPrev}
        className="absolute left-4 sm:left-10 text-white/70 hover:text-white z-[110] bg-white/10 p-3 rounded-full hover:scale-110"
      >
        <ChevronLeft size={40} />
      </button>

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative max-w-5xl max-h-[80vh] flex items-center justify-center"
      >
        <img
          src={GALLERY_IMAGES[index]}
          className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl"
          alt={`Galería TensaCover imagen ${index + 1}`}
        />
      </motion.div>

      <button
        onClick={onNext}
        className="absolute right-4 sm:right-10 text-white/70 hover:text-white z-[110] bg-white/10 p-3 rounded-full hover:scale-110"
      >
        <ChevronRight size={40} />
      </button>

      <div className="absolute bottom-10 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white/80 text-sm font-bold tracking-widest">
        {index + 1} / {GALLERY_IMAGES.length}
      </div>
    </motion.div>
  );
}

export function Gallery() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const paginate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  };

  return (
    <section className="py-24 bg-background-light" id="galeria">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Galería de Inspiración</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-slate-600 max-w-xl mx-auto">
            Momentos únicos capturados en nuestros montajes. Estética, lujo y funcionalidad en cada detalle.
          </p>
        </div>

        <div className="relative group max-w-5xl mx-auto">
          <div className="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative bg-slate-900 border border-white/10 group/carousel">
            {/* Blurred background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <AnimatePresence initial={false}>
                <motion.img
                  key={`blur-${current}`}
                  src={GALLERY_IMAGES[current]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="w-full h-full object-cover blur-3xl scale-110"
                  alt=""
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0, scale: 1.15 }),
                  center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
                  exit: (d: number) => ({ zIndex: 0, x: d < 0 ? '100%' : '-100%', opacity: 0, scale: 0.85 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: 'spring', stiffness: 180, damping: 24 }, opacity: { duration: 0.6 } }}
                className="absolute inset-0"
              >
                <motion.img
                  src={GALLERY_IMAGES[current]}
                  alt={`Galería TensaCover - imagen ${current + 1}`}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -10000) paginate(1);
                    else if (swipe > 10000) paginate(-1);
                  }}
                  animate={{ scale: [1.1, 1.2, 1.1] }}
                  transition={{ scale: { duration: 25, repeat: Infinity, ease: 'linear' } }}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setLightboxIndex(current)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none z-10" />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  key={`progress-${current}`}
                  transition={{ duration: 6, ease: 'linear' }}
                  onAnimationComplete={() => paginate(1)}
                  className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary origin-left z-30"
                />
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-10 pointer-events-none z-30">
              {[{ dir: -1, Icon: ChevronLeft }, { dir: 1, Icon: ChevronRight }].map(({ dir, Icon }) => (
                <button
                  key={dir}
                  onClick={() => paginate(dir)}
                  className="pointer-events-auto bg-white/5 backdrop-blur-2xl hover:bg-primary hover:text-background-dark text-white p-3 md:p-6 rounded-full transition-all border border-white/10 shadow-2xl active:scale-90"
                >
                  <Icon size={20} className="md:w-10 md:h-10" />
                </button>
              ))}
            </div>

            {/* Counter */}
            <div className="absolute top-4 left-4 md:top-10 md:left-10 z-30">
              <motion.div
                key={`counter-${current}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-xl text-white shadow-2xl"
              >
                <span className="text-primary font-black text-base md:text-lg mr-2">
                  {String(current + 1).padStart(2, '0')}
                </span>
                <span className="text-white/40 font-bold text-xs md:text-sm uppercase tracking-widest">
                  / {String(GALLERY_IMAGES.length).padStart(2, '0')}
                </span>
              </motion.div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4 bg-black/20 backdrop-blur-2xl px-4 md:px-8 py-2 md:py-4 rounded-full border border-white/5 z-30">
              {GALLERY_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
                >
                  <div
                    className={`h-1.5 md:h-2.5 rounded-full transition-all duration-700 ${
                      idx === current ? 'bg-primary w-8 md:w-14' : 'bg-white/20 w-1.5 md:w-2.5'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              <span className="hidden sm:inline">Imagen {current + 1} de {GALLERY_IMAGES.length} • Haz clic para ampliar</span>
              <span className="sm:hidden flex items-center gap-2 animate-pulse">
                <ArrowRight size={14} /> Desliza para ver más
              </span>
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNext={() => setLightboxIndex((prev) => ((prev ?? 0) + 1) % GALLERY_IMAGES.length)}
            onPrev={() => setLightboxIndex((prev) => ((prev ?? 0) - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
