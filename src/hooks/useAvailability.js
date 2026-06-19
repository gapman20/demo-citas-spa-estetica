import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../lib/api';

// Cache en memoria por sesión: evita refetchear el mismo día
const availabilityCache = new Map();

export default function useAvailability(date, staffId) {
  const [available, setAvailable] = useState([]);
  const [booked, setBooked] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dateStr = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : null;

  const fetchAvailability = useCallback(async () => {
    if (!dateStr) {
      setAvailable([]);
      setBooked([]);
      setIsLoading(false);
      return;
    }

    // Cache hit: devolvemos sin fetch
    const cached = availabilityCache.get(dateStr);
    if (cached) {
      setAvailable(cached.available);
      setBooked(cached.booked);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiRequest('check-availability', {
        date: dateStr,
        staffId: staffId ?? undefined,
      });
      const result = {
        available: data.available || [],
        booked: data.booked || [],
      };
      availabilityCache.set(dateStr, result);
      setAvailable(result.available);
      setBooked(result.booked);
    } catch (err) {
      setError(err.message || 'Error al obtener disponibilidad.');
      setAvailable([]);
      setBooked([]);
    } finally {
      setIsLoading(false);
    }
  }, [dateStr, staffId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return {
    available,
    booked,
    isLoading,
    error,
    retry: () => {
      availabilityCache.delete(dateStr);
      return fetchAvailability();
    },
  };
}
