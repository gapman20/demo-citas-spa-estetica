import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBooking, useBookingDispatch } from './BookingContext';
import servicesData from '../../data/services';
import staffData from '../../data/staff';
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
    setSubmitState('submitting');

    try {
      // Simulate API call — will be wired to real useCalendarApi in T-028
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success 80% of the time
          if (Math.random() > 0.2) {
            resolve();
          } else {
            reject(new Error('conflict'));
          }
        }, 1500);
      });

      dispatch({ type: 'RESET' });
      setSubmitState('success');
    } catch (err) {
      setSubmitState(
        err.message === 'conflict' ? 'error-conflict' : 'error-network'
      );
    }
  }, [dispatch]);

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
