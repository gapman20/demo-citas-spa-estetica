import { useCallback } from 'react';
import { apiRequest } from '../lib/api';

export default function useCalendarApi() {
  const checkAvailability = useCallback(async (date, staffId) => {
    return apiRequest('check-availability', { date, staffId });
  }, []);

  const createEvent = useCallback(async (eventData) => {
    return apiRequest('create-event', {
      summary: eventData.summary,
      start: eventData.start,
      end: eventData.end,
      description: eventData.description,
    });
  }, []);

  const listEvents = useCallback(async (timeMin, timeMax) => {
    return apiRequest('list-events', { timeMin, timeMax });
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    return apiRequest('delete-event', { eventId });
  }, []);

  return { checkAvailability, createEvent, listEvents, deleteEvent };
}
