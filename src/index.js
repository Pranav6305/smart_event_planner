// src/index.js (MAKE SURE THIS FILE CONTAINS THE AuthContextProvider wrapper)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App';
import { AuthContextProvider } from './context/AuthContext'; // <-- Must be imported

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider> 
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);