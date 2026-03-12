import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')

serve(async (req) => {
  try {
    // Supabase Webhook payload
    const payload = await req.json()
    const { record } = payload

    if (!record) {
      return new Response(JSON.stringify({ error: 'No record found in payload' }), { status: 400 })
    }

    const { nombre, email, telefono, modelo_carpa, mensaje } = record

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'TensaCover <notifications@resend.dev>', // O tu dominio verificado en Resend
        to: [ADMIN_EMAIL],
        subject: `🚀 Nuevo Lead: ${nombre} - ${modelo_carpa}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #f27d26; padding-bottom: 10px;">Nuevo Cliente Potencial</h2>
            <p>Se ha recibido una nueva consulta a través de la web:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Nombre:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${telefono}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Modelo:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${modelo_carpa}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; bg-color: #f9f9f9; border-radius: 5px;">
              <p style="font-weight: bold; margin-bottom: 5px;">Detalles adicionales:</p>
              <p style="color: #666; font-style: italic;">${mensaje}</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
              Este es un mensaje automático enviado desde el sistema de gestión de TensaCover.
            </p>
          </div>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
