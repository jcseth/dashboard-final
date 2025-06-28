// CÓDIGO NUEVO (React 18)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // O tu componente Dashboard

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);