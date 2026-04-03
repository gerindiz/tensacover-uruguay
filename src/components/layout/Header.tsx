import { useState } from 'react';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="/" aria-label="TensaCover - Inicio">
            <img
              src="/images/logo.jpg"
              alt="TensaCover Uruguay"
              className="h-14 w-auto object-contain"
            />
          </a>

          <nav className="hidden md:flex items-center gap-10">
            <a href="#modelos" className="text-sm font-semibold hover:text-primary transition-colors">Modelos</a>
            <a href="#galeria" className="text-sm font-semibold hover:text-primary transition-colors">Galería</a>
            <a
              href="#presupuesto"
              className="bg-primary text-background-dark px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Pedir Presupuesto
            </a>
          </nav>

          <button
            className="md:hidden p-2 text-slate-700 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-primary/10 overflow-hidden"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {['#modelos', '#galeria'].map((href) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-slate-800 hover:text-primary transition-colors py-2 border-b border-slate-100 capitalize"
                >
                  {href.replace('#', '')}
                </a>
              ))}
              <a
                href="#presupuesto"
                onClick={() => setIsMenuOpen(false)}
                className="bg-primary text-background-dark px-6 py-4 rounded-xl text-center font-bold shadow-lg"
              >
                Pedir Presupuesto
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
