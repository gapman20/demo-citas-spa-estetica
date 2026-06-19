import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './StaffCard.module.css';

function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColor(name) {
  const hues = [350, 220, 160, 40, 280, 10, 190, 80];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hues[Math.abs(hash) % hues.length]}, 55%, 40%)`;
}

export default function StaffCard({ staff, readonly }) {
  const [imgError, setImgError] = useState(false);
  if (!staff) return null;

  const content = (
    <>
      <div className={styles.imageWrapper}>
        {imgError ? (
          <div
            className={styles.imgFallback}
            style={{ backgroundColor: getColor(staff.name) }}
            aria-hidden="true"
          >
            <span className={styles.initials}>{getInitials(staff.name)}</span>
          </div>
        ) : (
          <img
            src={staff.photo}
            alt={staff.name}
            className={styles.image}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{staff.name}</h3>
        <p className={styles.title}>{staff.title}</p>
        <p className={styles.specialty}>{staff.specialty}</p>
      </div>
    </>
  );

  return (
    <article className={styles.card}>
      {readonly ? (
        <div className={styles.link}>{content}</div>
      ) : (
        <Link to={`/staff/${staff.slug}`} className={styles.link}>
          {content}
        </Link>
      )}
    </article>
  );
}
