import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// @ts-ignore: CSS import has no type declarations
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
