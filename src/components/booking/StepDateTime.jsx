import { useState } from 'react';
import { useBooking, useBookingDispatch } from './BookingContext';
import useAvailability from '../../hooks/useAvailability';
import TimeSlotGrid from '../shared/TimeSlotGrid';
import styles from './StepDateTime.module.css';

function formatDisplayDate(date) {
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function todayString() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Returns true if a "HH:MM" slot is strictly in the past relative to now
function isPastSlot(time) {
  const now = new Date();
  const [h, m] = time.split(':').map(Number);
  return h < now.getHours() || (h === now.getHours() && m <= now.getMinutes());
}

export default function StepDateTime() {
  const state = useBooking();
  const dispatch = useBookingDispatch();

  const [currentDate, setCurrentDate] = useState(todayString());

  const { available, booked, isLoading, isRefreshing, error, retry } = useAvailability(
    currentDate,
    state.staffId
  );

  function goPrevDay() {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  }

  function goNextDay() {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  }

  function handleSelectSlot(time) {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    dispatch({
      type: 'SET_DATE_TIME',
      date: `${y}-${m}-${d}`,
      timeSlot: time,
    });
  }

  const isToday =
    currentDate.toDateString() === new Date().toDateString();

  return (
    <div className={styles.wrapper}>
      <div className={styles.dateNav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={goPrevDay}
          aria-label="Día anterior"
        >
          ←
        </button>
        <span className={styles.dateLabel}>
          {formatDisplayDate(currentDate)}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={goNextDay}
          aria-label="Día siguiente"
        >
        →
        </button>
        {isRefreshing && (
          <span className={styles.refreshing} aria-live="polite">↻ Actualizando...</span>
        )}
      </div>

      {/* Pre-select today's date in context if not set */}
      {!state.date && (
        <div className={styles.autoSelectHint}>
          {isToday && <p className={styles.hint}>Mostrando horarios de hoy</p>}
        </div>
      )}

      <TimeSlotGrid
        available={isToday ? available.filter((t) => !isPastSlot(t)) : available}
        booked={booked}
        selectedSlot={state.timeSlot}
        onSelect={handleSelectSlot}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
      />

      {state.date && state.timeSlot && (
        <p className={styles.selectedSlot}>
          Horario seleccionado: {state.date} a las {state.timeSlot}
        </p>
      )}
    </div>
  );
}
