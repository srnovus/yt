/**
 * Copyright (c) 2023 YouTube Music Downloader
 * Licensed under the AGPL-3.0 License
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerServiceWorker } from './registerServiceWorker';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker(); 