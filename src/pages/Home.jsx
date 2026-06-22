import { Link } from 'react-router-dom';
import services from '../data/services';
import ServiceCard from '../components/shared/ServiceCard';
import useInView from '../hooks/useInView';
import styles from './Home.module.css';

const featuredServices = services.slice(0, 3);

export default function Home() {
  const [whyRef, whyInView] = useInView();
  const [servicesRef, servicesInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

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

      {/* ─── Why Us ─── */}
      <section ref={whyRef} className={styles.whyUs}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} ${whyInView ? styles.headerVisible : ''}`}>
            <span className={styles.sectionLabel}>¿Por qué Serenity?</span>
            <span className={styles.starOrnament} aria-hidden="true">✦</span>
            <h2 className={styles.sectionTitle}>Tu bienestar es nuestra prioridad</h2>
          </div>
          <div className={`${styles.highlightsGrid} ${whyInView ? styles.highlightsVisible : ''}`}>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon} aria-hidden="true">✦</div>
              <h3 className={styles.highlightTitle}>Profesionales certificados</h3>
              <p className={styles.highlightDesc}>
                Cada miembro de nuestro equipo cuenta con formación especializada y
                actualización constante en las últimas técnicas.
              </p>
            </div>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon} aria-hidden="true">○</div>
              <h3 className={styles.highlightTitle}>Productos premium</h3>
              <p className={styles.highlightDesc}>
                Trabajamos con marcas reconocidas internacionalmente para garantizar
                resultados visibles y cuidado de tu piel.
              </p>
            </div>
            <div className={styles.highlight}>
              <div className={styles.highlightIcon} aria-hidden="true">⊚</div>
              <h3 className={styles.highlightTitle}>Ambiente único</h3>
              <p className={styles.highlightDesc}>
                Un espacio diseñado para que te desconectes del estrés y te
                reconectes con vos misma desde el momento que entrás.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Services ─── */}
      <section ref={servicesRef} className={styles.featured}>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} ${servicesInView ? styles.headerVisible : ''}`}>
            <span className={styles.sectionLabel}>Tratamientos</span>
            <span className={styles.starOrnament} aria-hidden="true">✦</span>
            <h2 className={styles.sectionTitle}>Nuestros servicios destacados</h2>
            <p className={styles.sectionDesc}>
              Desde faciales avanzados hasta masajes terapéuticos, cada tratamiento
              está diseñado para cuidar de vos.
            </p>
          </div>
          <div className={`${styles.grid} ${servicesInView ? styles.gridVisible : ''}`}>
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
      <section
        ref={ctaRef}
        className={`${styles.ctaBanner} ${ctaInView ? styles.ctaBannerVisible : ''}`}
      >
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
