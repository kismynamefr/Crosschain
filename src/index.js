import React from "react";
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
} from "react-router-dom";
import App from './App';
import Navbar from './components/navbar';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <BrowserRouter>
    <SnackbarProvider maxSnack={3}>
      <Navbar />
      <App />
    </SnackbarProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
