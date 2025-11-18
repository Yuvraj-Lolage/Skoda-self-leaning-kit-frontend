import React, { useEffect, useState } from "react";
import Sidebar from "../ui/navigation_bar/sidebar";
import Training_info from "../tranining/training_info";
import Dashboard from "../dashboard/dashboard";
import DashboardHeader from "../ui/dashboard_header/dashboard_header";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { getTokenData } from "../../helper/auth_token";
import WelcomeScreen from "../ui/welcome_screen/welcome_screen";

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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWelcome, setShowWelcome] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? storedToken : null;
  });
  const [tokenData, setTokenData] = useState<any | null>(null);
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
    if (token) {
      setTokenData(getTokenData());
    }
  }, [])

  useEffect(() => {
    if (tokenData && tokenData.first_visit_welcome == 0) {
      setShowWelcomeModal(true);
    }
    else {
      console.warn(`Already displayed welcome message`);
    }

  }, [tokenData]);
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "training":
        return <Training_info />;
      case "chats":
        return <h2 className="text-xl">💬 Chats Content</h2>;
      case "grades":
        return <h2 className="text-xl">🎓 Grades Content</h2>;
      case "settings":
        return <h2 className="text-xl">⚙️ Settings Content</h2>;
      default:
        return <h2 className="text-xl">Welcome!</h2>;
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
