import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('Starting React application mount...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Could not find root element with id 'root'");
  document.body.innerHTML = '<div style="color: red; padding: 20px; font-weight: bold;">Failed to load: Root element not found.</div>';
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React mount triggered successfully');
  } catch (err) {
    console.error('Mount Error:', err);
    rootElement.innerHTML = `<div style="color: red; padding: 20px;">Failed to start application: ${err instanceof Error ? err.message : 'Unknown error'}</div>`;
  }
}
