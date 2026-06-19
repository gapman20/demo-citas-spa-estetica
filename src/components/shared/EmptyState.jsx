import styles from './EmptyState.module.css';

export default function EmptyState({
  icon = '○',
  title = 'Sin contenido',
  description = 'No hay elementos disponibles en este momento.',
  actionLabel,
  onAction,
}) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {actionLabel && onAction && (
        <button className={styles.actionBtn} onClick={onAction} type="button">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
