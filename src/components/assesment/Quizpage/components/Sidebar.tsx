import React from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  role: string | null;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  role,
  onLogout,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: sidebarOpen ? 250 : 60,
        background: "#000",
        color: "#fff",
        transition: "width 0.3s",
        zIndex: 100,
        paddingTop: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: 24,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        {sidebarOpen ? "⏴" : "⏵"}
      </button>

      {sidebarOpen && (
        <>
          <img
            src={`https://ui-avatars.com/api/?name=${role || "User"}`}
            alt="avatar"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              marginBottom: 20,
            }}
          />

          <h2>ŠKODA Quiz</h2>
          <p style={{ marginBottom: 20 }}>{role?.toUpperCase()}</p>

          <button
            onClick={onLogout}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
