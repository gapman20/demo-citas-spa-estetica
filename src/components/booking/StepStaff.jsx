import { useBooking, useBookingDispatch } from './BookingContext';
import staff from '../../data/staff';
import StaffCard from '../shared/StaffCard';
import styles from './StepStaff.module.css';

export default function StepStaff({ onNext }) {
  const state = useBooking();
  const dispatch = useBookingDispatch();

  const filtered = state.serviceId
    ? staff.filter((s) => s.services.includes(state.serviceId))
    : staff;

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>
        {state.serviceId
          ? 'Estos son los profesionales que realizan el servicio seleccionado:'
          : 'Elegí un profesional disponible:'}
      </p>

      <div className={styles.grid}>
        {filtered.map((person) => {
          const isSelected = state.staffId === person.id;
          return (
            <button
              key={person.id}
              type="button"
              className={`${styles.cardBtn} ${isSelected ? styles.selected : ''}`}
              onClick={() => {
                dispatch({ type: 'SET_STAFF', staffId: person.id });
                onNext?.();
              }}
            >
              <StaffCard staff={person} readonly />
              {isSelected && (
                <span className={styles.checkmark} aria-label="Seleccionado">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className={styles.empty}>
          No hay profesionales disponibles para este servicio.
        </p>
      )}
    </div>
  );
}
