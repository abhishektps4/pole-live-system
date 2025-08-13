import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './store/pollSlice';
import uiReducer from './store/uiSlice';

const store = configureStore({
  reducer: { poll: pollReducer, ui: uiReducer }
});

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
