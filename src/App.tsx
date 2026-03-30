import { useState, useEffect } from 'react'
import './App.css'
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { LoginPage } from './components/login/login';
import Training_info from './components/tranining/training_info';
import Render_layout from './components/render_layout/render_layout';
import { Submodule } from './components/sub_module/sub_module';
import ModuleManager from './components/super_admin/add_module/module_manager';
import { Helmet } from 'react-helmet';
import SubmoduleManager from './components/super_admin/add_submodule/submodule_manager';
import Assessment from './components/Assessment/assesment';
import { AdminProgressPage } from './components/super_admin/view_progress/admin_progress';
import CreateQuiz from './components/super_admin/create_quiz';
import AdminDashboard from './components/super_admin/admin_dashboard/admin_dashboard';


import { TourProvider } from "./context/tour_context";
import IndividualViewProgress from './components/Individual_view_progress/individual_view_progress';
import ManageAssessments from './components/super_admin/add_quiz/create_quiz';
import { SignupPage } from './components/signup/signup';
import Help from './components/Help/help';

function App() {
  const navigate = useNavigate();
  // keep navigate referenced to avoid "declared but its value is never read" while header logout relies on it
  useEffect(() => { void navigate; }, [navigate]);

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });

  return (
    <>
      <TourProvider>
        <Helmet>
          <title>Škoda Auto | SLK</title>
        </Helmet>
        <Toaster />
        <Routes>
          <Route
            path="/login"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/dashboard" />
                : <LoginPage />
            }
          />
          <Route
            path="/signup"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/dashboard" />
                : <SignupPage />
            }
          />

          <Route
            path="/"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/dashboard" />
                : <LoginPage />
            }
          />

          <Route
            path="/dashboard"
            element={
              localStorage.getItem("token")
                ? <Render_layout />
                : <Navigate to="/login" />
            }
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
            path="/add-assessment"
            element={token ? <ManageAssessments /> : <Navigate to="/login" />}
          />
          <Route
            path="/module/:module_id/submodule/:sub_id"
            element={token ? <Submodule onBackClick={() => { }} /> : <Navigate to="/login" />}
          />
          <Route
            path="/module/:module_id/assessment/:assessment_id"
            element={token ? <Assessment onLogout={() => setToken('null')} /> : <Navigate to="/login" />}
          />

          <Route
            path="/admin/view-progress"
            element={token ? <AdminProgressPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/admin/create-quiz"
            element={token ? <CreateQuiz modules={[]} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/dashboard"
            element={token ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/user/view-progress"
            element={token ? <IndividualViewProgress /> : <Navigate to="/login" />}
          />

          <Route
            path="/help"
            element={token ? <Help /> : <Navigate to="/login" />}
          />
        </Routes>
      </TourProvider>
    </>
  )
}

export default App
