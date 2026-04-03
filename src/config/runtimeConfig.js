export const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api/v1';

export const BACKEND_SOCKET_URL =
  import.meta.env.VITE_BACKEND_SOCKET_URL || 'http://localhost:3000';

export const APP_ORIGIN =
  globalThis.location?.origin || 'http://localhost:5173';

export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';

export const APP_ENVIRONMENT =
  import.meta.env.VITE_APP_ENVIRONMENT || import.meta.env.MODE || 'development';
