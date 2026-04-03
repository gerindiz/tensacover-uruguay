import type { ContactFormData } from '@/types';

interface WebhookPayload {
  nombre: string;
  email: string;
  telefono: string;
  modelo_carpa: string;
  mensaje: string;
}

export async function sendToMakeWebhook(formData: ContactFormData, modelName: string): Promise<void> {
  const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('[Make] Webhook URL not configured. Skipping.');
    return;
  }

  const payload: WebhookPayload = {
    nombre: formData.name,
    email: formData.email,
    telefono: formData.phone,
    modelo_carpa: modelName,
    mensaje: formData.message,
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
