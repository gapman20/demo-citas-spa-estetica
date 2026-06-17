import { useState, useMemo, useCallback } from 'react';
import gallery from '../data/gallery';
import GalleryImage from '../components/shared/GalleryImage';
import Lightbox from '../components/shared/Lightbox';
import EmptyState from '../components/shared/EmptyState';
import styles from './Gallery.module.css';

const galleryCategories = [
  { id: 'all', label: 'Todas' },
  { id: 'facilities', label: 'Instalaciones' },
  { id: 'treatments', label: 'Tratamientos' },
  { id: 'staff', label: 'Equipo' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return gallery;
    return gallery.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleSelect = useCallback((item) => {
    const index = filteredItems.findIndex((i) => i.id === item.id);
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, [filteredItems]);

  const handleClose = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleNavigate = useCallback(
    (direction) => {
      setCurrentIndex((prev) => {
        if (direction === 'next') {
          return (prev + 1) % filteredItems.length;
        }
        return (prev - 1 + filteredItems.length) % filteredItems.length;
      });
    },
    [filteredItems.length]
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ─── Header ─── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Galería</h1>
          <p className={styles.subtitle}>
            Conocé nuestras instalaciones, tratamientos y el equipo que hace
            posible Serenity Spa.
          </p>
        </div>

        {/* ─── Category Filters ─── */}
        <div
          className={styles.filters}
          role="tablist"
          aria-label="Filtrar por categoría"
        >
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ─── Grid ─── */}
        {filteredItems.length > 0 ? (
          <div className={styles.grid}>
            {filteredItems.map((item) => (
              <GalleryImage
                key={item.id}
                item={item}
                onSelect={handleSelect}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="○"
            title="No hay imágenes en esta categoría"
            description="No encontramos imágenes en esta categoría. Probá con otra."
            actionLabel="Ver todas"
            onAction={() => setActiveCategory('all')}
          />
        )}
      </div>

      {/* ─── Lightbox ─── */}
      {lightboxOpen && (
        <Lightbox
          items={filteredItems}
          currentIndex={currentIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
