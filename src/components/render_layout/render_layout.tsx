import React, { useState } from "react";
import Sidebar from "../ui/navigation_bar/sidebar";
import Training_info from "../tranining/training_info";
import Dashboard from "../dashboard/dashboard";
import DashboardHeader from "../ui/dashboard_header/dashboard_header";

const Render_layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard/>;
      case "training":
        return <Training_info/>;
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - stays fixed */}
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
  );
};

export default Render_layout;
