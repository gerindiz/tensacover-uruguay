import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');

serve(async (req) => {
  try {
    const { record } = await req.json();
    if (!record) {
      return new Response(JSON.stringify({ error: 'No record in payload' }), { status: 400 });
    }

    const { nombre, email, telefono, modelo_carpa, mensaje } = record;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'TensaCover <noreply@tensacover.com.uy>',
        to: [ADMIN_EMAIL],
        subject: `🏕️ Nuevo Lead: ${nombre} — ${modelo_carpa}`,
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
            <div style="background: #66bc29; padding: 24px 32px;">
              <h2 style="color: #1a1a1a; margin: 0; font-size: 20px;">Nuevo cliente potencial</h2>
            </div>
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                ${[
                  ['Nombre', nombre],
                  ['Email', email],
                  ['Teléfono', telefono],
                  ['Modelo', modelo_carpa],
                ].map(([label, value]) => `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; width: 120px; color: #555;">${label}</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a1a;">${value}</td>
                  </tr>
                `).join('')}
              </table>
              <div style="margin-top: 24px; padding: 16px; background: #f8f8f5; border-radius: 8px;">
                <p style="font-weight: 600; margin: 0 0 8px; color: #555;">Mensaje:</p>
                <p style="color: #333; margin: 0; line-height: 1.6;">${mensaje}</p>
              </div>
              <p style="margin-top: 32px; font-size: 12px; color: #aaa; text-align: center;">
                Notificación automática — TensaCover Uruguay
              </p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
