import React, { useEffect, useState } from "react";
import Sidebar from "../ui/navigation_bar/sidebar";
import Training_info from "../tranining/training_info";
import Dashboard from "../dashboard/dashboard";
import DashboardHeader from "../ui/dashboard_header/dashboard_header";
import { Helmet } from "react-helmet";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { getTokenData } from "../../helper/auth_token";
import WelcomeScreen from "../ui/welcome_screen/welcome_screen";
import ModuleManager from "../super_admin/add_module/module_manager";
import SubmoduleManager from "../super_admin/add_submodule/submodule_manager";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminProgressPage } from "../super_admin/view_progress/admin_progress";
import AdminDashboard from "../super_admin/admin_dashboard/admin_dashboard";


// Simple WelcomeModal component definition
type WelcomeModalProps = {
  onStartTour: () => void;
  onSkip: () => void;
};

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartTour, onSkip }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
      <p className="mb-6">Would you like a quick tour of the dashboard?</p>
      <div className="flex justify-center gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onStartTour}
        >
          Start Tour
        </button>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          onClick={onSkip}
        >
          Skip
        </button>
      </div>
    </div>
  </div>
);

const Render_layout: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWelcome, setShowWelcome] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? storedToken : null;
  });
  const [tokenData, setTokenData] = useState<any | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#sidebar-dashboard",
          popover: {
            title: "Dashboard",
            description: "This is where you see your overall progress.",
            popoverClass: "custom-popover", // 👈 custom class
          }
        },
        {
          element: "#sidebar-modules",
          popover: {
            title: "Modules",
            description: "Here you’ll find all training modules.",
            popoverClass: "custom-popover"
          }
        },
        {
          element: "#sidebar-profile",
          popover: {
            title: "Profile",
            description: "Update your personal information here.",
            popoverClass: "custom-popover"
          }
        }
      ]
    });

    driverObj.drive();
  };

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("add-module")) setActiveTab("add-module");
    else if (path.includes("add-submodule")) setActiveTab("add-submodule");
    else if (path.includes("view-progress")) setActiveTab("view-progress");
    else setActiveTab("dashboard");
  }, [location.pathname]);


  const fetchTokenData = async () => {
    try {
      const data = await getTokenData();

      if (!data) return;

      setTokenData(data);
      setCurrentUserRole(data.role);
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
          return <CenterLoader/>; // or loader
        }
        if (currentUserRole === "Admin") {
          return <AdminDashboard />
        }
        else {
          return <Dashboard />;
        }

      case "training":
        // return <Training_info />;
        navigate("/training");
        break;

      case "settings":
        return <h2 className="text-xl">⚙️ Settings Content</h2>;

      case "add-module":
        return <ModuleManager />;

      case "add-submodule":
        return <SubmoduleManager />;

      case "view-progress":
        return (
          <AdminProgressPage
            onBackClick={() => navigate("/")}
          />
        );
      default:
        return <Dashboard />;
    }
  };


  const handleCloseWelcome = async () => {
    try {
      setShowWelcomeModal(false);
      if (tokenData && tokenData.first_visit_driver == 0) {
        startTour();
      }
      else {
        console.warn(`Already visited Driver Tour`);
      }
      // Update the tokenData to reflect that the welcome has been shown
    } catch (err) {
      console.error("Error updating welcome flag:", err);
    }
  };


  return (
    <>
      <Helmet>
        <title>Škoda Auto | SLK</title>
      </Helmet>
      {showWelcomeModal &&

        <WelcomeScreen
          onClose={handleCloseWelcome}
          styleType="white"   // "white" | "glass" | "gradient"
        />
      }
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-64">
          {/* Header */}
          <DashboardHeader
            activeTab={activeTab}
            onLogout={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          />

          {/* Page Content */}
          <main className="flex-1 p-4">{renderContent()}</main>
        </div>
      </div>
    </>
  );
};

export default Render_layout;
