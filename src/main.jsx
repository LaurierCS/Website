import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@scripts/firebase';
import ReactDOM from 'react-dom/client';
import './main.css';
import Router from '@utils/Router';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router />
    </React.StrictMode>
);
