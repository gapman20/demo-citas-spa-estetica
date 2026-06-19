import { useParams, Link } from 'react-router-dom';
import { getStaffBySlug } from '../data/staff';
import services from '../data/services';
import styles from './StaffDetail.module.css';

export default function StaffDetail() {
  const { slug } = useParams();
  const staff = getStaffBySlug(slug);

  if (!staff) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>Profesional no encontrado</h1>
            <p className={styles.notFoundDesc}>
              El profesional que buscás no existe o ha sido eliminado.
            </p>
            <Link to="/staff" className={styles.backLink}>
              &larr; Ver todos los profesionales
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const staffServices = services.filter((s) =>
    staff.services.includes(s.id)
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ─── Breadcrumb ─── */}
        <nav className={styles.breadcrumb} aria-label="Navegación">
          <Link to="/staff" className={styles.breadcrumbLink}>
            Profesionales
          </Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>{staff.name}</span>
        </nav>

        <div className={styles.profile}>
          {/* ─── Photo ─── */}
          <div className={styles.photoWrapper}>
            <img
              src={staff.photo}
              alt={staff.name}
              className={styles.photo}
            />
          </div>

          {/* ─── Info ─── */}
          <div className={styles.info}>
            <h1 className={styles.name}>{staff.name}</h1>
            <p className={styles.title}>{staff.title}</p>
            <p className={styles.specialty}>
              <span className={styles.specialtyLabel}>Especialidad:</span>{' '}
              {staff.specialty}
            </p>
            <p className={styles.bio}>{staff.bio}</p>

            {/* ─── Services ─── */}
            <div className={styles.servicesSection}>
              <h2 className={styles.servicesTitle}>Servicios que ofrece</h2>
              {staffServices.length > 0 ? (
                <ul className={styles.servicesList}>
                  {staffServices.map((service) => (
                    <li key={service.id}>
                      <Link
                        to={`/services/${service.slug}`}
                        className={styles.serviceChip}
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.servicesEmpty}>Próximamente</p>
              )}
            </div>

            {/* ─── CTA ─── */}
            <Link
              to={`/booking?staff=${staff.slug}`}
              className={styles.ctaBtn}
            >
              Agendar con {staff.name.split(' ')[0]}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
