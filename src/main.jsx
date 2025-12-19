import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import '@styles/main.scss';
import App from '@/App.jsx';

// Get the root element from the HTML
const rootElement = document.getElementById('root');

// Create a root and render the App component inside StrictMode
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
