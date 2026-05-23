import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import { CityProvider } from './hooks/useCity'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <CityProvider>
    <App />
  </CityProvider>
);
