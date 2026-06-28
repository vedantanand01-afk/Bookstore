import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bookstore-1-6inp.onrender.com'
axios.defaults.baseURL = API_BASE_URL
axios.defaults.withCredentials = true
axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('http://localhost:5555')) {
    config.url = config.url.replace('http://localhost:5555', '')
  }
  return config
})

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)