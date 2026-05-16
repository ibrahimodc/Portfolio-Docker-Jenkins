import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/App.css';
import App from './App';

// Point d'entrée de l'application React, où le composant App est rendu dans l'élément HTML avec l'id 'root'.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
