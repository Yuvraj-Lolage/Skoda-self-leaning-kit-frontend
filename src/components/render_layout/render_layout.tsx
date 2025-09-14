import React, { useState } from "react";
import Sidebar from "../ui/navigation_bar/sidebar";
import Training_info from "../tranining/training_info";
import Dashboard from "../dashboard/dashboard";

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
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl text-black font-semibold capitalize">
              {activeTab}
            </h2>

            <div className="flex items-center gap-3">
              {/* Avatar / profile actions */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Render_layout;
