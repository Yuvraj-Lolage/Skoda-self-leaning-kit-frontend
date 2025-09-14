import { useState } from 'react'
import './App.css'
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './components/login/login';
import Dashboard from './components/dashboard/dashboard';

function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>

    </>
  )
}

export default App
