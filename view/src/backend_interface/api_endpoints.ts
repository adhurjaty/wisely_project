const API_PREFIX = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000'
    : '/api';

export const API_RESERVATION = `${API_PREFIX}/reservation`;