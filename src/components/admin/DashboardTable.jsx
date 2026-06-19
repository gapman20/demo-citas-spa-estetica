import { useState, useEffect, useCallback } from 'react';
import useCalendarApi from '../../hooks/useCalendarApi';
import styles from './DashboardTable.module.css';

function parseEventDescription(description) {
  const fields = {};
  if (!description) return fields;

  for (const line of description.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();
    if (key === 'servicio') fields.service = value;
    else if (key === 'cliente') fields.client = value;
    else if (key === 'tel' || key === 'teléfono') fields.phone = value;
    else if (key === 'email') fields.email = value;
  }
  return fields;
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return dateStr;
  }
}

function formatTime(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    });
  } catch {
    return dateStr;
  }
}

function getDateBounds() {
  const now = new Date();
  const timeMin = now.toISOString();
  const timeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();
  return { timeMin, timeMax };
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <tr key={i} className={styles.skeletonRow}>
          {Array.from({ length: 7 }, (_, j) => (
            <td key={j}>
              <div className={styles.skeletonCell} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function DashboardTable() {
  const { listEvents, deleteEvent } = useCalendarApi();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    async function load() {
      const { timeMin, timeMax } = getDateBounds();
      const data = await listEvents(timeMin, timeMax);
      return data.events || [];
    }
    load()
      .then((events) => { if (!cancelled) setEvents(events); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Error al cargar las citas.'); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [listEvents]);

  const retry = () => {
    setIsLoading(true);
    setError(null);
    const { timeMin, timeMax } = getDateBounds();
    listEvents(timeMin, timeMax)
      .then((data) => setEvents(data.events || []))
      .catch((err) => setError(err.message || 'Error al cargar las citas.'))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = useCallback(
    async (eventId) => {
      setIsDeleting(true);
      try {
        await deleteEvent(eventId);
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      } catch (err) {
        // Keep the row on error — user can retry
        setError(err.message || 'Error al eliminar la cita.');
      } finally {
        setIsDeleting(false);
        setDeleteTarget(null);
      }
    },
    [deleteEvent]
  );

  // ─── Loading State ───
  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Servicio</th>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <SkeletonRows />
          </tbody>
        </table>
      </div>
    );
  }

  // ─── Error State ───
  if (error && events.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.errorCard} role="alert">
          <span className={styles.errorIcon} aria-hidden="true">!</span>
          <p className={styles.errorMessage}>{error}</p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={retry}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ─── Empty State ───
  if (events.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">📋</span>
          <h3 className={styles.emptyTitle}>No hay citas próximas</h3>
          <p className={styles.emptyDesc}>
            Todas las citas agendadas aparecerán acá.
          </p>
        </div>
      </div>
    );
  }

  // ─── Data State ───
  return (
    <div className={styles.wrapper}>
      {error && (
        <div className={styles.errorBanner} role="alert">
          <span>{error}</span>
          <button
            type="button"
            className={styles.bannerClose}
            onClick={() => setError(null)}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Servicio</th>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const parsed = parseEventDescription(event.description);
              return (
                <tr key={event.id} className={styles.row}>
                  <td className={styles.cellDate}>
                    {formatDate(event.start?.dateTime)}
                  </td>
                  <td>{formatTime(event.start?.dateTime)}</td>
                  <td className={styles.cellService}>
                    {parsed.service || event.summary || '—'}
                  </td>
                  <td className={styles.cellClient}>
                    {parsed.client || '—'}
                  </td>
                  <td className={styles.cellPhone}>
                    {parsed.phone || '—'}
                  </td>
                  <td className={styles.cellEmail}>
                    {parsed.email || '—'}
                  </td>
                  <td className={styles.cellActions}>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => setDeleteTarget(event.id)}
                      disabled={isDeleting}
                      aria-label={`Eliminar cita del ${formatDate(event.start?.dateTime)}`}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Delete Confirmation Dialog ─── */}
      {deleteTarget && (
        <div
          className={styles.dialogOverlay}
          onClick={() => !isDeleting && setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className={styles.dialog}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-dialog-title" className={styles.dialogTitle}>
              Eliminar cita
            </h3>
            <p className={styles.dialogText}>
              ¿Estás seguro de que querés eliminar esta cita? Esta acción no se puede deshacer.
            </p>
            <div className={styles.dialogActions}>
              <button
                type="button"
                className={styles.dialogCancel}
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.dialogConfirm}
                onClick={() => handleDelete(deleteTarget)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
