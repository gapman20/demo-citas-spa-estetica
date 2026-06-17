# demo-spa-citas — Implementation Tasks

**Change**: demo-spa-citas
**Stack**: Vite 8 + React 19 (JSX) + pnpm
**Router**: HashRouter (React Router v7)
**Backend**: Single Vercel Function (`api/sync-calendar.js`) → Google Calendar API (Service Account)
**Database**: None — Google Calendar IS the storage
**Seed data**: Static JS modules in `src/data/`

**Current state**: Fresh Vite template scaffold (1 commit, 383 lines boilerplate). No `react-router-dom` installed.

---

## Phase 1: Foundation

### T-001: Install dependency and scaffold directory structure

- **Name**: Install `react-router-dom` and create component directories
- **Dependencies**: None (can run immediately)
- **Files to create/modify**:
  - `package.json` — add `react-router-dom` dependency
  - `src/components/layout/` — create directory
  - `src/components/shared/` — create directory
  - `src/components/booking/` — create directory
  - `src/components/admin/` — create directory
  - `src/pages/` — create directory
  - `src/data/` — create directory
  - `src/hooks/` — create directory
  - `src/lib/` — create directory
  - `api/` — create directory
- **Acceptance criteria**:
  - `pnpm ls react-router-dom` shows the package
  - All directories exist under `src/` and `api/`
  - `pnpm dev` still starts without errors
- **Estimated effort**: Small
- **Risk**: Low

---

### T-002: Create spa theme CSS (replace boilerplate styles)

- **Name**: Replace `index.css` with spa-branded CSS variables and global reset
- **Dependencies**: None (parallel with T-001, T-003)
- **Files to create/modify**:
  - `src/index.css` — replace entire file with spa theme (colors: sage green, warm neutrals; fonts: system sans; CSS variables for brand palette)
- **Acceptance criteria**:
  - CSS variables defined: `--spa-green`, `--spa-gold`, `--spa-cream`, `--spa-charcoal`
  - Global reset applied (box-sizing, margin removal)
  - Layout: `#root` is a full-height flex column (header, main flex-grow, footer)
  - Responsive breakpoint at 768px
- **Estimated effort**: Small
- **Risk**: Low

---

### T-003: Build layout shell (Header, Footer, Layout, MobileDrawer)

- **Name**: Create layout components with responsive header navigation
- **Dependencies**: T-002 (CSS variables)
- **Files to create/modify**:
  - `src/components/layout/Header.jsx` — logo, nav links (Inicio, Servicios, Profesionales, Galería, Contacto), "Agendar Cita" CTA button, hamburger toggle for ≤768px
  - `src/components/layout/Footer.jsx` — clinic info, social links, copyright
  - `src/components/layout/MobileDrawer.jsx` — slide-out drawer with nav links, backdrop, ESC close, focus trap
  - `src/components/layout/Layout.jsx` — `<Header /> + <main><Outlet /></main> + <Footer />`
- **Acceptance criteria**:
  - Desktop nav shows all links horizontally with active route highlighted (`aria-current="page"`)
  - Mobile (≤768px): hamburger icon visible, nav links hidden
  - Mobile drawer opens/closes smoothly, closes on link click or backdrop tap
  - Layout renders `<Outlet />` between header and footer
  - CSS is self-contained per component or uses shared classes
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-004: Set up HashRouter with all route definitions

- **Name**: Configure `createHashRouter` in App.jsx and wire main.jsx
- **Dependencies**: T-003 (Layout exists)
- **Files to create/modify**:
  - `src/App.jsx` — replace entire file with `createHashRouter` definition, routes list (all 8 routes), `RouterProvider`
  - `src/main.jsx` — clean up (remove boilerplate, keep StrictMode + RouterProvider rendering)
- **Acceptance criteria**:
  - Routes defined: `/`, `/servicios`, `/profesionales`, `/profesionales/:id`, `/galeria`, `/agendar`, `/contacto`, `/admin`
  - All routes nested under `<Layout />`
  - Navigating to `/servicios` shows Layout shell with empty `<Outlet />` (page components not yet built)
  - Hash-based URLs work: `/#/servicios`
  - No 404 on direct navigation to any route
- **Estimated effort**: Small
- **Risk**: Low

---

### T-005: Configure Vite and Vercel deployment

- **Name**: Add Vercel deployment config, update index.html title
- **Dependencies**: None (parallel with T-001)
- **Files to create/modify**:
  - `vercel.json` — build command, output directory, rewrites, function config for `api/sync-calendar.js`
  - `index.html` — update `<title>` to "Spa Esencia & Bienestar", `<html lang="es">`, add meta description
- **Acceptance criteria**:
  - `vercel.json` exists with correct build config and catch-all rewrite
  - `index.html` has Spanish lang, correct title, meta description
- **Estimated effort**: Small
- **Risk**: Low

---

## Phase 2: Seed Data

### T-006: Create services seed data

- **Name**: Build `src/data/services.js` with spa service catalog
- **Dependencies**: None (parallel with Phase 1)
- **Files to create/modify**:
  - `src/data/services.js` — export `services` array with 8-12 services across 5 categories (facial, massage, nails, body, hair), each with: `id`, `name`, `category`, `description`, `durationMin`, `price`, `image`
- **Acceptance criteria**:
  - At least 2 services per category
  - Each service has all required fields
  - Import works without errors: `import { services } from '../data/services.js'`
- **Estimated effort**: Small
- **Risk**: Low

---

### T-007: Create staff seed data

- **Name**: Build `src/data/staff.js` with professional profiles
- **Dependencies**: T-006 (service IDs referenced in `serviceIds`)
- **Files to create/modify**:
  - `src/data/staff.js` — export `staff` array with 3-4 professionals, each with: `id`, `name`, `title`, `bio`, `photo`, `serviceIds[]`
- **Acceptance criteria**:
  - Each staff member references valid service IDs from `services.js`
  - At least one staff member has no services (edge case: "Próximamente")
  - Import works without errors
- **Estimated effort**: Small
- **Risk**: Low

---

### T-008: Create gallery and clinic seed data

- **Name**: Build `src/data/gallery.js` and `src/data/clinic.js`
- **Dependencies**: None (parallel)
- **Files to create/modify**:
  - `src/data/gallery.js` — export `gallery` array with 8-12 gallery items across 3 categories (instalaciones, tratamientos, resultados), each with: `id`, `src`, `alt`, `category`, `caption?`
  - `src/data/clinic.js` — export `clinicInfo` with: `name`, `address`, `phone`, `email`, `hours[]`, `mapSrc` (Google Maps embed), `social[]`
- **Acceptance criteria**:
  - Gallery has items in all 3 categories
  - Clinic info has realistic data, with Sunday marked as closed
  - Both imports work without errors
- **Estimated effort**: Small
- **Risk**: Low

---

## Phase 3: Public Pages (Services, Home, Contact)

### T-009: Build shared utility components

- **Name**: Create LoadingSkeleton, ErrorMessage, EmptyState, Toast components
- **Dependencies**: T-002 (CSS variables)
- **Files to create/modify**:
  - `src/components/shared/LoadingSkeleton.jsx` — configurable skeleton (`variant: 'card'|'row'|'pill'|'text'`, `count`)
  - `src/components/shared/ErrorMessage.jsx` — error card with message and optional retry button
  - `src/components/shared/EmptyState.jsx` — centered message with optional illustration and action CTA
  - `src/components/shared/Toast.jsx` — notification toast (auto-dismiss, success/error variants)
- **Acceptance criteria**:
  - LoadingSkeleton renders `count` animated skeletons of the specified variant
  - ErrorMessage shows retry button when `onRetry` is provided
  - EmptyState navigates to route when `actionTo` is provided
  - Toast slides in, auto-dismisses after 3s, can be manually closed
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-010: Build ServiceCard component

- **Name**: Create ServiceCard with image, name, category, duration, price
- **Dependencies**: T-002 (CSS variables)
- **Files to create/modify**:
  - `src/components/shared/ServiceCard.jsx` — card with image (fallback on broken), name, category badge, duration, price, MXN formatting
- **Acceptance criteria**:
  - Displays all service fields correctly
  - Broken image shows fallback (icon + service name)
  - Hover: scale + shadow effect
  - Selected state: border highlight
  - Click calls `onSelect(service.id)`
- **Estimated effort**: Small
- **Risk**: Low

---

### T-011: Build Home page

- **Name**: Create Home page with hero, featured services, CTA
- **Dependencies**: T-004 (router), T-009 (shared components), T-006 (services data)
- **Files to create/modify**:
  - `src/pages/Home.jsx` — hero section with headline + CTA button ("Agenda tu cita"), featured services preview (3-4 highlighted services), clinic highlights section (icons + text)
- **Acceptance criteria**:
  - Hero section renders with title, subtitle, and CTA button linking to `/agendar`
  - Featured services show a subset of services (filtered by `featured` flag or first 4)
  - "Agenda tu cita" button navigates to `/agendar`
  - Responsive: stacks on mobile
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-012: Build Services page with category filtering

- **Name**: Create Services page with category tabs and service card grid
- **Dependencies**: T-004 (router), T-009 (EmptyState), T-010 (ServiceCard), T-006 (services data)
- **Files to create/modify**:
  - `src/pages/Services.jsx` — category tabs/pills, service card grid, client-side filtering
- **Acceptance criteria**:
  - Category tabs render: "Todas", "Faciales", "Masajes", "Uñas", "Corporales", "Capilares"
  - Clicking a tab filters services to that category
  - "Todas" shows all services grouped by category
  - Empty category shows `EmptyState` with "No hay servicios en esta categoría"
  - Invalid category in URL falls back to showing all
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-013: Build Contact page with form validation

- **Name**: Create Contact page with clinic info, map, and validated form
- **Dependencies**: T-004 (router), T-009 (Toast), T-008 (clinic.js)
- **Files to create/modify**:
  - `src/pages/Contact.jsx` — two-column layout: left has clinic info (address, phone, email, hours) + Google Maps iframe, right has contact form (name, email, message) with client-side validation
- **Acceptance criteria**:
  - Clinic info renders all fields from `clinic.js`
  - Google Maps iframe renders with `mapSrc`
  - Form validates: required fields show "Este campo es obligatorio", invalid email shows "Ingresa un correo electrónico válido"
  - On valid submit: success toast "Mensaje enviado (demo)" + form reset
- **Estimated effort**: Medium
- **Risk**: Low

---

## Phase 4: Public Pages (Staff, Gallery)

### T-014: Build StaffCard component

- **Name**: Create StaffCard with photo, name, title
- **Dependencies**: T-002 (CSS variables)
- **Files to create/modify**:
  - `src/components/shared/StaffCard.jsx` — card with photo, name, title, hover effect
- **Acceptance criteria**:
  - Displays photo, name, title
  - Click navigates to `/profesionales/:id`
  - Broken photo shows initial-based fallback
- **Estimated effort**: Small
- **Risk**: Low

---

### T-015: Build Professionals grid and profile pages

- **Name**: Create Professionals (grid) and ProfessionalProfile pages
- **Dependencies**: T-004 (router), T-014 (StaffCard), T-007 (staff.js), T-006 (services.js)
- **Files to create/modify**:
  - `src/pages/Professionals.jsx` — grid of `<StaffCard />` components
  - `src/pages/ProfessionalProfile.jsx` — full profile: photo, name, title, bio, service chips, "Agendar con {nombre}" CTA pre-selecting staff
- **Acceptance criteria**:
  - `/profesionales` shows responsive grid (1 col mobile, 2-3 cols desktop)
  - `/profesionales/:id` loads matching staff, shows 404-style message for unknown ID
  - Service chips show service names (looked up from `services.js`)
  - Staff with no services shows "Próximamente" chip
  - "Agendar con {nombre}" CTA links to `/agendar` with staff pre-selected (via search params or context)
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-016: Build GalleryImage component

- **Name**: Create gallery thumbnail with loading and error states
- **Dependencies**: T-002 (CSS variables)
- **Files to create/modify**:
  - `src/components/shared/GalleryImage.jsx` — thumbnail with skeleton loading state, error fallback (placeholder gradient + alt text)
- **Acceptance criteria**:
  - Shows skeleton while image loads
  - Shows placeholder on broken image (not broken icon)
  - Click calls `onClick` with image index
- **Estimated effort**: Small
- **Risk**: Low

---

### T-017: Build Lightbox component

- **Name**: Create full-screen lightbox with navigation and keyboard support
- **Dependencies**: T-002 (CSS variables)
- **Files to create/modify**:
  - `src/components/shared/Lightbox.jsx` — dark overlay, centered image, prev/next arrows, close button, caption, loop navigation, ESC to close, arrow keys, swipe detection
- **Acceptance criteria**:
  - Opens with image at `initialIndex`
  - Close: X button, ESC key, backdrop click
  - Next/Prev: arrow buttons, arrow keys, swipe (mobile)
  - Loops: after last → first, before first → last
  - Loading state while image loads
  - Focus trap when open, focus restored on close
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-018: Build Gallery page

- **Name**: Create Gallery page with thumbnail grid and lightbox
- **Dependencies**: T-004 (router), T-016 (GalleryImage), T-017 (Lightbox), T-008 (gallery.js)
- **Files to create/modify**:
  - `src/pages/Gallery.jsx` — responsive image grid, category filter tabs, lightbox integration
- **Acceptance criteria**:
  - Responsive grid (2 cols mobile, 3-4 cols desktop)
  - Category filter tabs (Todas, Instalaciones, Tratamientos, Resultados)
  - Click thumbnail → opens Lightbox at that image
  - Lightbox navigation works across filtered subset
- **Estimated effort**: Medium
- **Risk**: Low

---

## Phase 5: Booking Wizard

### T-019: Build BookingContext with reducer

- **Name**: Create BookingContext with useReducer for wizard state
- **Dependencies**: None (can be built independently)
- **Files to create/modify**:
  - `src/components/booking/BookingContext.jsx` — React Context + provider + `bookingReducer` with actions: `SET_SERVICE`, `SET_STAFF`, `SET_DATE_TIME`, `SET_CONTACT`, `RESET`
- **Acceptance criteria**:
  - Initial state: all fields `null` or `''`
  - Each action updates only its relevant slice of state
  - `RESET` returns to initial state
  - Provider wraps children and exposes state + dispatch
- **Estimated effort**: Small
- **Risk**: Low

---

### T-020: Build BookingWizard orchestrator and StepProgress

- **Name**: Create wizard orchestrator and step progress indicator
- **Dependencies**: T-019 (BookingContext)
- **Files to create/modify**:
  - `src/components/booking/BookingWizard.jsx` — orchestrator: holds `currentStep` (1-5), renders `<StepProgress />` + current step component, enables/disables "Siguiente"/"Atrás" based on step validation
  - `src/components/booking/StepProgress.jsx` — step indicator bar/dots with labels, shows completed/active/pending state
- **Acceptance criteria**:
  - Step validation: step 1 requires `serviceId`, step 2 requires `staffId`, step 3 requires `date + timeSlot`, step 4 requires all contact fields, step 5 always valid
  - "Atrás" returns to previous step preserving all data
  - "Siguiente" disabled until current step validates
  - Step 5: "Atrás" goes to step 4, "Confirmar cita" triggers submit
  - StepProgress visually indicates which step is active
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-021: Build StepService and StepStaff

- **Name**: Create wizard steps for service and staff selection
- **Dependencies**: T-019 (BookingContext), T-020 (BookingWizard), T-010 (ServiceCard), T-014 (StaffCard)
- **Files to create/modify**:
  - `src/components/booking/StepService.jsx` — category tabs + service cards grid, dispatches `SET_SERVICE` on select, shows selected state
  - `src/components/booking/StepStaff.jsx` — staff cards grid, optionally filtered by who offers selected service, dispatches `SET_STAFF` on select
- **Acceptance criteria**:
  - StepService shows services from `services.js`, selecting one dispatches to context
  - StepStaff shows staff from `staff.js`, selecting one dispatches to context
  - StepStaff can optionally filter by selected service's staff
  - Selected item visually highlighted
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-022: Build StepDateTime with TimeSlotGrid

- **Name**: Create date/time step with availability display
- **Dependencies**: T-019 (BookingContext), T-020 (BookingWizard), T-025 (useAvailability hook — same phase)
- **Files to create/modify**:
  - `src/components/booking/StepDateTime.jsx` — date picker (prev/next day navigation), uses `useAvailability(date, staffId)` hook, renders `<TimeSlotGrid />`
  - `src/components/shared/TimeSlotGrid.jsx` — grid of available (clickable) / booked (disabled "Ocupado") time pills, loading skeleton (6 pills), empty state ("No hay horarios disponibles"), error + retry
- **Acceptance criteria**:
  - Date picker navigates prev/next day
  - Available slots are clickable; booked slots disabled with "Ocupado"
  - Full booked day: shows empty state with suggestion to pick another day
  - Loading: 6 skeleton pills
  - Error: retry button
  - On slot select: dispatches `SET_DATE_TIME`
- **Estimated effort**: Medium
- **Risk**: Medium (depends on useAvailability being wired — see T-025 dep on Phase 6)

> **Note**: T-023 depends on the Vercel Function (Phase 6) for real availability data. For early development, `useAvailability` can return mock data, then switch to real API when Phase 6 is done.

---

### T-023: Build StepContact with form validation

- **Name**: Create contact info step with field validation
- **Dependencies**: T-019 (BookingContext), T-020 (BookingWizard)
- **Files to create/modify**:
  - `src/components/booking/StepContact.jsx` — form with name, phone, email, notes fields, field-level validation, dispatches `SET_CONTACT` on "Siguiente"
- **Acceptance criteria**:
  - Validation: name required, phone required + basic format, email required + email format, notes optional
  - Validation errors shown inline below each field
  - "Siguiente" validates all fields first, dispatches to context only if valid
  - Pre-populates from context if user navigates back
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-024: Build StepConfirm with submit/success/error states

- **Name**: Create confirmation step with full booking summary and submit
- **Dependencies**: T-019 (BookingContext), T-020 (BookingWizard), T-010 (ServiceCard — lookup), T-028 (useCalendarApi — Phase 6)
- **Files to create/modify**:
  - `src/components/booking/StepConfirm.jsx` — summary card (service, staff, date, time, client info, notes), submit states: idle (Confirmar cita), submitting (full-screen overlay "Agendando tu cita…"), success (green card with ✓ + "Agregar a Calendar" link + "Volver al inicio"), error (conflict, network, timeout variants with appropriate messages + retry/alternate action)
- **Acceptance criteria**:
  - Summary card shows all booking details from context
  - All 5 states render correctly (idle, submitting, success, error-conflict, error-network)
  - Submit calls `createEvent` from `useCalendarApi`
  - On success: dispatches `RESET`, shows confirmation
  - Error conflict: "Ese horario ya no está disponible" + "Elegir otro horario" button (goes to step 3)
  - Error network: "Error de conexión" + "Reintentar"
  - Transition states are smooth (spinner overlay)
- **Estimated effort**: Medium
- **Risk**: Medium (depends on useCalendarApi hook)

---

### T-025: Build useAvailability hook

- **Name**: Create custom hook for fetching and caching available slots
- **Dependencies**: T-026 (api.js — Phase 6), or mock data for development
- **Files to create/modify**:
  - `src/hooks/useAvailability.js` — accepts `date` + `staffId`, calls Vercel Function (`check-availability` action), in-memory cache (Map keyed by date), returns `{ available, booked, isLoading, error, retry }`
- **Acceptance criteria**:
  - Caches results per date within session (Map)
  - Returns loading state while fetching
  - Returns error state with retry function on failure
  - With mock data: returns 30-min slots for demo
  - With real API: returns data from Vercel Function
- **Estimated effort**: Small
- **Risk**: Low (can use mock data first)

---

## Phase 6: Google Calendar Integration

### T-026: Build Vercel Function (api/sync-calendar.js)

- **Name**: Create Vercel serverless function with all 4 Calendar actions
- **Dependencies**: None (independent — can be tested with curl)
- **Files to create/modify**:
  - `api/sync-calendar.js` — POST handler, JWT auth via Service Account env vars, 4 action handlers: `check-availability` (fetch + compute available slots), `create-event` (insert with conflict detection), `list-events` (query by date range), `delete-event` (remove by eventId)
- **Acceptance criteria**:
  - Returns 405 for non-POST requests
  - Returns 400 for unknown action
  - `check-availability`: returns available/booked slots for a given date, respects business hours (hardcoded for now)
  - `create-event`: creates event in Calendar, returns 409 on conflict
  - `list-events`: returns events within time range
  - `delete-event`: removes event by ID, returns 404 if not found
  - All errors return standardized `{ error, message }` format
  - **Can be tested independently** with curl: `curl -X POST https://.../api/sync-calendar -d '{"action":"check-availability","date":"2026-06-20"}'`
- **Estimated effort**: Large
- **Risk**: High (depends on Google Calendar API setup, Service Account credentials, env vars in Vercel)

---

### T-027: Build API client library and useCalendarApi hook

- **Name**: Create fetch wrapper and hook for Calendar API calls
- **Dependencies**: T-026 (sync-calendar.js endpoint deployed or local mock)
- **Files to create/modify**:
  - `src/lib/api.js` — `postApi(endpoint, body)` fetch wrapper with error handling, timeout, JSON parsing
  - `src/hooks/useCalendarApi.js` — returns `{ createEvent, listEvents, deleteEvent, checkAvailability }` functions that call `api.js` with correct action payloads
- **Acceptance criteria**:
  - `api.js` handles network errors, non-JSON responses, timeouts
  - `useCalendarApi` exposes 4 named functions mapping to the 4 Calendar actions
  - Functions return structured responses (or throw with consistent error shape)
- **Estimated effort**: Small
- **Risk**: Low (thin wrapper)

---

### T-028: Wire booking wizard to Vercel Function

- **Name**: Connect StepConfirm to real Vercel Function API
- **Dependencies**: T-027 (useCalendarApi), T-024 (StepConfirm)
- **Files to modify**:
  - `src/components/booking/StepConfirm.jsx` — use `useCalendarApi().createEvent` instead of mock, handle all response states
  - `src/hooks/useAvailability.js` — switch from mock data to real `checkAvailability` call
- **Acceptance criteria**:
  - Submitting a booking calls `POST /api/sync-calendar` with `action: "create-event"`
  - Success: shows confirmation with real `htmlLink` from Calendar
  - Conflict: shows "Ese horario ya no está disponible"
  - Availability check calls real Vercel Function
  - Slot grid reflects real Calendar data
- **Estimated effort**: Small
- **Risk**: Medium (requires working Vercel Function deployment)

---

## Phase 7: Admin Dashboard

### T-029: Build useAdminAuth hook

- **Name**: Create auth hook with localStorage persistence
- **Dependencies**: None (standalone)
- **Files to create/modify**:
  - `src/hooks/useAdminAuth.js` — reads/writes `admin_token` in localStorage, provides `{ isAuthenticated, login(username, password), logout() }`, hardcoded credentials: `admin` / `admin123`
- **Acceptance criteria**:
  - `login` with correct credentials sets localStorage and returns true
  - `login` with wrong credentials sets error message and returns false
  - `logout` clears localStorage
  - `isAuthenticated` reflects localStorage state on mount
  - Persists across page refresh
- **Estimated effort**: Small
- **Risk**: Low

---

### T-030: Build LoginForm component

- **Name**: Create admin login form with validation
- **Dependencies**: T-029 (useAdminAuth)
- **Files to create/modify**:
  - `src/components/admin/LoginForm.jsx` — centered card with user/password inputs, "Iniciar sesión" button, error message display, loading state on submit
- **Acceptance criteria**:
  - Both fields required — shows inline validation
  - Wrong credentials: "Credenciales inválidas" shown below form
  - Correct credentials: redirects to dashboard view
  - Submit button disabled while processing
- **Estimated effort**: Small
- **Risk**: Low

---

### T-031: Build Admin page with DashboardTable and AdminHeader

- **Name**: Create admin dashboard with appointments table
- **Dependencies**: T-029 (useAdminAuth), T-030 (LoginForm), T-027 (useCalendarApi — list + delete)
- **Files to create/modify**:
  - `src/pages/Admin.jsx` — gate: not authed → `<LoginForm />`, authed → `<AdminHeader /> + <DashboardTable />`
  - `src/components/admin/DashboardTable.jsx` — table with columns (Fecha, Hora, Servicio, Cliente, Teléfono, Email, Acciones), loading skeleton (5 rows), empty state ("No hay citas próximas"), error + retry, delete button with confirmation dialog
  - `src/components/admin/AdminHeader.jsx` — "Panel de Administración" title + "Cerrar sesión" button
- **Acceptance criteria**:
  - Unauthenticated: shows login form
  - Authenticated: fetches events via `listEvents` on mount
  - Table shows parsed data from Calendar event description
  - Delete: confirmation dialog → `deleteEvent` → row removed
  - Empty: "No hay citas próximas" with illustration
  - Loading: 5 row skeletons
  - Error: retry button
  - Logout: clears localStorage, returns to login
- **Estimated effort**: Medium
- **Risk**: Medium (depends on Calendar API working)

---

## Phase 8: Polish & Deploy

### T-032: Responsive refinements and animation polish

- **Name**: Fix responsive edge cases, add micro-animations
- **Dependencies**: All previous phases
- **Files to modify**:
  - All page/component CSS files — ensure mobile layouts work across all screen sizes
  - `src/App.css` — clean up remaining boilerplate, add app-level styles
  - Remove unused Vite boilerplate assets
- **Acceptance criteria**:
  - All pages render correctly at 320px, 768px, 1024px, 1440px
  - Transitions are smooth (no jarring layout shifts)
  - Micro-animations: card hover transitions, page fade-in, skeleton pulse
  - No horizontal scroll on any page
- **Estimated effort**: Medium
- **Risk**: Low

---

### T-033: Add error boundaries and loading states

- **Name**: Add React error boundaries and final loading polish
- **Dependencies**: All previous phases
- **Files to create/modify**:
  - `src/components/shared/ErrorBoundary.jsx` — React error boundary class component with fallback UI
  - Wrap route components in error boundaries
  - Add route-level `<Suspense>` with loading fallback
- **Acceptance criteria**:
  - Uncaught errors in any component show friendly fallback
  - Route transitions show loading state
  - Console errors are caught by boundary (not crashing the whole app)
- **Estimated effort**: Small
- **Risk**: Low

---

### T-034: Final SEO, favicon, README, and deploy prep

- **Name**: Add SEO meta tags, favicon, update README, verify build
- **Dependencies**: All previous phases
- **Files to create/modify**:
  - `index.html` — add meta tags (description, OG tags, theme-color)
  - `public/favicon.svg` — spa-themed SVG favicon
  - `README.md` — replace Vite boilerplate with project-specific content
  - `public/icons.svg` — remove or replace with spa icons
  - Cleanup: remove unused `src/assets/` boilerplate images
- **Acceptance criteria**:
  - `pnpm build` completes with zero errors
  - `pnpm preview` serves the app correctly
  - All boilerplate Vite template content removed
  - Meta tags present for SEO
- **Estimated effort**: Medium
- **Risk**: Low

---

## Task Dependency Graph

```
T-001 (install + dirs)──────┐
T-002 (CSS theme)───────────┤
T-005 (vercel config)───────┤
                            │
Phase 1 completion──────────┤
                            │
T-006 (services data)───────┤────┐
T-008 (gallery+clinic)──────┤    │
T-007 (staff data)──────────┘    │
                                 │
T-003 (layout)←─T-002            │
  └─T-004 (router)←─T-003        │
       │                         │
       ├──T-011 (Home)           │
       ├──T-012 (Services)←─T-009, T-010, T-006
       ├──T-013 (Contact)←─T-008 │
       ├──T-015 (Professionals)←─T-007, T-014
       ├──T-018 (Gallery)←─T-008, T-016, T-017
       └──T-031 (Admin)←─T-029, T-030, T-027
                                 │
T-009 (shared utils)            │
T-010 (ServiceCard)             │
T-014 (StaffCard)               │
T-016 (GalleryImage)            │
T-017 (Lightbox)                │
                                 │
T-019 (BookingContext)──────────┐
  └─T-020 (Wizard)              │
       ├──T-021 (StepService+Staff)
       ├──T-022 (StepDateTime+TimeSlot)←─T-025
       ├──T-023 (StepContact)
       └──T-024 (StepConfirm)←─T-028
                                 │
T-025 (useAvailability)←─T-027   │
T-026 (Vercel Function)←─env vars│
  └─T-027 (api.js + hook)        │
       ├──T-028 (wire wizard)    │
       └──T-031 (Admin)←─────────┘
                                 │
T-029 (useAdminAuth)             │
T-030 (LoginForm)                │
                                 │
T-032 (responsive)               │
T-033 (error boundaries)         │
T-034 (SEO, README, cleanup)     │
```

---

## Review Workload Forecast

### Files Changed

| Metric | Count |
|--------|-------|
| **New files** | ~44 |
| **Modified files** | ~5 (`index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `src/App.css`, `package.json`) |
| **Deleted files** | ~3 (`src/assets/*.svg`, boilerplate assets) |
| **Total files in diff** | ~50 |

### Lines of Code

| Category | Estimate |
|----------|----------|
| Layout components (4 files) | ~320 lines |
| Pages (8 files) | ~800 lines |
| Shared components (9 files) | ~450 lines |
| Booking wizard + steps (9 files) | ~720 lines |
| Hooks (3 files) | ~120 lines |
| Seed data (4 files) | ~320 lines |
| Vercel Function + API client (2 files) | ~230 lines |
| Admin components (4 files) | ~320 lines |
| CSS (index.css + App.css + component styles) | ~500 lines |
| Config/meta files (vercel.json, README, index.html) | ~100 lines |
| **Subtotal new** | **~3,880 lines** |
| Boilerplate removed | ~383 lines |
| **Net additions** | **~3,500 lines** |

### Chained PR Recommendation

| Question | Answer |
|----------|--------|
| Does this exceed 400 lines? | ✅ **YES** — ~3,500 net additions, ~8.75× the threshold |
| Can this be delivered in a single PR? | Technically possible but **not recommended** — reviewer would face 50 files / 3,500 lines / 8 phases |
| Are Chained PRs recommended? | ✅ **STRONGLY RECOMMENDED** |
| What chain strategy? | Stacked PRs to main — each phase is an independent work unit that can land separately. Phases 5-6-7 have forward dependencies but can be reviewed independently. |
| Budget-safe single-PR possible? | Only with a recorded `size:exception` accepting the review burden. Not recommended for a demo project at this scale. |

### Proposal

Given `delivery_strategy: ask-on-risk`:

**Recommended split**: 4 chained PRs

| Chained PR | Phases | Files | Est. Lines | Risk |
|------------|--------|-------|------------|------|
| PR #1 | Phase 1 (Foundation) + Phase 2 (Seed Data) | ~14 | ~800 | Low |
| PR #2 | Phase 3 (Home/Services/Contact) + Phase 4 (Staff/Gallery) | ~14 | ~1,200 | Low |
| PR #3 | Phase 5 (Booking Wizard) + Phase 6 (Calendar Integration) | ~14 | ~1,400 | High |
| PR #4 | Phase 7 (Admin Dashboard) + Phase 8 (Polish) | ~10 | ~900 | Medium |

**Decision needed before apply**: ✅ YES — need to decide between 1× single-PR (with `size:exception`) vs 4× chained PRs.
