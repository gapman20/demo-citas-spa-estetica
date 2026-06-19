import styles from './AdminHeader.module.css';

export default function AdminHeader({ onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Panel de Administración</h1>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
