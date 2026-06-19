import { useState, useCallback } from 'react';
import styles from './LoginForm.module.css';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');

      if (!username.trim() || !password.trim()) {
        setError('Ambos campos son obligatorios.');
        return;
      }

      setIsLoading(true);

      // Simulate async check for consistent UX
      await new Promise((r) => setTimeout(r, 400));

      const success = onLogin(username, password);

      if (!success) {
        setError('Credenciales inválidas');
        setIsLoading(false);
      }
      // If success, the parent handles redirect
    },
    [username, password, onLogin]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !isLoading) {
        handleSubmit(e);
      }
    },
    [handleSubmit, isLoading]
  );

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.card}
        onSubmit={handleSubmit}
        noValidate
        onKeyDown={handleKeyDown}
      >
        <div className={styles.iconWrap}>
          <span className={styles.icon} aria-hidden="true">🛡</span>
        </div>
        <h1 className={styles.title}>Panel de Administración</h1>
        <p className={styles.subtitle}>
          Ingresá tus credenciales para acceder.
        </p>

        <div className={styles.field}>
          <label htmlFor="admin-user" className={styles.label}>
            Usuario
          </label>
          <input
            id="admin-user"
            name="username"
            type="text"
            className={styles.input}
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="admin-pass" className={styles.label}>
            Contraseña
          </label>
          <input
            id="admin-pass"
            name="password"
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}
