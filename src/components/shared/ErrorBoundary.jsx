import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <span className={styles.icon} aria-hidden="true">!</span>
            <h2 className={styles.title}>Algo salió mal</h2>
            <p className={styles.description}>
              Ocurrió un error inesperado al cargar esta sección.
              {this.props.fallbackMessage && (
                <> {this.props.fallbackMessage}</>
              )}
            </p>
            <button
              type="button"
              className={styles.retryBtn}
              onClick={this.handleRetry}
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
