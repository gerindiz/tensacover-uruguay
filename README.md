# TensaCover Uruguay 🇺🇾

Plataforma de gestión automatizada para servicios de estructuras tensadas y carpas beduinas. 

Este proyecto centraliza la captación de clientes a través de un formulario web optimizado, integrando la recepción de datos directamente con herramientas de automatización para una gestión comercial eficiente.

---

## 🚀 Acceso al Proyecto
Puedes ver la plataforma en funcionamiento aquí:
**[https://tensacover-uruguay-2awxiodo9-gerindizs-projects.vercel.app/]**

---

## 🛠 Stack Tecnológico
La solución ha sido construida bajo una arquitectura de alta disponibilidad y velocidad:

* **Frontend:** React + Vite
* **Estilos:** Tailwind CSS
* **Base de Datos:** Supabase
* **Automatización:** Make (Integromat)
* **Despliegue:** Vercel

---

## 📋 Funcionalidades
- **Formulario Inteligente:** Validación de datos en tiempo real para una experiencia de usuario fluida.
- **Integración Operativa:** Conexión automatizada con Google Sheets para el seguimiento comercial en tiempo real.
- **Diseño Responsivo:** Interfaz adaptada completamente a dispositivos móviles, ideal para usuarios en movimiento.
- **Despliegue Continuo:** Configuración CI/CD que permite actualizaciones constantes del sitio.

---

## 📸 Galería
*A continuación, se visualizan las herramientas que componen el flujo de trabajo:*

**Interfaz del Formulario:**
![Formulario Web](assets/web-form.png)

**Base de datos / Registro de Clientes:**
![Dashboard Google Sheets](assets/google-sheets.png)

---

## ⚙️ Configuración para Desarrollo
Si deseas trabajar sobre este código, asegúrate de configurar las siguientes variables de entorno:

```env
VITE_SUPABASE_URL=tu_url_aqui
VITE_SUPABASE_ANON_KEY=tu_clave_aqui

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
