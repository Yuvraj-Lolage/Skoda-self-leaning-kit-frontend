import { useEffect, useState } from 'react'
import './App.css'
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './components/login/login';
import Training_info from './components/tranining/training_info';
import Render_layout from './components/render_layout/render_layout';
import { Submodule } from './components/sub_module/sub_module';
import { Assessment } from './components/Assessment/assessment';
import ModuleManager from './components/super_admin/add_module/module_manager';
import { Helmet } from 'react-helmet';
import SubmoduleManager from './components/super_admin/add_submodule/submodule_manager';
function App() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  return (
    <>
      <Helmet>
        <title>Škoda Auto | SLK</title>
      </Helmet>
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
          path="/add-module"
          element={token ? <ModuleManager /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-submodule"
          element={token ? <SubmoduleManager /> : <Navigate to="/login" />}
        />
        <Route
          path="/module/:module_id/submodule/:sub_id"
          element={token ? <Submodule onBackClick={() => { }} /> : <Navigate to="/login" />}
        />
        <Route
          path="/module/:module_id/assessment/:assessment_id"
          element={token ? <Assessment /> : <Navigate to="/login" />}
        />
      </Routes>

    </>
  )
}

export default App
