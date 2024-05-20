import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Corrected import statement
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Theme from './themes';
// Polyfills pour Webpack 4
import { Buffer } from 'buffer';

window.Buffer = Buffer;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}

reportWebVitals();




