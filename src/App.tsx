import { useState } from 'react'
import './App.css'
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './components/login/login';
import Dashboard from './components/render_layout/render_layout';
import Training_info from './components/tranining/training_info';
import Sidebar from './components/ui/navigation_bar/sidebar';
import Render_layout from './components/render_layout/render_layout';

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
          element={token ? <Render_layout /> : <Navigate to="/login" />}
        />
        <Route
          path="/training"
          element={token ? <Training_info /> : <Navigate to="/login" />}
        />
      </Routes>

    </>
  )
}

export default App
