import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App'; // Corrected import statement
import reportWebVitals from './reportWebVitals';
import Navbar from './components/Navbar'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <App />
  </React.StrictMode>
);

reportWebVitals();
