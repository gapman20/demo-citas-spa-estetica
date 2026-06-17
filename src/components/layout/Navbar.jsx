import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/services', label: 'Servicios' },
  { to: '/staff', label: 'Profesionales' },
  { to: '/gallery', label: 'Galería' },
  { to: '/contact', label: 'Contacto' },
];

export default function Navbar({ onItemClick }) {
  return (
    <ul className={styles.nav}>
      {links.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
            onClick={onItemClick}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
      <li>
        <NavLink
          to="/booking"
          className={`${styles.link} ${styles.ctaLink}`}
          onClick={onItemClick}
        >
          Reservar Cita
        </NavLink>
      </li>
    </ul>
  );
}
