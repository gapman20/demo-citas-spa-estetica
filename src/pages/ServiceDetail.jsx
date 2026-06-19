import { useParams, Link } from 'react-router-dom';
import { getServiceBySlug } from '../data/services';
import styles from './ServiceDetail.module.css';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>Servicio no encontrado</h1>
            <p className={styles.notFoundDesc}>
              El servicio que buscás no existe o ha sido eliminado.
            </p>
            <Link to="/services" className={styles.backLink}>
              &larr; Ver todos los servicios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const priceFormatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(service.price);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ─── Breadcrumb ─── */}
        <nav className={styles.breadcrumb} aria-label="Navegación">
          <Link to="/services" className={styles.breadcrumbLink}>
            Servicios
          </Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>{service.name}</span>
        </nav>

        <div className={styles.detail}>
          {/* ─── Image ─── */}
          <div className={styles.imageWrapper}>
            <img
              src={service.image}
              alt={service.name}
              className={styles.image}
            />
          </div>

          {/* ─── Info ─── */}
          <div className={styles.info}>
            <span className={styles.category}>{service.category}</span>
            <h1 className={styles.name}>{service.name}</h1>
            <p className={styles.description}>{service.description}</p>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Duración</span>
                <span className={styles.metaValue}>{service.duration} min</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Precio</span>
                <span className={styles.metaValue}>{priceFormatted}</span>
              </div>
            </div>

            <Link
              to={`/booking?service=${service.slug}`}
              className={styles.ctaBtn}
            >
              Reservar turno
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
