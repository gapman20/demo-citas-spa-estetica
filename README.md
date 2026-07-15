# Serenity Spa ✦ Centro de Estética y Bienestar

Aplicación web SPA para un centro de estética con identidad visual distintiva. Los clientes exploran servicios, conocen al equipo, recorren la galería y agendan turnos online con verificación de disponibilidad en tiempo real.

## ✦ Stack

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 (JSX) |
| Bundler | Vite 8 |
| Routing | React Router v7 (HashRouter) |
| Estilos | CSS Modules + design tokens (variables CSS) |
| API | Vercel Function — `/api/sync-calendar` (proxy a Google Calendar API) |
| Tipografía | Fraunces (display) + DM Sans (body) — Google Fonts |

## ✦ Funcionalidades

- **Catálogo de servicios** — Explorar por categorías con grid responsive y stagger animation
- **Staff** — Perfiles del equipo con foto, especialidad y servicios asociados
- **Galería** — Grid de imágenes con lightbox, navegación y zoom on hover
- **Agendamiento** — Wizard de 5 pasos: servicio → profesional → fecha → datos → confirmación.
  Verificación de disponibilidad en tiempo real contra Google Calendar.
- **Panel admin** — Login protegido, tabla de citas próximas, eliminación de turnos, sesión via localStorage
- **Contacto** — Información del centro y formulario de contacto (demo)
- **Detalle de servicio** — Página individual para cada tratamiento con pre-selección en booking
- **Booking inteligente** — Parámetros query (`?service=`, `?staff=`) para pre-seleccionar y saltar pasos

## ✦ Identidad Visual

El diseño busca distinguirse de los templates genéricos de spa:

- **Tipografía**: Fraunces (display) con su eje óptico "soft" para titulares cálidos, DM Sans para cuerpo legible
- **Aura ambiente**: Las secciones sobre fondo oscuro (hero, CTA, footer) tienen un gradiente radial cálido que simula luz natural entrando al espacio
- **Sistema decorativo**: La estrella ✦ funciona como elemento unificador — ornamenta encabezados de sección, aparece como watermark en hover sobre las cards y es parte del branding
- **Animaciones**: Scroll reveals con stagger, entrada de página con fadeInUp, pulso en CTA primario, fondo del hero con drift suave
- **Paleta**: Teal profundo + rosa terracota + dorado cálido como acento secundario
- **Responsive**: Adaptativo hasta mobile, menú hamburguesa, grillas colapsan a 1 columna

## ✦ Estructura

```
src/
├── components/
│   ├── admin/          # Panel de administración
│   ├── booking/        # Wizard de reserva (5 pasos + contexto)
│   ├── layout/         # Header, Footer, Navbar, MobileMenu, ScrollToTop
│   └── shared/         # ServiceCard, StaffCard, GalleryImage, Lightbox, EmptyState, etc.
├── data/               # Datos estáticos (servicios, staff, galería, clínica)
├── hooks/              # useAdminAuth, useAvailability, useCalendarApi, useInView
├── lib/                # api.js — fetch wrapper
├── pages/              # Componentes de página (Home, Services, Booking, etc.)
├── App.jsx             # Configuración de rutas + ErrorBoundary + lazy loading
├── index.css           # Design tokens, reset, animaciones globales
└── main.jsx            # Entry point
```

## ✦ Desarrollo local

Para desarrollo básico (solo frontend sin probar las conexiones a la API):
```bash
pnpm install
pnpm dev         # → http://localhost:5173
```

### Probar el Backend (API de Calendar) localmente

Dado que el proyecto utiliza Vercel Serverless Functions (`/api`), para probar el flujo de reservas completo necesitás usar el CLI de Vercel:

1. Instalá el CLI oficial: `npm i -g vercel`
2. Creá un archivo `.env` en la raíz copiando el formato de `.env.example` y agregá tus credenciales de Google.
3. Linkeá el proyecto y levantá el entorno completo:
```bash
vercel link
vercel dev       # → http://localhost:3000 (Levanta Vite + Node Serverless API)
```

### Otros comandos
```bash
pnpm build       # Build de producción → dist/
pnpm preview     # Preview del build
pnpm lint        # Linter de código
```

## ✦ Despliegue

La app está diseñada para deploy en **Vercel**:

1. Conectá el repositorio a Vercel
2. Configurá las variables de entorno necesarias para la Serverless Function:

| Variable | Descripción |
|----------|-------------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email de la service account de Google Cloud |
| `GOOGLE_PRIVATE_KEY` | Clave privada de la service account |
| `GOOGLE_CALENDAR_ID` | ID del calendario de Google Calendar |

3. El build se genera automáticamente con `vite build`
4. El deploy incluye CI/CD via GitHub Actions (`.github/workflows/deploy.yml`)

> Sin las variables de entorno, la API opera en **modo mock** para desarrollo local.

## ✦ Admin

- **Ruta**: `/#/admin`
- **Credenciales demo**: `admin` / `admin123`
- La sesión persiste via `localStorage`
- El panel muestra citas confirmadas próximas, permite eliminarlas y ver el historial
