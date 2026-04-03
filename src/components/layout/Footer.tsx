import { Instagram, Facebook } from 'lucide-react';
import { motion } from 'motion/react';
import { CONTACT_PHONE, CONTACT_EMAIL, INSTAGRAM_URL, FACEBOOK_URL } from '@/constants';

export function Footer() {
  return (
    <footer className="bg-background-dark text-slate-400 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <img
            src="/images/logo.jpg"
            alt="TensaCover Uruguay"
            className="h-14 w-auto object-contain mb-6 opacity-90"
          />
          <p className="max-w-sm mb-8">
            Especialistas en carpas beduinas de lujo para los eventos más exigentes de Uruguay.
          </p>
          <div className="space-y-2 mb-8 text-sm">
            <p>{CONTACT_PHONE}</p>
            <p>{CONTACT_EMAIL}</p>
          </div>
          <div className="flex gap-4">
            <motion.a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, backgroundColor: '#E4405F', borderColor: '#E4405F', color: '#fff' }}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300"
            >
              <Instagram size={20} />
            </motion.a>
            <motion.a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, backgroundColor: '#1877F2', borderColor: '#1877F2', color: '#fff' }}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300"
            >
              <Facebook size={20} />
            </motion.a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Navegación</h4>
          <ul className="space-y-4">
            {[['#', 'Inicio'], ['#modelos', 'Modelos'], ['#galeria', 'Galería'], ['#presupuesto', 'Contacto']].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:text-primary transition-colors">{label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4">
            {[['#', 'Aviso Legal'], ['#', 'Privacidad'], ['#', 'Cookies']].map(([href, label]) => (
              <li key={label}>
                <a href={href} className="hover:text-primary transition-colors">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-sm">
        <p>© {new Date().getFullYear()} TensaCover Uruguay. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
