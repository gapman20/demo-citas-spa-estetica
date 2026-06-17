import { Link } from 'react-router-dom';
import styles from './ServiceCard.module.css';

export default function ServiceCard({ service }) {
  if (!service) return null;

  const priceFormatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(service.price);

  return (
    <article className={styles.card}>
      <Link to={`/services/${service.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img
            src={service.image}
            alt={service.name}
            className={styles.image}
            loading="lazy"
          />
          <span className={styles.duration}>{service.duration} min</span>
        </div>
      </Link>
      <div className={styles.body}>
        <span className={styles.category}>{service.category}</span>
        <Link to={`/services/${service.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{service.name}</h3>
        </Link>
        <p className={styles.description}>{service.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{priceFormatted}</span>
          <Link to={`/booking?service=${service.slug}`} className={styles.cta}>
            Reservar
          </Link>
        </div>
      </div>
    </article>
  );
}
