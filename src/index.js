import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Navbar from './components/navbar.js'
import { SnackbarProvider, useSnackbar } from 'notistack';

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
    <Navbar />
    <App />
  </SnackbarProvider>,
  document.getElementById('root')
);
