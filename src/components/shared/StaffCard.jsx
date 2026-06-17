import { Link } from 'react-router-dom';
import styles from './StaffCard.module.css';

export default function StaffCard({ staff }) {
  if (!staff) return null;

  return (
    <article className={styles.card}>
      <Link to={`/staff/${staff.slug}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img
            src={staff.photo}
            alt={staff.name}
            className={styles.image}
            loading="lazy"
          />
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{staff.name}</h3>
          <p className={styles.title}>{staff.title}</p>
          <p className={styles.specialty}>{staff.specialty}</p>
        </div>
      </Link>
    </article>
  );
}
