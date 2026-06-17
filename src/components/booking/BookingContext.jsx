import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext(null);
const BookingDispatchContext = createContext(null);

const initialState = {
  serviceId: null,
  staffId: null,
  date: null,
  timeSlot: null,
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  notes: '',
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_SERVICE':
      return { ...state, serviceId: action.serviceId };
    case 'SET_STAFF':
      return { ...state, staffId: action.staffId };
    case 'SET_DATE_TIME':
      return { ...state, date: action.date, timeSlot: action.timeSlot };
    case 'SET_CONTACT':
      return {
        ...state,
        clientName: action.clientName,
        clientPhone: action.clientPhone,
        clientEmail: action.clientEmail,
        notes: action.notes,
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={state}>
      <BookingDispatchContext.Provider value={dispatch}>
        {children}
      </BookingDispatchContext.Provider>
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === null) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

export function useBookingDispatch() {
  const context = useContext(BookingDispatchContext);
  if (context === null) {
    throw new Error('useBookingDispatch must be used within a BookingProvider');
  }
  return context;
}
