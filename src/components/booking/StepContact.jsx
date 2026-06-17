import { useState } from 'react';
import { useBooking, useBookingDispatch } from './BookingContext';
import styles from './StepContact.module.css';

function validateName(name) {
  if (!name.trim()) return 'El nombre es obligatorio.';
  return '';
}

function validatePhone(phone) {
  if (!phone.trim()) return 'El teléfono es obligatorio.';
  // Accept Argentine phone formats: +54911..., 011..., 11...
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (!/^\+?\d{7,15}$/.test(cleaned)) return 'Ingresá un teléfono válido (ej: +5491112345678).';
  return '';
}

function validateEmail(email) {
  if (!email.trim()) return 'El correo electrónico es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresá un correo electrónico válido.';
  return '';
}

export default function StepContact({ onNext, onBack }) {
  const state = useBooking();
  const dispatch = useBookingDispatch();

  const [form, setForm] = useState({
    clientName: state.clientName || '',
    clientPhone: state.clientPhone || '',
    clientEmail: state.clientEmail || '',
    notes: state.notes || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change if touched
    if (touched[field]) {
      const error = validate(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validate(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function validate(field, value) {
    switch (field) {
      case 'clientName':
        return validateName(value);
      case 'clientPhone':
        return validatePhone(value);
      case 'clientEmail':
        return validateEmail(value);
      default:
        return '';
    }
  }

  function validateAll() {
    const newErrors = {
      clientName: validateName(form.clientName),
      clientPhone: validatePhone(form.clientPhone),
      clientEmail: validateEmail(form.clientEmail),
    };
    setErrors(newErrors);
    setTouched({ clientName: true, clientPhone: true, clientEmail: true });
    return !Object.values(newErrors).some(Boolean);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;

    dispatch({
      type: 'SET_CONTACT',
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.trim(),
      clientEmail: form.clientEmail.trim(),
      notes: form.notes.trim(),
    });

    onNext();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="clientName" className={styles.label}>
          Nombre <span className={styles.required}>*</span>
        </label>
        <input
          id="clientName"
          type="text"
          className={`${styles.input} ${errors.clientName && touched.clientName ? styles.inputError : ''}`}
          value={form.clientName}
          onChange={(e) => handleChange('clientName', e.target.value)}
          onBlur={() => handleBlur('clientName')}
          placeholder="Tu nombre"
          autoComplete="name"
        />
        {errors.clientName && touched.clientName && (
          <p className={styles.error}>{errors.clientName}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="clientPhone" className={styles.label}>
          Teléfono <span className={styles.required}>*</span>
        </label>
        <input
          id="clientPhone"
          type="tel"
          className={`${styles.input} ${errors.clientPhone && touched.clientPhone ? styles.inputError : ''}`}
          value={form.clientPhone}
          onChange={(e) => handleChange('clientPhone', e.target.value)}
          onBlur={() => handleBlur('clientPhone')}
          placeholder="+5491112345678"
          autoComplete="tel"
        />
        {errors.clientPhone && touched.clientPhone && (
          <p className={styles.error}>{errors.clientPhone}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="clientEmail" className={styles.label}>
          Correo Electrónico <span className={styles.required}>*</span>
        </label>
        <input
          id="clientEmail"
          type="email"
          className={`${styles.input} ${errors.clientEmail && touched.clientEmail ? styles.inputError : ''}`}
          value={form.clientEmail}
          onChange={(e) => handleChange('clientEmail', e.target.value)}
          onBlur={() => handleBlur('clientEmail')}
          placeholder="tucorreo@ejemplo.com"
          autoComplete="email"
        />
        {errors.clientEmail && touched.clientEmail && (
          <p className={styles.error}>{errors.clientEmail}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="notes" className={styles.label}>
          Notas <span className={styles.optional}>(opcional)</span>
        </label>
        <textarea
          id="notes"
          className={styles.textarea}
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Alguna nota o comentario para tu cita..."
          rows={3}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Atrás
        </button>
        <button type="submit" className={styles.submitBtn}>
          Siguiente →
        </button>
      </div>
    </form>
  );
}
