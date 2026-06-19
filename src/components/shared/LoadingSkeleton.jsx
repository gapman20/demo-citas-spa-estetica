import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  if (type === 'text') {
    return (
      <div className={styles.wrapper} role="status" aria-label="Cargando contenido">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={styles.textLine} />
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={styles.wrapper} role="status" aria-label="Cargando contenido">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.image} />
            <div className={styles.body}>
              <div className={styles.title} />
              <div className={styles.meta} />
              <div className={styles.description} />
              <div className={styles.description} style={{ width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
