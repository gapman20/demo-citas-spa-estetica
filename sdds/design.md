# demo-spa-citas — Technical Design

Stack: Vite 8 + React 19 (JSX) + pnpm. Single Vercel Function (`api/sync-calendar.js`) proxies Google Calendar API via Service Account. Static seed data in `src/data/`. No database. Hash-based routing for zero server-config overhead.

---

## 1. File & Directory Structure

```
/
├── api/
│   └── sync-calendar.js            # Vercel Serverless Function (Google Calendar proxy)
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx          # Logo, nav links, CTA button
│   │   │   ├── Footer.jsx          # Clinic info, social links, copyright
│   │   │   ├── MobileDrawer.jsx    # Slide-out nav for ≤768px
│   │   │   └── Layout.jsx          # Header + <Outlet/> + Footer
│   │   ├── shared/
│   │   │   ├── LoadingSkeleton.jsx  # Configurable skeleton shapes
│   │   │   ├── ErrorMessage.jsx     # Error card with optional retry
│   │   │   ├── EmptyState.jsx       # Illustration + message + CTA
│   │   │   ├── ServiceCard.jsx      # Service thumbnail card
│   │   │   ├── StaffCard.jsx        # Staff thumbnail card
│   │   │   ├── GalleryImage.jsx     # Thumbnail with fallback
│   │   │   ├── Lightbox.jsx         # Full-screen image viewer
│   │   │   ├── TimeSlotGrid.jsx     # Available/occupied slot buttons
│   │   │   └── Toast.jsx            # Notification toast
│   │   ├── booking/
│   │   │   ├── BookingWizard.jsx    # Orchestrator: renders current step
│   │   │   ├── StepProgress.jsx     # Step indicator dots/bar
│   │   │   ├── StepService.jsx      # Step 1: pick service
│   │   │   ├── StepStaff.jsx        # Step 2: pick staff
│   │   │   ├── StepDateTime.jsx     # Step 3: date + time slot
│   │   │   ├── StepContact.jsx      # Step 4: name, phone, email, notes
│   │   │   ├── StepConfirm.jsx      # Step 5: summary + submit
│   │   │   └── BookingContext.jsx   # Context + reducer
│   │   └── admin/
│   │       ├── LoginForm.jsx        # Hardcoded credentials form
│   │       ├── DashboardTable.jsx   # Appointments table
│   │       └── AdminHeader.jsx      # Dashboard top bar with logout
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Professionals.jsx
│   │   ├── ProfessionalProfile.jsx
│   │   ├── Gallery.jsx
│   │   ├── Booking.jsx              # Wraps BookingWizard + context
│   │   ├── Contact.jsx
│   │   └── Admin.jsx
│   ├── data/
│   │   ├── services.js              # Service[] (static)
│   │   ├── staff.js                 # Staff[] (static)
│   │   ├── gallery.js               # GalleryItem[] (static)
│   │   └── clinic.js                # ClinicInfo (static)
│   ├── hooks/
│   │   ├── useAvailability.js       # Fetches + caches available slots
│   │   ├── useCalendarApi.js        # Generic POST to Vercel Function
│   │   └── useAdminAuth.js          # localStorage token + login/logout
│   ├── lib/
│   │   └── api.js                   # fetch wrapper with error handling
│   ├── App.jsx                      # RouterProvider
│   ├── App.css                      # App-level styles
│   ├── index.css                    # Global reset + CSS variables
│   └── main.jsx                     # Entry point
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 2. Component Tree

```
<App>
  <RouterProvider router={hashRouter}>
    <Layout>
      <Header>
        <Logo />
        <NavLinks />              ← desktop
        <MobileMenuToggle />
        <MobileDrawer />          ← mobile (conditional)
      </Header>
      <main>
        <Outlet />                ← React Router renders page here
      </main>
      <Footer />
    </Layout>
  </RouterProvider>
</App>

Routes and their content:

/  → <Home />
     Hero section, featured services, CTA to booking, clinic highlights

/servicios  → <Services />
              <CategoryTabs />        ← filter buttons
              <ServiceCard /> ×N      ← grid of cards

/profesionales  → <Professionals />
                  <StaffCard /> ×N    ← grid of cards

/profesionales/:id  → <ProfessionalProfile />
                      Staff bio, photo, service chips, "Agendar" CTA

/galeria  → <Gallery />
            <GalleryImage /> ×N       ← thumbnail grid
            <Lightbox />              ← conditional overlay

/agendar  → <Booking />
            <BookingProvider>
              <BookingWizard>
                <StepProgress />      ← 5-step indicator
                [active step renders]:
                  <StepService />     ← 1: select service
                  <StepStaff />       ← 2: select staff
                  <StepDateTime />    ← 3: date picker + <TimeSlotGrid />
                  <StepContact />     ← 4: name, phone, email, notes
                  <StepConfirm />     ← 5: summary + submit
              </BookingWizard>
            </BookingProvider>

/contacto  → <Contact />
             Clinic info (address, phone, hours, map)
             Contact form (demo — toast only)

/admin  → <Admin />
          (not authed) → <LoginForm />
          (authed) → <>
            <AdminHeader />
            <DashboardTable />    ← appointments table
          </>
```

---

## 3. Route Design

Using `createHashRouter` (React Router v7). Hash router avoids the need for server-side fallback rewrites — the hash fragment is never sent to the server, so Vercel serves `index.html` for every request naturally.

```js
// src/App.jsx
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import Professionals from './pages/Professionals.jsx'
import ProfessionalProfile from './pages/ProfessionalProfile.jsx'
import Gallery from './pages/Gallery.jsx'
import Booking from './pages/Booking.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'servicios', element: <Services /> },
      { path: 'profesionales', element: <Professionals /> },
      { path: 'profesionales/:id', element: <ProfessionalProfile /> },
      { path: 'galeria', element: <Gallery /> },
      { path: 'agendar', element: <Booking /> },
      { path: 'contacto', element: <Contact /> },
      { path: 'admin', element: <Admin /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
```

**All routes share the `<Layout />` shell** — Header renders at top, Footer at bottom, `<Outlet />` injects page content between them.

---

## 4. Data Flow Diagrams

### 4.1 Booking Flow (Create Appointment)

```
User                     SPA                     Vercel Function            Google Calendar API
 |                        |                            |                          |
 |-- fill wizard steps -->|                            |                          |
 |                        | (state in BookingContext)  |                          |
 |                        |                            |                          |
 |-- click Confirmar ---->|                            |                          |
 |                        |-- POST /api/sync-calendar   |                          |
 |                        |   { action: "create-event", |                          |
 |                        |     summary, start, end,    |                          |
 |                        |     description }           |                          |
 |                        |--------------------------->|                          |
 |                        |                            |-- (Service Account JWT)   |
 |                        |                            |-- POST events.insert ---->|
 |                        |                            |<--- { id, htmlLink } -----|
 |                        |<--- { success, event } -----|                          |
 |                        |                            |                          |
 |<-- confirmation card --|                            |                          |
```

### 4.2 Availability Check Flow

```
User                     SPA                     Vercel Function            Google Calendar API
 |                        |                            |                          |
 |-- select date -------->|                            |                          |
 |                        |-- POST /api/sync-calendar   |                          |
 |                        |   { action: "check-avail-   |                          |
 |                        |     ability", date, staffId}|                          |
 |                        |--------------------------->|                          |
 |                        |                            |-- GET events.list ------->|
 |                        |                            |   (timeMin/timeMax for   |
 |                        |                            |    selected date)         |
 |                        |                            |<--- [booked events] ------|
 |                        |                            |                            |
 |                        |                            |-- compute available:      |
 |                        |                            |   businessHours - booked  |
 |                        |<--- { available[],          |                            |
 |                        |       booked[] } -----------|                            |
 |                        |                            |                          |
 |<-- time slot grid -----|                            |                          |
```

**Short-circuit**: If `available` is empty → "No hay horarios disponibles" with suggestion to pick another day.

### 4.3 Admin Dashboard Flow

```
Admin                    SPA                     Vercel Function            Google Calendar API
 |                        |                            |                          |
 |-- login ------------>|                            |                          |
 |  (hardcoded check)   |                            |                          |
 |                        |-- localStorage.setItem('admin_token', 'true')          |
 |                        |                            |                          |
 |-- view dashboard ---->|                            |                          |
 |                        |-- POST /api/sync-calendar   |                          |
 |                        |   { action: "list-events",  |                          |
 |                        |     timeMin, timeMax }      |                          |
 |                        |--------------------------->|                          |
 |                        |                            |-- GET events.list ------->|
 |                        |                            |<--- [events] -------------|
 |                        |<--- { events } -------------|                          |
 |<-- table render ------|                            |                          |
 |                        |                            |                          |
 |-- delete event ------>|                            |                          |
 |                        |-- POST /api/sync-calendar   |                          |
 |                        |   { action: "delete-event", |                          |
 |                        |     eventId }               |                          |
 |                        |--------------------------->|                          |
 |                        |                            |-- DELETE event ---------->|
 |                        |                            |<--- success --------------|
 |                        |<--- { success } ------------|                          |
 |<-- row removed -------|                            |                          |
```

---

## 5. State Management Strategy

### 5.1 What Goes Where

| State | Mechanism | Why |
|-------|-----------|-----|
| Booking wizard data (serviceId, staffId, date, timeSlot, client info) | React Context + `useReducer` | Shared across 5 steps, persists on back navigation |
| Selected category filter | Local `useState` on page | Page-scoped, no sharing needed |
| Lightbox state (open, current index) | Local `useState` on page | Gallery-scoped |
| Admin auth flag | `localStorage` + `useState` sync | Survives refresh for demo |
| Admin events list | Local `useState` in `<Admin />` | Page-scoped, fetched on mount |
| Availability data (slots, loading, error) | Custom hook `useAvailability` | Encapsulated data fetching + cache |
| API response status | Local `useState` | Per-component concern |
| Contact form fields + validation | Local `useState` | Form-scoped |

### 5.2 BookingContext Shape

```js
// src/components/booking/BookingContext.jsx

const initialState = {
  serviceId: null,      // string | null
  staffId: null,        // string | null
  date: null,           // "YYYY-MM-DD" | null
  timeSlot: null,       // "HH:mm" | null
  clientName: '',       // string
  clientPhone: '',      // string
  clientEmail: '',      // string
  notes: '',            // string
}

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_SERVICE':    return { ...state, serviceId: action.payload }
    case 'SET_STAFF':      return { ...state, staffId: action.payload }
    case 'SET_DATE_TIME':  return { ...state, date: action.payload.date, timeSlot: action.payload.timeSlot }
    case 'SET_CONTACT':    return { ...state, ...action.payload }
    case 'RESET':          return initialState
    default:               return state
  }
}
```

### 5.3 Loading / Error / Empty States

| Feature | Loading | Error | Empty |
|---------|---------|-------|-------|
| Services (static data) | Skeleton grid | N/A (bundled) | "No hay servicios en esta categoría" |
| Staff (static data) | Skeleton grid | N/A (bundled) | "Próximamente" (on profile with no services) |
| Gallery (static data) | Skeleton grid | Broken image → placeholder with alt | "Galería próximamente" |
| Availability check | 6× pill skeleton | "Error al cargar horarios" + Reintentar | "No hay horarios disponibles" + pick another day |
| Booking submission | Full-screen spinner "Agendando tu cita…" | Error card + Reintentar or "pudo haber sido agendada" | N/A |
| Admin dashboard | Table skeleton (5 rows) | "Error al cargar citas" + Reintentar | "No hay citas próximas" with illustration |
| Contact form | N/A (no server call) | Field-level validation errors | N/A |

---

## 6. API Contracts

Single endpoint: `POST /api/sync-calendar`

**Common error response** (all endpoints):

```json
{ "error": "error_code", "message": "Human-readable description" }
```

### 6.1 check-availability

```
POST /api/sync-calendar
Content-Type: application/json

Request:
{
  "action": "check-availability",
  "date": "2026-06-20",
  "staffId": "staff-1"          // optional, may be null
}

Response 200:
{
  "date": "2026-06-20",
  "businessHours": {
    "open": "09:00",
    "close": "18:00"
  },
  "available": ["09:00", "09:30", "10:00", "10:30"],
  "booked": [
    {
      "start": "10:00",
      "end": "11:00",
      "summary": "Cita: Masaje Relax - María García"
    }
  ]
}

Response 400:
{ "error": "invalid_date", "message": "Formato de fecha inválido. Usa YYYY-MM-DD." }

Response 500:
{ "error": "calendar_api_error", "message": "No se pudo conectar con Google Calendar." }
```

**Business logic**: Vercel Function fetches all events for the given date, then subtracts booked time ranges from the configured business hours. Available slots are 30-min increments (configurable per service duration in phase 2). If `staffId` is provided, only events matching that staff are subtracted.

### 6.2 create-event

```
POST /api/sync-calendar
Content-Type: application/json

Request:
{
  "action": "create-event",
  "summary": "Cita: Masaje Relax - María García",
  "start": "2026-06-20T10:00:00",
  "end": "2026-06-20T10:30:00",
  "description": "Servicio: Masaje Relax\nCliente: María García\nTel: +52 55 1234 5678\nEmail: maria@email.com\nNotas: Llegaré 10 min antes"
}

Response 201:
{
  "success": true,
  "event": {
    "id": "abc123def456",
    "htmlLink": "https://www.google.com/calendar/event?eid=...",
    "start": "2026-06-20T10:00:00",
    "end": "2026-06-20T10:30:00"
  }
}

Response 409:
{ "error": "conflict", "message": "Ese horario ya no está disponible. Por favor selecciona otro." }

Response 400:
{ "error": "validation_error", "message": "Campos obligatorios faltantes: start, end, summary." }

Response 500:
{ "error": "calendar_api_error", "message": "No se pudo agendar la cita. Intenta de nuevo." }
```

**Conflict detection**: The Function attempts to create the event. If Google Calendar returns a 409 or the pre-check detects an overlapping event, return conflict.

### 6.3 list-events

```
POST /api/sync-calendar
Content-Type: application/json

Request:
{
  "action": "list-events",
  "timeMin": "2026-06-17T00:00:00Z",
  "timeMax": "2026-07-17T23:59:59Z"
}

Response 200:
{
  "events": [
    {
      "id": "abc123",
      "summary": "Cita: Masaje Relax - María García",
      "start": { "dateTime": "2026-06-20T10:00:00" },
      "end": { "dateTime": "2026-06-20T10:30:00" },
      "description": "Servicio: Masaje Relax\nCliente: María García\nTel: +52 55 1234 5678\nEmail: maria@email.com"
    }
  ]
}

Response 500:
{ "error": "calendar_api_error", "message": "No se pudieron cargar las citas." }
```

### 6.4 delete-event

```
POST /api/sync-calendar
Content-Type: application/json

Request:
{
  "action": "delete-event",
  "eventId": "abc123def456"
}

Response 200:
{ "success": true }

Response 404:
{ "error": "not_found", "message": "La cita ya fue cancelada o no existe." }

Response 500:
{ "error": "calendar_api_error", "message": "No se pudo cancelar la cita." }
```

---

## 7. Component Specifications

### 7.1 Layout Components

#### `<Layout />`

```
┌─────────────────────────────┐
│          <Header />          │
├─────────────────────────────┤
│                             │
│        <Outlet />           │
│     (page content)          │
│                             │
├─────────────────────────────┤
│          <Footer />          │
└─────────────────────────────┘
```

- **Props**: none (uses `<Outlet />` from React Router)
- **States**: none
- **Interactions**: Renders header + footer shell around routed page content

#### `<Header />`

- **Props**: none (reads active route via `useLocation()`)
- **States**:
  - Desktop: horizontal nav with links + "Agendar Cita" CTA button
  - Mobile (≤768px): hamburger icon, no nav links visible
- **Interactions**: Clicking nav links navigates via `<Link>`. Active route gets `aria-current="page"`. CTA button links to `/agendar`.

#### `<MobileDrawer />`

- **Props**: `{ isOpen: boolean, onClose: () => void }`
- **States**: open (slide in from left), closed (off-screen)
- **Interactions**: Tap backdrop or nav link → close. ESC key closes drawer. Focus trap when open.

#### `<Footer />`

- **Props**: none (reads from `src/data/clinic.js`)
- **States**: static
- **Content**: Clinic name, address, phone, email, social links, copyright year

### 7.2 Shared Components

#### `<ServiceCard />`

```js
/**
 * @param {Object} service
 * @param {string} service.id
 * @param {string} service.name
 * @param {string} service.category
 * @param {string} service.description - Short description
 * @param {number} service.durationMin - Duration in minutes
 * @param {number} service.price - Price in MXN
 * @param {string} service.image - Image URL
 * @param {function} onSelect - Called when card is clicked
 */
```

- **States**: default, hover (scale + shadow), selected (border highlight)
- **Empty**: N/A (parent filters data)
- **Error**: Broken image → fallback icon with service name
- **Interactions**: Click → calls `onSelect(service.id)`

#### `<StaffCard />`

```js
/**
 * @param {Object} staff
 * @param {string} staff.id
 * @param {string} staff.name
 * @param {string} staff.title
 * @param {string} staff.photo
 * @param {function} onClick - Navigate to profile
 */
```

- **States**: default, hover
- **Interactions**: Click → navigates to `/profesionales/:id`

#### `<GalleryImage />`

```js
/**
 * @param {Object} item
 * @param {string} item.id
 * @param {string} item.src
 * @param {string} item.alt
 * @param {string} [item.caption]
 */
```

- **States**: loading (skeleton), loaded, error (placeholder gradient + alt text)
- **Interactions**: Click → opens `<Lightbox />` at this image index

#### `<Lightbox />`

```js
/**
 * @param {Array} images - GalleryItem[]
 * @param {number} initialIndex
 * @param {function} onClose
 */
```

- **States**: open (with image loaded), loading next/prev image
- **Interactions**:
  - Close: X button or ESC key
  - Next: right arrow, swipe left (mobile), or right arrow key
  - Prev: left arrow, swipe right (mobile), or left arrow key
  - Loop: after last → first; before first → last
- **Accessibility**: Focus trap inside lightbox, restores focus on close

#### `<TimeSlotGrid />`

```js
/**
 * @param {string[]} available - ["09:00", "09:30", ...]
 * @param {Array} booked - [{ start, end, summary }]
 * @param {string|null} selected - Currently selected time
 * @param {function} onSelect - Called with "HH:mm"
 * @param {boolean} isLoading
 * @param {string|null} error
 * @param {function} onRetry
 */
```

- **States**:
  - **Loading**: 6× pill skeletons in a grid
  - **Error**: `<ErrorMessage />` with retry button
  - **Empty (all booked)**: "No hay horarios disponibles para esta fecha. Intenta con otro día."
  - **Success**: Grid of slot buttons
- **Interactions**: Click available slot → highlight + call `onSelect`. Booked slots are disabled with "Ocupado" tooltip.

### 7.3 Booking Components

#### `<BookingWizard />`

Orchestrates the 5-step flow. Does NOT hold state directly — reads from `BookingContext`.

```js
/**
 * Uses: BookingContext (useReducer)
 * Internal state: currentStep (1-5)
 */
```

- **Step validation** (enables/disables "Siguiente"):
  - Step 1: `serviceId !== null`
  - Step 2: `staffId !== null`
  - Step 3: `date !== null && timeSlot !== null`
  - Step 4: `clientName !== '' && clientPhone !== '' && clientEmail !== ''`
  - Step 5: always valid (submit triggers API call)

#### `<StepProgress />`

```js
/**
 * @param {number} currentStep - 1-5
 * @param {number} totalSteps - 5
 */
```

Renders step dots/bar. Each step shows: number, label, completed/active/pending state.

#### `<StepService />` (Step 1)

- Reads `services` from `src/data/services.js`
- Renders category tabs + service cards grid
- On select → dispatches `SET_SERVICE` to context
- Shows selected state on chosen service

#### `<StepStaff />` (Step 2)

- Reads `staff` from `src/data/staff.js`
- Optionally pre-filters by staff who offer the selected service
- Renders staff cards grid
- On select → dispatches `SET_STAFF`
- Shows selected state

#### `<StepDateTime />` (Step 3)

- **Local state**: selectedDate (date picker or day navigation)
- Uses `useAvailability(date, staffId)` hook to fetch available slots
- Renders date picker (prev/next day or calendar widget) + `<TimeSlotGrid />`
- On date change → refetch availability
- On slot select → dispatches `SET_DATE_TIME`
- Loading/error/empty states handled by `<TimeSlotGrid />`

#### `<StepContact />` (Step 4)

- **Local state**: form fields (mirrored to context on "Siguiente")
- **Validation**:
  - `clientName`: required
  - `clientPhone`: required, basic phone format
  - `clientEmail`: required, email format
  - `notes`: optional
- Shows field-level validation errors inline
- On "Siguiente" → dispatches `SET_CONTACT`, validates all fields first

#### `<StepConfirm />` (Step 5)

- Reads full booking state from context
- Renders summary card:
  - Servicio: {name}
  - Profesional: {name}
  - Fecha: {date}
  - Hora: {timeSlot}
  - Cliente: {name}, {phone}, {email}
  - Notas: {notes}
- **Submit states**:
  - **Idle**: "Confirmar cita" button enabled
  - **Submitting**: Full-screen overlay "Agendando tu cita…" + spinner
  - **Success**: Green confirmation card with ✓, appointment details, "Agregar a Calendar" link, "Volver al inicio" button
  - **Error (conflict)**: "Ese horario ya no está disponible" + "Elegir otro horario" button
  - **Error (network)**: "Error de conexión" + "Reintentar" button
  - **Error (timeout)**: "Tu cita pudo haber sido agendada. Verifica o contacta al centro."
- On submit → calls `createEvent` via `useCalendarApi`
- On success → dispatches `RESET` to clear wizard

### 7.4 Admin Components

#### `<LoginForm />`

```js
/**
 * @param {function} onLogin - Called with { username, password }
 * @param {string|null} error - Error message to display
 */
```

- **Local state**: username, password, error
- **Validation**: both fields required
- **States**: idle, submitting (button disabled + spinner)
- **Error**: "Credenciales inválidas" below form
- **Interactions**: Submit → call `onLogin`. If valid → set `localStorage` + redirect to dashboard.

#### `<DashboardTable />`

```js
/**
 * @param {Array} events - List of event objects from API
 * @param {boolean} isLoading
 * @param {string|null} error
 * @param {function} onDelete - Called with eventId
 * @param {function} onRetry
 */
```

- **States**:
  - **Loading**: table with 5 skeleton rows
  - **Error**: `<ErrorMessage />` with retry
  - **Empty**: "No hay citas próximas" illustration
  - **Success**: Table with columns: Fecha, Hora, Servicio, Cliente, Teléfono, Email, Acciones
- **Interactions**: Delete button → confirmation dialog → `onDelete(eventId)` → remove row

#### `<AdminHeader />`

- Shows admin title + "Cerrar sesión" button
- On logout → clear localStorage + redirect to login

### 7.5 Shared Utility Components

#### `<LoadingSkeleton />`

```js
/**
 * @param {'card'|'row'|'pill'|'text'} variant
 * @param {number} [count=1] - Number of skeleton items
 * @param {string} [className] - Additional classes
 */
```

Used across all data-fetching views.

#### `<ErrorMessage />`

```js
/**
 * @param {string} message
 * @param {function} [onRetry] - If provided, shows retry button
 * @param {string} [retryLabel] - Default: "Reintentar"
 */
```

#### `<EmptyState />`

```js
/**
 * @param {string} title
 * @param {string} message
 * @param {string} [actionLabel]
 * @param {string} [actionTo] - Route to navigate to
 * @param {'simple'|'illustration'} [variant='simple']
 */
```

---

## 8. Seed Data Schemas

### 8.1 `src/data/services.js`

```js
/**
 * @typedef {Object} Service
 * @property {string} id        - Unique identifier, e.g. "massage-relax"
 * @property {string} name      - Display name
 * @property {string} category  - Category slug: "facial" | "massage" | "nails" | "body" | "hair"
 * @property {string} description - 1-2 sentence description
 * @property {number} durationMin - Duration in minutes
 * @property {number} price      - Price in MXN
 * @property {string} image      - Path to image in public/
 */

export const services = [
  {
    id: "masaje-relax",
    name: "Masaje Relax",
    category: "massage",
    description: "Masaje de descarga muscular con aromaterapia. Ideal para liberar tensión acumulada.",
    durationMin: 60,
    price: 850,
    image: "/images/servicios/masaje-relax.jpg",
  },
  // ... more services
]
```

### 8.2 `src/data/staff.js`

```js
/**
 * @typedef {Object} Staff
 * @property {string} id          - Unique identifier
 * @property {string} name        - Full name
 * @property {string} title       - Professional title
 * @property {string} bio         - Short biography (2-3 sentences)
 * @property {string} photo       - Path to photo in public/
 * @property {string[]} serviceIds - IDs of services this staff offers
 */

export const staff = [
  {
    id: "ana-martinez",
    name: "Ana Martínez",
    title: "Terapeuta Corporal Senior",
    bio: "Con 8 años de experiencia en masoterapia...",
    photo: "/images/staff/ana-martinez.jpg",
    serviceIds: ["masaje-relax", "masaje-deportivo", "masaje-piedras"],
  },
  // ... more staff
]
```

### 8.3 `src/data/gallery.js`

```js
/**
 * @typedef {Object} GalleryItem
 * @property {string} id        - Unique identifier
 * @property {string} src       - Image path in public/
 * @property {string} alt       - Alt text for accessibility
 * @property {string} category  - "instalaciones" | "tratamientos" | "resultados"
 * @property {string} [caption] - Optional caption
 */

export const gallery = [
  {
    id: "sala-relax-1",
    src: "/images/galeria/sala-relax.jpg",
    alt: "Sala de relax con iluminación tenue",
    category: "instalaciones",
    caption: "Nuestra sala de relax principal",
  },
  // ... more images
]
```

### 8.4 `src/data/clinic.js`

```js
/**
 * @typedef {Object} ClinicInfo
 * @property {string} name
 * @property {string} address
 * @property {string} phone
 * @property {string} email
 * @property {{ day: string, open: string, close: string }[]} hours
 * @property {string} mapSrc - Google Maps embed URL
 * @property {{ platform: string, url: string }[]} social
 */

export const clinicInfo = {
  name: "Spa Esencia & Bienestar",
  address: "Av. Reforma 256, Col. Juárez, CDMX",
  phone: "+52 55 1234 5678",
  email: "contacto@esenciabienestar.mx",
  hours: [
    { day: "Lunes a Viernes", open: "09:00", close: "19:00" },
    { day: "Sábado", open: "10:00", close: "17:00" },
    { day: "Domingo", open: "", close: "" },  // closed
  ],
  mapSrc: "https://www.google.com/maps/embed?pb=...",
  social: [
    { platform: "Instagram", url: "https://instagram.com/esenciabienestar" },
    { platform: "Facebook", url: "https://facebook.com/esenciabienestar" },
  ],
}
```

---

## 9. Vercel Configuration

### 9.1 `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/sync-calendar.js": {
      "maxDuration": 10,
      "memory": 128
    }
  }
}
```

**Why the catch-all rewrite**: Though we use hash routing (which doesn't need it), this protects against:
- Direct URL access if we ever switch to browser router
- Bots/crawlers that might request clean URLs
- Bookmarked deep links working correctly

### 9.2 Environment Variables (Vercel Dashboard)

| Variable | Description |
|----------|-------------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service Account client email |
| `GOOGLE_PRIVATE_KEY` | Service Account private key (base64 encoded, with literal `\n`) |
| `GOOGLE_CALENDAR_ID` | Target Google Calendar ID to manage |

These are set in the Vercel project dashboard → Settings → Environment Variables. Never committed to the repo.

### 9.3 `api/sync-calendar.js` — Architecture

```
Request → Parse action → Validate params → Authenticate (JWT) → Call Calendar API → Parse response → Return JSON
```

The Function:
1. Parses the JSON body and validates `action`
2. Authenticates with Google using Service Account credentials (from env vars)
3. Dispatches to the appropriate Calendar API call based on `action`
4. Returns standardized JSON response

```js
// api/sync-calendar.js — structural outline
import { google } from 'googleapis'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed', message: 'Use POST' })
  }

  const { action } = req.body || {}

  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })
    const calendar = google.calendar({ version: 'v3', auth })

    switch (action) {
      case 'check-availability':
        return handleCheckAvailability(req, res, calendar)
      case 'create-event':
        return handleCreateEvent(req, res, calendar)
      case 'list-events':
        return handleListEvents(req, res, calendar)
      case 'delete-event':
        return handleDeleteEvent(req, res, calendar)
      default:
        return res.status(400).json({ error: 'unknown_action', message: `Acción desconocida: ${action}` })
    }
  } catch (err) {
    console.error('Calendar API error:', err)
    return res.status(500).json({ error: 'calendar_api_error', message: 'Error interno del servidor' })
  }
}
```

### 9.4 Business Hours Config

Hardcoded in the Vercel Function (can be made configurable in phase 2):

```js
const BUSINESS_HOURS = {
  monday:    { open: '09:00', close: '19:00' },
  tuesday:   { open: '09:00', close: '19:00' },
  wednesday: { open: '09:00', close: '19:00' },
  thursday:  { open: '09:00', close: '19:00' },
  friday:    { open: '09:00', close: '19:00' },
  saturday:  { open: '10:00', close: '17:00' },
  sunday:    { open: null, close: null }, // Closed
}
```

---

## 10. Vite Configuration

### 10.1 `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // No special config needed — hash router handles SPA routing
  // All static assets served from /public/
})
```

### 10.2 Dependencies to Add

```bash
pnpm add react-router-dom
```

That's the only new runtime dependency. `react-router-dom` v7 includes `createHashRouter` — no SWR, no Axios, no state management library. Keeping it minimal.

---

## 11. Implementation Order

The build sequence is organized by dependencies — each phase unblocks the next.

| Phase | Modules | Depends On | Estimated Files |
|-------|---------|------------|-----------------|
| **1. Scaffold + Layout** | `Layout.jsx`, `Header.jsx`, `Footer.jsx`, `MobileDrawer.jsx`, `App.jsx`, `main.jsx`, `index.css`, `vercel.json` | Nothing | 9 |
| **2. Seed Data** | `services.js`, `staff.js`, `gallery.js`, `clinic.js` | Nothing (parallel with 1) | 4 |
| **3. Static Pages** | `Home.jsx`, `Services.jsx`, `Professionals.jsx`, `ProfessionalProfile.jsx`, `Gallery.jsx`, `Contact.jsx`, `ServiceCard.jsx`, `StaffCard.jsx`, `GalleryImage.jsx`, `Lightbox.jsx`, shared components | Phase 1, 2 | 12 |
| **4. Vercel Function** | `api/sync-calendar.js`, `lib/api.js`, `hooks/useCalendarApi.js` | Nothing (independent) | 3 |
| **5. Booking Wizard** | `BookingContext.jsx`, `BookingWizard.jsx`, `StepProgress.jsx`, `StepService.jsx`, `StepStaff.jsx`, `StepDateTime.jsx`, `StepContact.jsx`, `StepConfirm.jsx`, `useAvailability.js`, `TimeSlotGrid.jsx` | Phase 2, 3, 4 | 11 |
| **6. Admin Dashboard** | `Admin.jsx`, `LoginForm.jsx`, `DashboardTable.jsx`, `AdminHeader.jsx`, `useAdminAuth.js` | Phase 4 | 5 |
| **7. Polish** | Responsive fixes, animations, error boundaries, SEO meta, favicon | All phases | — |

**Total: ~44 files** (including components, pages, hooks, data modules).

### Phase 1 Detail — Why first

The layout shell and routing are the foundation. Every other page renders inside `<Layout />`. Getting this right first means every subsequent page has nav, footer, and responsive behavior without rework.

### Phase 4 Detail — Vercel Function first

The Vercel Function can be developed and tested independently of the SPA using curl or Postman. This means:
- No SPA dependency for testing calendar integration
- Can be deployed early and iterated
- SPA development uses the live Function endpoint once deployed

---

## 12. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Router | `createHashRouter` | Zero server config. Vercel serves `index.html` for all requests naturally. |
| State management for wizard | Context + `useReducer` | Steps share complex state. Reducer makes transitions explicit and testable. |
| No SWR/React Query | Manual `useState` + `useEffect` | Only 2 data-fetching features (availability, admin events). Adding a library adds more weight than value. |
| Session caching for availability | In-memory Map in `useAvailability` | Reduces API calls during same session. Cleared on page refresh — acceptable for demo. |
| Admin auth | localStorage boolean | Hardcoded demo credentials. No password hashing needed — this is a demo with documented credentials. |
| No barrel imports | Direct component imports | Follows `bundle-barrel-imports` best practice. Every import is a specific path, never an `index.js` barrel. |
| Static seed data as JS modules | `export const` in `.js` files | Zero network cost, bundled with the app. No build step needed — plain JS modules. |
| Service Account (no OAuth) | Google JWT auth | No user-facing consent screen. Booking UX stays clean. Calendar access is server-side only. |
| Single API endpoint | `POST /api/sync-calendar` | Action-based dispatching avoids multiple endpoints. Simpler to maintain, deploy, and secure. |
