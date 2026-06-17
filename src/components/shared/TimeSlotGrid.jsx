import styles from './TimeSlotGrid.module.css';

export default function TimeSlotGrid({
  available,
  booked,
  selectedSlot,
  onSelect,
  isLoading,
  error,
  onRetry,
}) {
  if (error) {
    return (
      <div className={styles.error}>
        <p className={styles.errorMessage}>{error}</p>
        <button type="button" className={styles.retryBtn} onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.grid} role="status" aria-label="Cargando horarios">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  if (available.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>
          No hay horarios disponibles para esta fecha.
        </p>
      </div>
    );
  }

  // Build a set of available times for quick lookup
  const availableSet = new Set(available);

  // Merge available and booked, showing available first then booked
  const allSlots = [...new Set([...available, ...booked.map((b) => b.start)])].sort();

  return (
    <div className={styles.grid}>
      {allSlots.map((time) => {
        const isAvailable = availableSet.has(time);
        const isSelected = selectedSlot === time;
        return (
          <button
            key={time}
            type="button"
            className={`${styles.slot} ${isAvailable ? styles.available : styles.booked} ${
              isSelected ? styles.selected : ''
            }`}
            disabled={!isAvailable}
            onClick={() => isAvailable && onSelect(time)}
            aria-pressed={isSelected}
            aria-label={`${time}${isAvailable ? '' : ' — Ocupado'}`}
          >
            {time}
            {!isAvailable && <span className={styles.ocupado}>Ocupado</span>}
          </button>
        );
      })}
    </div>
  );
}
