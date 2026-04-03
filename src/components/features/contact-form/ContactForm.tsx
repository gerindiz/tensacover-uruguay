import { CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useContactForm } from '@/hooks/useContactForm';
import { EVENT_TYPES, CONTACT_PHONE, CONTACT_EMAIL } from '@/constants';

interface ContactFormProps {
  selectedModel: string;
}

export function ContactForm({ selectedModel }: ContactFormProps) {
  const { formData, handleChange, handleSubmit, isSubmitting, isSubmitted, error, setIsSubmitted } =
    useContactForm();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="presupuesto">
      <div className="bg-primary/5 rounded-[2rem] border border-primary/20 overflow-hidden flex flex-col lg:flex-row">
        {/* Info panel */}
        <div className="lg:w-2/5 p-12 lg:p-16 flex flex-col justify-center bg-primary text-background-dark">
          <h2 className="text-4xl font-extrabold mb-6">Empecemos a planificar</h2>
          <p className="text-lg opacity-90 mb-8 font-medium">
            Completá el formulario y uno de nuestros asesores te contactará en menos de 24 horas con
            una propuesta personalizada.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-background-dark/10 p-2 rounded-lg">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs uppercase font-bold opacity-60">Llamanos</p>
                <p className="text-lg font-bold">{CONTACT_PHONE}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-background-dark/10 p-2 rounded-lg">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs uppercase font-bold opacity-60">Escribinos</p>
                <p className="text-lg font-bold">{CONTACT_EMAIL}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
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
                <p className="text-slate-600">
                  Gracias por contactarnos. Un asesor se pondrá en contacto muy pronto.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-primary font-bold hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={(e) => handleSubmit(e, selectedModel)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {error && (
              <div className="sm:col-span-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {[
              { name: 'name', label: 'Nombre Completo', type: 'text', placeholder: 'Ej: Juan Pérez' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@ejemplo.com' },
              { name: 'phone', label: 'Teléfono', type: 'tel', placeholder: '+598 99 000 000' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} className="space-y-2">
                <label className="text-sm font-bold opacity-70">{label}</label>
                <input
                  required
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">Tipo de Evento</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">Fecha Estimada</label>
              <input
                name="date"
                value={formData.date}
                onChange={handleChange}
                type="date"
                className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">M² Estimados</label>
              <input
                name="sqm"
                value={formData.sqm}
                onChange={handleChange}
                type="number"
                placeholder="Ej: 150"
                className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-bold opacity-70">Mensaje / Detalles adicionales</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Contanos más sobre tu visión..."
                rows={4}
                className="w-full bg-background-light border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="sm:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-primary text-background-dark py-4 rounded-xl text-lg font-bold transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full"
                    />
                    Enviando...
                  </>
                ) : (
                  'Solicitar Presupuesto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
