import { useState, useMemo } from 'react';
import services, { categories } from '../data/services';
import ServiceCard from '../components/shared/ServiceCard';
import EmptyState from '../components/shared/EmptyState';
import styles from './Services.module.css';

const allCategory = { id: 'all', label: 'Todos' };

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ─── Header ─── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Nuestros Servicios</h1>
          <p className={styles.subtitle}>
            Descubrí todos nuestros tratamientos diseñados para tu bienestar.
          </p>
        </div>

        {/* ─── Category Tabs ─── */}
        <div className={styles.tabsWrapper} role="tablist" aria-label="Categorías de servicios">
          {[allCategory, ...categories].map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`${styles.tab} ${activeCategory === cat.id ? styles.tabActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ─── Services Grid ─── */}
        {filteredServices.length > 0 ? (
          <div className={styles.grid}>
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="○"
            title="No hay servicios disponibles"
            description="No encontramos servicios en esta categoría. Probá con otra categoría."
            actionLabel="Ver todos"
            onAction={() => setActiveCategory('all')}
          />
        )}
      </div>
    </div>
  );
}
