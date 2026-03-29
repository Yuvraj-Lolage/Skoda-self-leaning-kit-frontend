import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../ui/navigation_bar/sidebar";
import Dashboard from "../dashboard/dashboard";
import DashboardHeader from "../ui/dashboard_header/dashboard_header";
import { Helmet } from "react-helmet";
import "driver.js/dist/driver.css";
import { getTokenData } from "../../helper/auth_token";
import WelcomeScreen from "../ui/welcome_screen/welcome_screen";
import ModuleManager from "../super_admin/add_module/module_manager";
import SubmoduleManager from "../super_admin/add_submodule/submodule_manager";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { AdminProgressPage } from "../super_admin/view_progress/admin_progress";
import AdminDashboard from "../super_admin/admin_dashboard/admin_dashboard";
import axiosInstance from "../../API/axios_instance";
import { ToastHelper } from "../ui/toast_helper/toast";
import ManageAssessments from "../super_admin/add_quiz/create_quiz";
import Help from "../Help/help";
import AddUser from "../super_admin/add_user/add_user";
import IndividualViewProgress from "../Individual_view_progress/individual_view_progress";
import TrainingModules from "../tranining/training_info";


function isAdminDashboardRole(role: string | null) {
  if (!role) return false;
  const r = String(role).toLowerCase().replace(/\s+/g, "_");
  return r === "admin" || r === "super_admin";
}

const Render_layout: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const token = localStorage.getItem("token");
  const [tokenData, setTokenData] = useState<any | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [startTour, setStartTour] = useState(false);


  useEffect(() => {
    const path = location.pathname;

    if (path.includes("add-module")) setActiveTab("add-module");
    else if (path.includes("add-submodule")) setActiveTab("add-submodule");
    else if (path.includes("view-progress")) setActiveTab("view-progress");
    else setActiveTab("dashboard");
  }, [location.pathname]);



  const fetchTokenData = async () => {
    try {
      // 1️⃣ Read from localStorage first
      const localData = localStorage.getItem("tokenData");

      if (localData) {
        const parsed = JSON.parse(localData);
        setTokenData(parsed);
        setCurrentUserRole(parsed.role);
        return;
      }

      // 2️⃣ Fallback to JWT (first login / cleared storage)
      const jwtData = getTokenData();
      if (!jwtData) return;

      setTokenData(jwtData);
      setCurrentUserRole(jwtData.role);

      // 3️⃣ Persist initial token data
      localStorage.setItem("tokenData", JSON.stringify(jwtData));

    } catch (err) {
      console.error("Error fetching token data:", err);
    }
  };



  useEffect(() => {
    fetchTokenData();
  }, []);



  useEffect(() => {
    if (!tokenData) return;

    if (tokenData.first_visit_welcome === 0) {
      setShowWelcomeModal(true);
    }
  }, [tokenData]);


  const CenterLoader = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="h-10 w-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  };


  const renderContent = () => {
    switch (activeTab) {

      case "dashboard":
        if (!currentUserRole) {
          return <CenterLoader />;
        }

        return isAdminDashboardRole(currentUserRole)
          ? <AdminDashboard />
          : <Dashboard />;

      case "training":
        return <TrainingModules />;

      case "settings":
        return <h2 className="text-xl">⚙️ Settings Content</h2>;

      case "add-module":
        return <ModuleManager />;

      case "add-submodule":
        return <SubmoduleManager />;

      case "add-quiz":
        return <ManageAssessments />;

      // case "view-progress":
      //   if (!currentUserRole) {
      //     return <CenterLoader />;
      //   }

      //   if (isAdminDashboardRole(currentUserRole)) {
      //     return (
      //       <AdminProgressPage
      //         onBackClick={() => navigate("", { replace: true })}
      //       />
      //     );
      //   }

      //   return <Navigate to="/user/view-progress" replace />;

      case "View Progress":
        return <IndividualViewProgress onBackClick={() => navigate("", { replace: true })} />;

      case "Admin View Progress":
        return <AdminProgressPage onBackClick={() => navigate("", { replace: true })} />;
      case "Add User":
        return <AddUser />;
      case "help":
        return <Help />;

      default:
        return <Dashboard />;
    }
  };


  const updateWelcomeVisited = async () => {
    try {
      await axiosInstance.put('/user/update-welcome-visit', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (err) {
      console.error("Error updating welcome flag:", err);
    }
  }

  const handleCloseWelcome = async () => {
    try {
      setShowWelcomeModal(false);

      await updateWelcomeVisited();
      ToastHelper.success("Welcome tour completed!");

      setTokenData((prevData: any) => {
        const updated = {
          ...prevData,
          first_visit_welcome: 1
        };

        localStorage.setItem("tokenData", JSON.stringify(updated));
        return updated;
      });

      // // ✅ Reload ONCE after a small delay so toast is visible
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1200);

    } catch (err) {
      console.error("Error updating welcome flag:", err);
    }
  };



  useEffect(() => {
    if (
      tokenData?.first_visit_welcome === 1 &&
      tokenData?.first_visit_driver === 0
    ) {
      console.log("Starting driver tour...");
      // startTour();
    }
  }, [tokenData]);


  // LOGOUT FUNCTION - Clears tokens, resets state, and redirects to login

  const hasLoggedOut = useRef(false);
  const logout = (message?: any, status?: any) => {
    if (hasLoggedOut.current) return; // 🚫 prevent duplicate calls
    hasLoggedOut.current = true;

    // 👉 show toast only once
    if (message && status === "success") {
      ToastHelper.success(message);
    } else if (message && status === "error") {
      ToastHelper.error(message);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("tokenData");
    setTokenData(null);
    setCurrentUserRole(null);

    navigate("/login", { replace: true });
  };


  // useEffect(() => {
  //   if (!token) {
  //     logout();
  //     return;
  //   }

  //   if (isTokenExpired(token)) {
  //     logout();
  //     return;
  //   }
  // }, [token]);

  // useEffect(() => {
  //   if (!token) return;

  //   try {
  //     const payload = JSON.parse(atob(token.split(".")[1]));
  //     const expiryTime = payload.exp * 1000;
  //     const timeout = expiryTime - Date.now();

  //     if (timeout <= 0) {
  //       logout();
  //       return;
  //     }

  //     const timer = setTimeout(() => {
  //       logout();
  //     }, timeout);

  //     return () => clearTimeout(timer);
  //   } catch {
  //     logout();
  //   }
  // }, [token]);

  // useEffect(() => {
  //   if (!token) {
  //     logout("Session expired. Please login again.", "error");
  //     return;
  //   }

  //   if (isTokenExpired(token)) {
  //     logout("Session expired. Please login again.", "error");
  //     return;
  //   }
  // }, [token]);

  // useEffect(() => {
  //   if (!token) return;

  //   try {
  //     const payload = JSON.parse(atob(token.split(".")[1]));
  //     const expiryTime = payload.exp * 1000;
  //     const timeout = expiryTime - Date.now();

  //     if (timeout <= 0) {
  //       logout("Session expired. Please login again.", "error");
  //       return;
  //     }

  //     const timer = setTimeout(() => {
  //       logout("Session expired. Please login again.", "error");
  //     }, timeout);

  //     return () => clearTimeout(timer);
  //   } catch {
  //     logout("Invalid session. Please login again.", "error");
  //   }
  // }, [token]);

  useEffect(() => {
    if (!token) return;

    try {
      // ✅ 1. Immediate expiry check (reuse your function)
      if (isTokenExpired(token)) {
        logout("Session expired. Please login again.", "error");
        return;
      }

      // ✅ 2. Decode once for timer
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();

      const timeout = expiryTime - currentTime;

      const timer = setTimeout(() => {
        logout("Session expired. Please login again.", "error");
      }, timeout);

      return () => clearTimeout(timer);

    } catch {
      logout("Invalid session. Please login again.", "error");
    }
  }, [token]);




  const isTokenExpired = (token: string | null) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now(); // cleaner
    } catch {
      return true;
    }
  };

  return (
    <>
      <Helmet>
        <title>Škoda Auto | SLK</title>
      </Helmet>
      {showWelcomeModal &&

        // <WelcomeScreen
        //   onClose={handleCloseWelcome}
        //   styleType="white"   // "white" | "glass" | "gradient"
        // />
        <WelcomeScreen
          onClose={handleCloseWelcome}
          onStartTour={async () => {
            setShowWelcomeModal(false);
            await updateWelcomeVisited();
            ToastHelper.success("Welcome tour completed!");

            setTokenData((prevData: any) => {
              const updated = {
                ...prevData,
                first_visit_welcome: 1
              };

              localStorage.setItem("tokenData", JSON.stringify(updated));
              return updated;
            });
            setStartTour(true);
          }}
          styleType="white"
        />
      }
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - Hidden during admin progress view */}
        {activeTab !== "view-progress" && (
          <div className="fixed inset-y-0 left-0 w-64">
            {/* <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              startTour={startTour}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col ${activeTab !== "view-progress" ? "ml-64" : ""}`}>
          {/* Header */}
          <DashboardHeader
            activeTab={activeTab}
            onLogout={() => logout("You have been logged out successfully.", "success")}
          />
          {/* Page Content */}
          <main className="flex-1 p-4">{renderContent()}</main>
        </div>
      </div>
    </>
  );
};

export default Render_layout;
