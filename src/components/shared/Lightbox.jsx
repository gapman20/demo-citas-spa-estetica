import { useEffect, useCallback } from 'react';
import styles from './Lightbox.module.css';

export default function Lightbox({ items, currentIndex, onClose, onNavigate }) {
  const current = items[currentIndex];

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'Escape':
          onClose?.();
          break;
        case 'ArrowLeft':
          onNavigate?.('prev');
          break;
        case 'ArrowRight':
          onNavigate?.('next');
          break;
        default:
          break;
      }
    },
    [onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  if (!current) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imágenes"
    >
      {/* ─── Close Button ─── */}
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Cerrar"
        type="button"
      >
        ✕
      </button>

      {/* ─── Previous ─── */}
      {items.length > 1 && (
        <button
          className={`${styles.navBtn} ${styles.navPrev}`}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.('prev');
          }}
          aria-label="Imagen anterior"
          type="button"
        >
          ‹
        </button>
      )}

      {/* ─── Image ─── */}
      <div
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.src}
          alt={current.alt}
          className={styles.image}
        />
        {current.caption && (
          <p className={styles.caption}>{current.caption}</p>
        )}
        <p className={styles.counter}>
          {currentIndex + 1} / {items.length}
        </p>
      </div>

      {/* ─── Next ─── */}
      {items.length > 1 && (
        <button
          className={`${styles.navBtn} ${styles.navNext}`}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.('next');
          }}
          aria-label="Imagen siguiente"
          type="button"
        >
          ›
        </button>
      )}
    </div>
  );
}
