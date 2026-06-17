import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSkeleton from './components/shared/LoadingSkeleton';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Staff = lazy(() => import('./pages/Staff'));
const StaffDetail = lazy(() => import('./pages/StaffDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Booking = lazy(() => import('./pages/Booking'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));

function SuspenseWrapper({ children }) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '3rem 1rem' }}>
          <LoadingSkeleton count={3} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <ErrorBoundary>
              <SuspenseWrapper>
                <Home />
              </SuspenseWrapper>
            </ErrorBoundary>
          }
        />
        <Route
          path="services"
          element={
            <ErrorBoundary>
              <SuspenseWrapper>
                <Services />
              </SuspenseWrapper>
            </ErrorBoundary>
          }
        />
        <Route
          path="services/:slug"
          element={
            <ErrorBoundary>
              <SuspenseWrapper>
                <ServiceDetail />
              </SuspenseWrapper>
            </ErrorBoundary>
          }
        />
        <Route
          path="staff"
          element={
            <ErrorBoundary>
              <SuspenseWrapper>
                <Staff />
              </SuspenseWrapper>
            </ErrorBoundary>
          }
        />
        <Route
          path="staff/:slug"
          element={
            <ErrorBoundary>
              <SuspenseWrapper>
                <StaffDetail />
              </SuspenseWrapper>
            </ErrorBoundary>
          }
        />
        <Route
          path="gallery"
          element={
            <ErrorBoundary>
              <SuspenseWrapper>
                <Gallery />
              </SuspenseWrapper>
            </ErrorBoundary>
          }
        />
        <Route
          path="booking"
          element={
            <ErrorBoundary fallbackMessage="Probá recargar la página.">
              <SuspenseWrapper>
                <Booking />
              </SuspenseWrapper>
            </ErrorBoundary>
          }
        />
        <Route
          path="contact"
          element={
            <ErrorBoundary>
              <SuspenseWrapper>
                <Contact />
              </SuspenseWrapper>
            </ErrorBoundary>
          }
        />
        <Route
          path="admin"
          element={
            <ErrorBoundary>
              <SuspenseWrapper>
                <Admin />
              </SuspenseWrapper>
            </ErrorBoundary>
          }
        />
      </Route>
    </Routes>
  );
}
