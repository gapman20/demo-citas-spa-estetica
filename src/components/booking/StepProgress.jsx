import styles from './StepProgress.module.css';

const STEPS = [
  { num: 1, label: 'Servicio' },
  { num: 2, label: 'Profesional' },
  { num: 3, label: 'Fecha y Hora' },
  { num: 4, label: 'Tus Datos' },
  { num: 5, label: 'Confirmar' },
];

export default function StepProgress({ currentStep }) {
  return (
    <nav className={styles.wrapper} aria-label="Progreso de reserva">
      <ol className={styles.list}>
        {STEPS.map((step) => {
          const isCompleted = step.num < currentStep;
          const isActive = step.num === currentStep;
          return (
            <li key={step.num} className={styles.item}>
              <span
                className={`${styles.dot} ${
                  isCompleted ? styles.completed : ''
                } ${isActive ? styles.active : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? '✓' : step.num}
              </span>
              <span
                className={`${styles.label} ${
                  isActive ? styles.labelActive : ''
                } ${isCompleted ? styles.labelCompleted : ''}`}
              >
                {step.label}
              </span>
              {step.num < STEPS.length && (
                <span
                  className={`${styles.connector} ${
                    isCompleted ? styles.connectorCompleted : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
