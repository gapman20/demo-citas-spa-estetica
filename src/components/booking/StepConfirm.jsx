import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBooking, useBookingDispatch } from './BookingContext';
import servicesData from '../../data/services';
import staffData from '../../data/staff';
import useCalendarApi from '../../hooks/useCalendarApi';
import styles from './StepConfirm.module.css';

function findService(id) {
  return servicesData.find((s) => s.id === id) || null;
}

function findStaff(id) {
  return staffData.find((s) => s.id === id) || null;
}

export default function StepConfirm({ onReset }) {
  const state = useBooking();
  const dispatch = useBookingDispatch();
  const { createEvent } = useCalendarApi();

  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | success | error-conflict | error-network

  const service = findService(state.serviceId);
  const staff = findStaff(state.staffId);

  const priceFormatted = service
    ? new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
      }).format(service.price)
    : '';

  const handleSubmit = useCallback(async () => {
    if (!service || !state.date || !state.timeSlot) return;

    setSubmitState('submitting');

    const start = `${state.date}T${state.timeSlot}:00`;
    const [h, m] = state.timeSlot.split(':').map(Number);
    const endMinutes = h * 60 + m + service.duration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const end = `${state.date}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

    try {
      const description = [
        `Servicio: ${service.name}`,
        `Cliente: ${state.clientName}`,
        `Tel: ${state.clientPhone}`,
        `Email: ${state.clientEmail}`,
        state.notes ? `Notas: ${state.notes}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      await createEvent({
        summary: `Cita: ${service.name} - ${state.clientName}`,
        start,
        end,
        description,
      });

      dispatch({ type: 'RESET' });
      setSubmitState('success');
    } catch (err) {
      const status = err.status || (err.message || '').toLowerCase();
      if (status === 409 || status === 'conflict') {
        setSubmitState('error-conflict');
      } else {
        setSubmitState('error-network');
      }
    }
  }, [state, service, dispatch, createEvent]);

  function handleRetry() {
    setSubmitState('idle');
  }

  function handleChooseOtherTime() {
    onReset();
  }

  if (submitState === 'success') {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h3 className={styles.successTitle}>¡Cita Agendada!</h3>
        <p className={styles.successText}>
          Tu cita fue registrada correctamente. Te enviaremos un recordatorio.
        </p>
        <Link to="/" className={styles.homeBtn}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Resumen de tu Cita</h3>

        <div className={styles.row}>
          <span className={styles.label}>Servicio</span>
          <span className={styles.value}>
            {service ? service.name : '—'}
          </span>
        </div>
        {service && (
          <div className={styles.row}>
            <span className={styles.label}>Duración</span>
            <span className={styles.value}>{service.duration} min</span>
          </div>
        )}
        {service && (
          <div className={styles.row}>
            <span className={styles.label}>Precio</span>
            <span className={styles.value}>{priceFormatted}</span>
          </div>
        )}

        <div className={styles.row}>
          <span className={styles.label}>Profesional</span>
          <span className={styles.value}>{staff ? staff.name : '—'}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Fecha</span>
          <span className={styles.value}>{state.date || '—'}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Horario</span>
          <span className={styles.value}>{state.timeSlot || '—'}</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.row}>
          <span className={styles.label}>Nombre</span>
          <span className={styles.value}>{state.clientName || '—'}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Teléfono</span>
          <span className={styles.value}>{state.clientPhone || '—'}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{state.clientEmail || '—'}</span>
        </div>

        {state.notes && (
          <div className={styles.row}>
            <span className={styles.label}>Notas</span>
            <span className={styles.value}>{state.notes}</span>
          </div>
        )}
      </div>

      {submitState === 'error-conflict' && (
        <div className={styles.errorCard} role="alert">
          <p className={styles.errorText}>
            Ese horario ya no está disponible.
          </p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={handleChooseOtherTime}
          >
            Elegir otro horario
          </button>
        </div>
      )}

      {submitState === 'error-network' && (
        <div className={styles.errorCard} role="alert">
          <p className={styles.errorText}>
            Error de conexión. Verificá tu internet e intentá de nuevo.
          </p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={handleRetry}
          >
            Reintentar
          </button>
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onReset}
          disabled={submitState === 'submitting'}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={styles.confirmBtn}
          onClick={handleSubmit}
          disabled={submitState === 'submitting'}
        >
          {submitState === 'submitting' ? 'Agendando...' : 'Confirmar Cita'}
        </button>
      </div>

      {submitState === 'submitting' && (
        <div className={styles.overlay} role="status">
          <div className={styles.overlayContent}>
            <div className={styles.spinner} />
            <p className={styles.overlayText}>Agendando tu cita…</p>
          </div>
        </div>
      )}
    </div>
  );
}
