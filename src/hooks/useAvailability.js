import { useState, useEffect, useCallback, useRef } from 'react';

const cache = new Map();

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getBusinessHours(date) {
  const day = date.getDay();
  if (day === 0) return null; // Sunday closed
  if (day === 6) return { open: 10, close: 17 }; // Saturday
  return { open: 9, close: 19 }; // Mon-Fri
}

function generateMockSlots(date, seed) {
  const hours = getBusinessHours(date);
  if (!hours) return { available: [], booked: [] };

  const slots = [];
  const booked = [];

  for (let h = hours.open; h < hours.close; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push(time);
    }
  }

  // Deterministic-ish "random" based on seed + date
  const rng = (salt) => {
    const hash =
      ((seed ?? 0) * 31 + salt * 7 + date.getDate() * 13) % slots.length;
    return Math.abs(hash);
  };

  // Mark about 30% as booked
  const bookedSet = new Set();
  for (let i = 0; i < Math.floor(slots.length * 0.3); i++) {
    bookedSet.add(slots[rng(i)]);
  }

  const available = slots.filter((t) => !bookedSet.has(t));
  booked.push(
    ...slots
      .filter((t) => bookedSet.has(t))
      .map((start) => ({
        start,
        end: incrementTime(start, 30),
        summary: 'Reservado',
      }))
  );

  return { available, booked };
}

function incrementTime(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export default function useAvailability(date, staffId) {
  const [data, setData] = useState({ available: [], booked: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const seedRef = useRef(staffId ?? 0);

  const dateStr = date ? formatDate(date) : null;
  const cacheKey = dateStr ? `${dateStr}-${staffId ?? 'any'}` : null;

  const retry = useCallback(() => {
    if (!cacheKey) return;
    setIsLoading(true);
    setError(null);

    // Simulate network delay
    const timeout = setTimeout(() => {
      try {
        const cached = cache.get(cacheKey);
        if (cached) {
          setData(cached);
        } else {
          const result = generateMockSlots(new Date(dateStr!), seedRef.current);
          cache.set(cacheKey, result);
          setData(result);
        }
        setIsLoading(false);
      } catch {
        setError('Error al obtener disponibilidad.');
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [cacheKey, dateStr]);

  useEffect(() => {
    if (!cacheKey) {
      setData({ available: [], booked: [] });
      setIsLoading(false);
      return;
    }

    const cached = cache.get(cacheKey);
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      try {
        const result = generateMockSlots(new Date(dateStr!), seedRef.current);
        cache.set(cacheKey, result);
        setData(result);
        setIsLoading(false);
      } catch {
        setError('Error al obtener disponibilidad.');
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [cacheKey, dateStr]);

  return {
    available: data.available,
    booked: data.booked,
    isLoading,
    error,
    retry,
  };
}
