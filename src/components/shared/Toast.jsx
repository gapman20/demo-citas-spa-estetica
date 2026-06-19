import { useEffect } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.icon}>
        {type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
      </span>
      <span className={styles.message}>{message}</span>
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Cerrar notificación"
        type="button"
      >
        ✕
      </button>
    </div>
  );
}
