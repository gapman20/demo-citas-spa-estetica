import styles from './ErrorMessage.module.css';

export default function ErrorMessage({
  message = 'Ocurrió un error inesperado.',
  onRetry,
}) {
  return (
    <div className={styles.wrapper} role="alert">
      <div className={styles.icon} aria-hidden="true">!</div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry} type="button">
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
