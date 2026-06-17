import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

export default function Header({ menuOpen, onToggleMenu, onCloseMenu }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logoIcon} aria-hidden="true">✦</span>
          Serenity Spa
        </Link>

        <div className={styles.right}>
          <nav className={styles.desktopNav}>
            <Navbar />
          </nav>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={onToggleMenu}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={menuOpen} onClose={onCloseMenu} />
    </header>
  );
}
