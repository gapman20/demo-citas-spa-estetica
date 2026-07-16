import { useState, useEffect, useRef, useCallback } from 'react';
import { apiRequest } from '../lib/api';

// In-memory cache with a timestamp so we can expire it
const availabilityCache = new Map(); // key: dateStr → { data, fetchedAt }

const CACHE_TTL_MS = 30_000; // 30 seconds

function isCacheValid(entry) {
  return entry && Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

/** Call this after successfully creating an event to force a fresh fetch */
export function invalidateAvailabilityCache(dateStr) {
  if (dateStr) availabilityCache.delete(dateStr);
}

export default function useAvailability(date, staffId) {
  const [available, setAvailable] = useState([]);
  const [booked, setBooked] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const dateStr = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : null;

  const applyResult = useCallback((result) => {
    if (!result) {
      setAvailable([]);
      setBooked([]);
    } else {
      setAvailable(result.available);
      setBooked(result.booked);
    }
  }, []);

  const fetchData = useCallback(async (dateStrValue, staffIdValue, { silent = false } = {}) => {
    if (!dateStrValue) return null;

    const cached = availabilityCache.get(dateStrValue);
    if (isCacheValid(cached)) return cached.data;

    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await apiRequest('check-availability', {
        date: dateStrValue,
        staffId: staffIdValue ?? undefined,
      });
      const result = {
        available: data.available || [],
        booked: data.booked || [],
      };
      availabilityCache.set(dateStrValue, { data: result, fetchedAt: Date.now() });
      return result;
    } finally {
      if (!silent) setIsLoading(false);
      else setIsRefreshing(false);
    }
  }, []);

  // Initial load + polling every 30s
  useEffect(() => {
    if (!dateStr) return;

    let cancelled = false;

    const run = async (silent = false) => {
      try {
        setError(null);
        const result = await fetchData(dateStr, staffId, { silent });
        if (!cancelled && result) applyResult(result);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Error al obtener disponibilidad.');
      }
    };

    run(false); // first load: show spinner

    const interval = setInterval(() => {
      // Expire the cache so next fetch always goes to the network
      availabilityCache.delete(dateStr);
      run(true); // background refresh: no spinner, just updates quietly
    }, CACHE_TTL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [dateStr, staffId, fetchData, applyResult]);

  const retry = useCallback(() => {
    if (!dateStr) return;
    availabilityCache.delete(dateStr);
    setError(null);
    setIsLoading(true);
    fetchData(dateStr, staffId)
      .then((result) => { if (result) applyResult(result); })
      .catch((err) => setError(err.message || 'Error al obtener disponibilidad.'))
      .finally(() => setIsLoading(false));
  }, [dateStr, staffId, fetchData, applyResult]);

  return { available, booked, isLoading, isRefreshing, error, retry };
}
