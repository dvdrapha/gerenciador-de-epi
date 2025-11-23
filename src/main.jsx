import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { ToastContainer } from './components/feedback/ToastContainer.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <ToastProvider>
              <App />
              <ToastContainer />
            </ToastProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
