const API_PREFIX = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000'
    : '/api';

export const API_RESERVATION = (id: string) => `${API_PREFIX}/reservations/${id}`;
export const API_RESERVATIONS = (day: string) => `${API_PREFIX}/reservations?day=${day}`