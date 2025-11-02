import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import axios from 'axios'

// Set axios defaults to include cookies
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContextProvider>
    <SocketContextProvider>
    <App />
    </SocketContextProvider>
  </AuthContextProvider>
  </BrowserRouter>
)