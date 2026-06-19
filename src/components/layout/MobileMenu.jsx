import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MobileMenu.module.css';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/services', label: 'Servicios' },
  { to: '/staff', label: 'Profesionales' },
  { to: '/gallery', label: 'Galería' },
  { to: '/contact', label: 'Contacto' },
];

export default function MobileMenu({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}
        aria-label="Menú de navegación"
        aria-hidden={!isOpen}
      >
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>Menú</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar menú">
            ✕
          </button>
        </div>
        <div className={styles.navWrapper}>
          <ul className={styles.mobileNav}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                  }
                  onClick={onClose}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/booking"
                className={`${styles.mobileLink} ${styles.mobileCta}`}
                onClick={onClose}
              >
                Reservar Cita
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
