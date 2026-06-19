import staff from '../data/staff';
import StaffCard from '../components/shared/StaffCard';
import styles from './Staff.module.css';

export default function Staff() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ─── Header ─── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Nuestro Equipo</h1>
          <span className={styles.starOrnament} aria-hidden="true">✦</span>
          <p className={styles.subtitle}>
            Conocé a los profesionales que hacen de Serenity Spa un espacio único
            de bienestar.
          </p>
        </div>

        {/* ─── Staff Grid ─── */}
        <div className={`${styles.grid} stagger`}>
          {staff.map((member) => (
            <StaffCard key={member.id} staff={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
