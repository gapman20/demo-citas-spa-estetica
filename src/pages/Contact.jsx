import { useState, useCallback } from 'react';
import clinic from '../data/clinic';
import Toast from '../components/shared/Toast';
import styles from './Contact.module.css';

const initialForm = { name: '', email: '', message: '' };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Este campo es obligatorio';
  if (!form.email.trim()) {
    errors.email = 'Este campo es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresá un correo electrónico válido';
  }
  if (!form.message.trim()) errors.message = 'Este campo es obligatorio';
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        const fieldErrors = validate({ ...form, [name]: value });
        if (fieldErrors[name]) next[name] = fieldErrors[name];
        else delete next[name];
        return next;
      });
    }
  }, [form, touched]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(form);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldErrors[name]) next[name] = fieldErrors[name];
      else delete next[name];
      return next;
    });
  }, [form]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(validationErrors).length === 0) {
      setToast({ message: 'Mensaje enviado (demo)', type: 'success' });
      setForm(initialForm);
      setTouched({});
    }
  }, [form]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ─── Header ─── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Contacto</h1>
          <span className={styles.starOrnament} aria-hidden="true">✦</span>
          <p className={styles.subtitle}>
            Estamos para ayudarte. Encontranos o escribinos.
          </p>
        </div>

        <div className={styles.grid}>
          {/* ─── Left: Info + Map ─── */}
          <div className={styles.infoColumn}>
            {/* Clinic Info */}
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>{clinic.name}</h2>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden="true">📍</span>
                <span>{clinic.address}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden="true">📞</span>
                <a href={`tel:${clinic.phone}`} className={styles.infoLink}>
                  {clinic.phone}
                </a>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon} aria-hidden="true">✉</span>
                <a href={`mailto:${clinic.email}`} className={styles.infoLink}>
                  {clinic.email}
                </a>
              </div>

              <div className={styles.hoursSection}>
                <h3 className={styles.hoursTitle}>Horarios</h3>
                {clinic.hours.map((item, i) => (
                  <div key={i} className={styles.hoursRow}>
                    <span className={styles.hoursDay}>{item.day}</span>
                    <span className={styles.hoursTime}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className={styles.mapWrapper}>
              <iframe
                title="Ubicación de Serenity Spa"
                src={`https://maps.google.com/maps?q=${clinic.mapCoordinates.lat},${clinic.mapCoordinates.lng}&z=15&output=embed`}
                className={styles.mapIframe}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ─── Right: Contact Form ─── */}
          <div className={styles.formColumn}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                  Nombre <span aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!(errors.name && touched.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && touched.name && (
                  <p id="name-error" className={styles.fieldError} role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Correo electrónico <span aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                  placeholder="tucorreo@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!(errors.email && touched.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && touched.email && (
                  <p id="email-error" className={styles.fieldError} role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="message" className={styles.label}>
                  Mensaje <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={`${styles.textarea} ${errors.message && touched.message ? styles.inputError : ''}`}
                  placeholder="Escribí tu mensaje..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!(errors.message && touched.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && touched.message && (
                  <p id="message-error" className={styles.fieldError} role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              <button type="submit" className={styles.submitBtn}>
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ─── Toast ─── */}
      {toast && (
        <div className={styles.toastWrapper}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
