# Serenity Spa — Centro de Estética y Bienestar

Aplicación web SPA (single-page application) para un centro de estética que permite a los clientes explorar servicios, conocer al equipo profesional, ver la galería del centro y agendar citas online con integración a Google Calendar.

## Stack

- **Framework**: React 19 (JSX)
- **Bundler**: Vite 8
- **Routing**: React Router v7 (HashRouter)
- **API**: Vercel Function (`/api/sync-calendar`) que proxy a Google Calendar API
- **Estilos**: CSS Modules + design tokens (variables CSS)

## Estructura

```
src/
├── components/
│   ├── admin/        # Panel de administración
│   ├── booking/      # Wizard de reserva (5 pasos)
│   ├── layout/       # Header, Footer, Navbar, MobileMenu
│   └── shared/       # Componentes reutilizables
├── data/             # Datos estáticos (servicios, staff, galería, clínica)
├── hooks/            # Custom hooks (useAdminAuth, useAvailability, useCalendarApi)
├── lib/              # Utilidades (api.js — fetch wrapper)
├── pages/            # Componentes de página (ruteo)
├── App.jsx           # Configuración de rutas
└── main.jsx          # Entry point
```

## Funcionalidades

- **Catálogo de servicios** — Explorar por categorías con grid responsive
- **Staff** — Perfiles del equipo con servicios asociados
- **Galería** — Grid de imágenes con lightbox y navegación
- **Agendamiento** — Wizard de 5 pasos con verificación de disponibilidad en tiempo real
- **Panel admin** — Login protegido, tabla de citas próximas, eliminación de turnos
- **Contacto** — Información del centro, mapa, formulario de contacto (demo)

## Desarrollo

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm build     # Build de producción → dist/
pnpm preview   # Preview del build
```

## Despliegue

La app está diseñada para deploy en Vercel:

1. Conectá el repo a Vercel
2. Configurá las variables de entorno necesarias para la Function:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
   - `GOOGLE_CALENDAR_ID`
3. El build se genera automáticamente con `vite build`

> Sin las variables de entorno, la Function opera en modo mock para desarrollo local.

## Admin

- Ruta: `/#/admin`
- Credenciales (demo): `admin` / `admin123`
- Persistencia de sesión via localStorage
