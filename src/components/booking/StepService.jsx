import { useState } from 'react';
import { useBooking, useBookingDispatch } from './BookingContext';
import servicesData, { categories } from '../../data/services';
import ServiceCard from '../shared/ServiceCard';
import styles from './StepService.module.css';

export default function StepService() {
  const [activeCategory, setActiveCategory] = useState('all');
  const state = useBooking();
  const dispatch = useBookingDispatch();

  const filtered =
    activeCategory === 'all'
      ? servicesData
      : servicesData.filter((s) => s.category === activeCategory);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs} role="tablist" aria-label="Categorías de servicios">
        <button
          type="button"
          role="tab"
          className={`${styles.tab} ${activeCategory === 'all' ? styles.tabActive : ''}`}
          onClick={() => setActiveCategory('all')}
          aria-selected={activeCategory === 'all'}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            className={`${styles.tab} ${activeCategory === cat.id ? styles.tabActive : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            aria-selected={activeCategory === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((service) => {
          const isSelected = state.serviceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              className={`${styles.cardBtn} ${isSelected ? styles.selected : ''}`}
              onClick={() => dispatch({ type: 'SET_SERVICE', serviceId: service.id })}
            >
              <ServiceCard service={service} />
              {isSelected && (
                <span className={styles.checkmark} aria-label="Seleccionado">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className={styles.empty}>
          No hay servicios disponibles en esta categoría.
        </p>
      )}
    </div>
  );
}
