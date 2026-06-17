import { useState } from 'react';
import styles from './GalleryImage.module.css';

export default function GalleryImage({ item, onSelect, isSelected }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`${styles.wrapper} ${isSelected ? styles.selected : ''}`}>
        <div className={styles.placeholder} role="img" aria-label={item.alt}>
          <span className={styles.placeholderIcon} aria-hidden="true">🖼</span>
          <span className={styles.placeholderText}>{item.alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${isSelected ? styles.selected : ''}`}>
      <button
        className={styles.button}
        onClick={() => onSelect?.(item)}
        type="button"
        aria-label={`Ver imagen: ${item.alt}`}
      >
        <img
          src={item.src}
          alt={item.alt}
          className={styles.image}
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {item.caption && (
          <span className={styles.caption}>{item.caption}</span>
        )}
      </button>
    </div>
  );
}
