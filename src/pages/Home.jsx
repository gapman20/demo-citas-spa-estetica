import { Link } from 'react-router-dom';
import services from '../data/services';
import ServiceCard from '../components/shared/ServiceCard';
import styles from './Home.module.css';

const featuredServices = services.slice(0, 3);

export default function Home() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Tu momento de <span className={styles.heroAccent}>bienestar</span>{' '}
            comienza aquí
          </h1>
          <p className={styles.heroSubtitle}>
            En Serenity Spa combinamos ciencia del cuidado de la piel con el arte
            del bienestar para ofrecerte una experiencia única.
          </p>
          <div className={styles.heroActions}>
            <Link to="/booking" className={styles.heroCta}>
              Reservá tu cita
            </Link>
            <Link to="/services" className={styles.heroSecondary}>
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Services ─── */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Tratamientos</span>
            <h2 className={styles.sectionTitle}>Nuestros servicios destacados</h2>
            <p className={styles.sectionDesc}>
              Desde faciales avanzados hasta masajes terapéuticos, cada tratamiento
              está diseñado para cuidar de vos.
            </p>
          </div>
          <div className={styles.grid}>
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className={styles.seeAll}>
            <Link to="/services" className={styles.seeAllLink}>
              Ver todos los servicios &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>¿Lista para tu próxima experiencia?</h2>
          <p className={styles.ctaDesc}>
            Agendá tu cita online en segundos. Elegí el servicio, el profesional y
            el horario que mejor te quede.
          </p>
          <Link to="/booking" className={styles.ctaBtn}>
            Agendá ahora
          </Link>
        </div>
      </section>
    </>
  );
}
