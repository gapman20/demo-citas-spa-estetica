import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext(null);
const BookingDispatchContext = createContext(null);

function createInitialState(overrides = {}) {
  return {
    serviceId: overrides.serviceId ?? null,
    staffId: overrides.staffId ?? null,
    date: null,
    timeSlot: null,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
  };
}

const initialState = createInitialState();

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

export function BookingProvider({ children, initialServiceId, initialStaffId }) {
  const [state, dispatch] = useReducer(
    bookingReducer,
    createInitialState({ serviceId: initialServiceId, staffId: initialStaffId })
  );

  return (
    <BookingContext.Provider value={state}>
      <BookingDispatchContext.Provider value={dispatch}>
        {children}
      </BookingDispatchContext.Provider>
    </BookingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
  const context = useContext(BookingContext);
  if (context === null) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBookingDispatch() {
  const context = useContext(BookingDispatchContext);
  if (context === null) {
    throw new Error('useBookingDispatch must be used within a BookingProvider');
  }
  return context;
}
