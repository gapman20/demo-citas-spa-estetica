import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <div className={styles.brand}>Serenity Spa</div>
          <p className={styles.description}>
            Tu centro de estética y bienestar. Cuidamos de ti con tratamientos
            personalizados y los mejores profesionales.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Instagram">IG</a>
            <a href="#" className={styles.socialLink} aria-label="Facebook">FB</a>
            <a href="#" className={styles.socialLink} aria-label="WhatsApp">WA</a>
          </div>
        </div>

        <div>
          <h3 className={styles.columnTitle}>Servicios</h3>
          <ul className={styles.links}>
            <li><Link to="/services" className={styles.link}>Faciales</Link></li>
            <li><Link to="/services" className={styles.link}>Masajes</Link></li>
            <li><Link to="/services" className={styles.link}>Depilación</Link></li>
            <li><Link to="/services" className={styles.link}>Manicura</Link></li>
          </ul>
        </div>

        <div>
          <h3 className={styles.columnTitle}>Contacto</h3>
          <ul className={styles.links}>
            <li><Link to="/contact" className={styles.link}>Dirección</Link></li>
            <li><Link to="/contact" className={styles.link}>Teléfono</Link></li>
            <li><Link to="/contact" className={styles.link}>Email</Link></li>
            <li><Link to="/booking" className={styles.link}>Reservar Cita</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          &copy; {year} Serenity Spa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
