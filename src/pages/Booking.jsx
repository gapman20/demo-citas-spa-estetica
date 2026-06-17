import { BookingProvider } from '../components/booking/BookingContext';
import BookingWizard from '../components/booking/BookingWizard';

export default function Booking() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <BookingProvider>
        <BookingWizard />
      </BookingProvider>
    </div>
  );
}
