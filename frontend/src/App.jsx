import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from './context/AuthContext';
import { ContratoProvider } from "./context/ContratoContext";

import PrivateRoute from './utils/Routes/PrivateRoute';
import LoginRoute from './utils/Routes/LoginRoute';

import LoginPage from './pages/auth/LoginPage';
import Consulta from './pages/dash/Consulta';
import Dashboard from './pages/dash/Dashboard';
import Comercializadoras from './pages/dash/Comercializadoras';
import UVT from './pages/dash/UVT';
import Contribuyentes from './pages/dash/Contribuyentes';

function App() {

  return (
    <>
    <BrowserRouter>
        <AuthProvider>
          <ContratoProvider>
            <Routes>
                  <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
                  <Route path="/comercializadoras" element={<PrivateRoute><Comercializadoras /></PrivateRoute>} />
                  <Route path="/contribuyentes" element={<PrivateRoute><Contribuyentes /></PrivateRoute>} />
                  <Route path="/uvt" element={<PrivateRoute><UVT /></PrivateRoute>} />
                  <Route path="/consulta" element={<PrivateRoute><Consulta /></PrivateRoute>} />
                  <Route path="/login" element={<LoginRoute><LoginPage/></LoginRoute>} />
              </Routes>
          </ContratoProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
