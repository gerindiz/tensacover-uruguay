import { useState } from 'react';
import type { ContactFormData } from '@/types';
import { getSupabaseClient } from '@/lib/supabase';
import { sendToMakeWebhook } from '@/lib/make';

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  eventType: 'Boda',
  date: '',
  sqm: '',
  message: '',
};

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent, selectedModel: string) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase no está configurado.');

      const { error: dbError } = await supabase.from('consultas_clientes').insert([
        {
          nombre: formData.name,
          email: formData.email,
          telefono: formData.phone,
          modelo_carpa: selectedModel,
          mensaje: `Tipo Evento: ${formData.eventType}, Fecha: ${formData.date}, m2: ${formData.sqm}. Mensaje: ${formData.message}`,
          estado: 'Pendiente',
        },
      ]);

      if (dbError) throw dbError;

      // Fire-and-forget to Make webhook
      sendToMakeWebhook(formData, selectedModel).catch(console.error);

      setIsSubmitted(true);
      setFormData(INITIAL_FORM);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al enviar la solicitud.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { formData, handleChange, handleSubmit, isSubmitting, isSubmitted, error, setIsSubmitted };
}
