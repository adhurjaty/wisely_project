const API_PREFIX = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000'
    : '/api';

export const API_RESERVATION = (id: string) => `${API_PREFIX}/reservations/${id}`;
export const API_RESERVATIONS = `${API_PREFIX}/reservations`;
export const API_GET_RESERVATIONS = (day: string) => `${API_PREFIX}/reservations?day=${day}`;
export const API_INVENTORIES = `${API_PREFIX}/inventories`;
export const API_DAY_INVENTORIES = (day: string) => `${API_PREFIX}/inventories?day=${day}`;