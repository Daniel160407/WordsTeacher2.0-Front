import React from 'react'
import ReactDOM from 'react-dom/client'
import './style/Index.scss';
import AppRouter from './AppRouter.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)
