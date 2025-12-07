import { useEffect, useState } from 'react'
import './App.css'
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './components/login/login';
import Training_info from './components/tranining/training_info';
import Render_layout from './components/render_layout/render_layout';
import {Submodule} from './components/sub_module/sub_module';

function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

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
        <Route
          path="/module/:module_id/submodule/:sub_id"
          element={token ? <Submodule onBackClick={() => {}}/> : <Navigate to="/login" />}
        />
      </Routes>

    </>
  )
}

export default App
