import { useState, useEffect } from 'react';
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

  async function fetchAvailabilityData(dateStrValue, staffIdValue) {
    if (!dateStrValue) return null;

    const cached = availabilityCache.get(dateStrValue);
    if (cached) return cached;

    const data = await apiRequest('check-availability', {
      date: dateStrValue,
      staffId: staffIdValue ?? undefined,
    });
    const result = {
      available: data.available || [],
      booked: data.booked || [],
    };
    availabilityCache.set(dateStrValue, result);
    return result;
  }

  function applyResult(result) {
    if (result === null) {
      setAvailable([]);
      setBooked([]);
    } else {
      setAvailable(result.available);
      setBooked(result.booked);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchAvailabilityData(dateStr, staffId)
      .then((result) => {
        if (!cancelled && result) applyResult(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Error al obtener disponibilidad.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [dateStr, staffId]);

  return {
    available,
    booked,
    isLoading,
    error,
    retry: () => {
      availabilityCache.delete(dateStr);
      setIsLoading(true);
      setError(null);
      fetchAvailabilityData(dateStr, staffId)
        .then((result) => { if (result) applyResult(result); })
        .catch((err) => setError(err.message || 'Error al obtener disponibilidad.'))
        .finally(() => setIsLoading(false));
    },
  };
}
