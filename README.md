# TensaCover Uruguay 🏕️

Sitio web de carpas beduinas de lujo para eventos. Construido con React + Vite + Supabase + Make.

## Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Estilos:** Tailwind CSS v4 + Manrope font
- **Animaciones:** Motion (Framer Motion)
- **Base de datos:** Supabase (PostgreSQL)
- **Automatización:** Make (Integromat) via webhook
- **Deploy:** Vercel

---

## 🚀 Setup inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local

# 3. Completar .env.local con tus credenciales reales

# 4. Correr en desarrollo
npm run dev
```

---

## 🔑 Variables de entorno

Editá `.env.local` con tus valores reales:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_MAKE_WEBHOOK_URL=https://hook.us2.make.com/tu-webhook
VITE_ADMIN_PASSWORD=tu-contraseña-segura
```

> ⚠️ **Nunca** commitees `.env.local` al repositorio.

---

## 🖼️ GUÍA DE REEMPLAZO DE IMÁGENES Y VIDEOS

Todos los archivos de medios van en la carpeta **`public/images/`**.

### Archivos requeridos

| Archivo | Descripción | Tamaño recomendado |
|---|---|---|
| `logo.jpg` | Logo de TensaCover | Altura mínima 200px, fondo transparente (PNG mejor) |
| `hero-video.mp4` | Video del hero (fondo) | 1920×1080, max 10MB, sin audio |
| `hero-fallback.jpg` | Imagen si el video no carga | 1920×1080 |
| `gallery-1.jpg` | Galería — imagen 1 | 1200×800 mínimo |
| `gallery-2.jpg` | Galería — imagen 2 | 1200×800 mínimo |
| `gallery-3.jpg` | Galería — imagen 3 | 1200×800 mínimo |
| `gallery-4.jpg` | Galería — imagen 4 | 1200×800 mínimo |
| `gallery-5.jpg` | Galería — imagen 5 | 1200×800 mínimo |
| `gallery-6.jpg` | Galería — imagen 6 | 1200×800 mínimo |
| `model-standard.jpg` | Foto modelo Standard | 800×600 mínimo |
| `model-premium.jpg` | Foto modelo Premium | 800×600 mínimo |
| `model-granxl.jpg` | Foto modelo Gran XL | 800×600 mínimo |

### Pasos para reemplazar

1. **Copiá tus archivos** con exactamente los nombres de la tabla de arriba en `public/images/`
2. **Verificá los formatos:** JPG para fotos, MP4 para video, PNG si el logo tiene transparencia
3. Para el logo en PNG: renombrá a `logo.png` y actualizá la ruta en `src/components/layout/Header.tsx` y `Footer.tsx`

### Video del hero

- Formato: `.mp4` (H.264)
- Sin audio (o con audio muteado)
- Máximo 10MB para buena performance en móvil
- Si tenés un video en YouTube, editá `src/pages/HomePage.tsx` y reemplazá `YOUTUBE_VIDEO_ID` con tu ID

### Agregar más imágenes a la galería

Editá `src/constants/index.ts` y agregá las rutas en `GALLERY_IMAGES`:

```ts
export const GALLERY_IMAGES = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  // ... agregá más acá
  '/images/gallery-7.jpg',
];
```

---

## 📁 Estructura del proyecto

```
tensacover-uruguay/
├── public/
│   └── images/          ← TODAS las fotos y videos van acá
├── src/
│   ├── components/
│   │   ├── layout/      ← Header, Footer
│   │   └── features/    ← Componentes por funcionalidad
│   ├── hooks/           ← Lógica reutilizable (Supabase, formulario)
│   ├── lib/             ← Servicios (supabase, make, utils)
│   ├── pages/           ← HomePage, AdminDashboard
│   ├── types/           ← TypeScript types
│   └── constants/       ← Datos estáticos y configuración
├── supabase/
│   └── migrations/      ← SQL del schema de la base de datos
└── .env.example         ← Plantilla de variables de entorno
```

---

## 🗄️ Base de datos (Supabase)

Tablas requeridas:

**`carpas`** — catálogo de modelos
```sql
id, nombre, categoria, descripcion, caracteristicas (jsonb),
imagen_url, detalles, popular, dimensiones,
capacidad_personas, precio_referencia
```

**`consultas_clientes`** — leads del formulario
```sql
id, created_at, nombre, email, telefono,
modelo_carpa, mensaje, estado
```

---

## 🔐 Panel Admin

Accedé en `/admin`. La contraseña se define en `VITE_ADMIN_PASSWORD` en tu `.env.local`.

---

## 📦 Deploy en Vercel

1. Conectá el repo en [vercel.com](https://vercel.com)
2. Configurá las variables de entorno en el dashboard de Vercel
3. Deploy automático en cada push a `main`
