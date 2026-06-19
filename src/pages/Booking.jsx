import { useSearchParams } from 'react-router-dom';
import { BookingProvider } from '../components/booking/BookingContext';
import BookingWizard from '../components/booking/BookingWizard';
import { getServiceBySlug } from '../data/services';
import { getStaffBySlug } from '../data/staff';

export default function Booking() {
  const [searchParams] = useSearchParams();

  // Pre-selección desde query params: /booking?service=X&staff=Y
  const serviceSlug = searchParams.get('service');
  const staffSlug = searchParams.get('staff');

  const preSelectedService = serviceSlug ? getServiceBySlug(serviceSlug) : null;
  const preSelectedStaff = staffSlug ? getStaffBySlug(staffSlug) : null;

  // Si ya viene con servicio, arrancamos en paso 2 (elegir profesional)
  // Si viene con servicio + profesional, arrancamos en paso 3 (fecha/hora)
  let initialStep = 1;
  if (preSelectedService) initialStep = 2;
  if (preSelectedService && preSelectedStaff) initialStep = 3;

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <BookingProvider
        initialServiceId={preSelectedService?.id ?? null}
        initialStaffId={preSelectedStaff?.id ?? null}
      >
        <BookingWizard initialStep={initialStep} />
      </BookingProvider>
    </div>
  );
}
