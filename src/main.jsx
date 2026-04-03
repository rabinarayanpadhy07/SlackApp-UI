import './index.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { initializeClientMonitoring, reportClientError } from './lib/monitoring';

initializeClientMonitoring();

globalThis.addEventListener?.('error', (event) => {
  reportClientError(event.error || new Error(event.message), {
    source: 'window.error'
  });
});

globalThis.addEventListener?.('unhandledrejection', (event) => {
  reportClientError(event.reason || new Error('Unhandled promise rejection'), {
    source: 'window.unhandledrejection'
  });
});

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
