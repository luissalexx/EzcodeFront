import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { EzcodeApp } from './EzcodeApp'
import './styles.css';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <EzcodeApp />
    </BrowserRouter>
  </React.StrictMode>,
)
