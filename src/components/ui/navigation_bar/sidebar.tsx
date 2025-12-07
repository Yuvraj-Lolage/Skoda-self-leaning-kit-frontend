import { 
  LayoutDashboard, 
  BookOpen, 
  MessageCircle, 
  GraduationCap, 
  Settings,
  FolderPlus,
  FilePlus,
  ClipboardList,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navigationItems = [
    { icon: LayoutDashboard, label: "dashboard", id:"sidebar-dashboard" },
    { icon: BookOpen, label: "training" ,id:"sidebar-modules"},
    { icon: MessageCircle, label: "chats",id:"sidebar-profile" },
    { icon: GraduationCap, label: "grades",id:"sidebar-grades" },
    { icon: Settings, label: "settings" ,id:"sidebar-settings"},
  ];

  const adminItems = [
    { icon: FolderPlus, label: "Add Module", active: false },
    { icon: FilePlus, label: "Add SubModule", active: false },
    { icon: ClipboardList, label: "Add Quiz", active: false },
    { icon: BarChart3, label: "View Progress", active: false },
  ];

  return (
    <div className="w-64 text-white flex flex-col bg-[#1b1b1b] h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="py-6 px-3 border-b border-white/10">
        <h2 className="text-center text-4xl font-medium">Academyis</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.label;

            return (
              <li key={item.label} id={item.id}>
                <button
                  onClick={() => setActiveTab(item.label)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
                    active
                      ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      active ? "text-white" : "text-gray-400"
                    }`}
                  />
                  <span className="capitalize">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {/* Admin Section */}
        <div className="mb-2 px-4 text-xs text-gray-500 uppercase tracking-wider">
          Administration
        </div>
        <ul className="space-y-2">
          {adminItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <a
                  href="#"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    // Admin click handlers can be added here
                  }}
                  onMouseEnter={(e) => {
                    if (!item.active) {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
