import { useState, useEffect } from "react";
import { CheckCircle, Play, ChevronDown, ChevronUp, Info } from "lucide-react"; // Added Info icon
import axiosInstance from "../../API/axios_instance";
import { useNavigate } from "react-router-dom";
import { ModuleModal } from "../modules/ModuleModal"; 

export default function TrainingModules() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });
  const [modules, setModules] = useState<any[] | null>(null);
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const loadModules = async () => {
    try {
      const response = await axiosInstance.get("/module/with-submodules/with-status/all?userId=2", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setModules(response.data);
      }
    } catch (error) {
      console.error("Error loading modules:", error);
    }
  };

  useEffect(() => {
    loadModules();
  }, [token]);

  if (!modules) {
    return <div className="p-6 text-gray-500">Loading modules...</div>;
  }

  // --- Modal Toggle Handler ---
  const handleOpenModal = (e: React.MouseEvent, module: any) => {
    e.stopPropagation(); // Prevents expanding the accordion when clicking the button
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const openSubmodule = (module_id: string, subModule_id: string) => {
    navigate(`/module/${module_id}/submodule/${subModule_id}`);
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "in_progress": return "In Progress";
      default: return "Locked";
    }
  };

  const renderStyles = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-50 hover:bg-green-100 border border-green-200";
      case "in_progress": return "bg-gradient-to-r from-pink-50 to-orange-50 hover:from-pink-100 hover:to-orange-100 border border-pink-200 shadow-md";
      default: return "bg-gray-200 text-gray-500 font-medium px-3 py-1 rounded-md";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200">
      <div className="p-6">
        <div className="space-y-4">
          <h4 className="text-base font-medium text-gray-800">Training Modules</h4>
          <div className="grid grid-cols-1 gap-3">
            {modules.map((module, index) => {
              const isCompleted = module.status === "completed";
              const isCurrent = module.status === "in_progress";

              return (
                <div key={module.module_id} className="border rounded-xl">
                  {/* Module Header */}
                  <div
                    onClick={() => setOpenModuleId(openModuleId === module.module_id ? null : module.module_id)}
                    className={`group flex items-center justify-between gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      isCompleted ? "bg-green-50 border-green-200" : 
                      isCurrent ? "bg-gradient-to-r from-pink-50 to-orange-50 border-pink-200 shadow-md" : 
                      "bg-gray-50 border-gray-200"
                    } ${!isCompleted && !isCurrent ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted ? "bg-green-500 text-white" : 
                        isCurrent ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" : 
                        "bg-gray-300 text-gray-600"
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : 
                         isCurrent ? <Play className="w-5 h-5" /> : 
                         <span className="text-sm font-medium">{index + 1}</span>}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className={`font-medium ${isCompleted ? "text-green-800" : isCurrent ? "text-pink-800" : "text-gray-700"}`}>
                          {module.module_name}
                        </h5>
                        <p className="text-sm text-gray-500 mt-1">{renderStatus(module.status)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* NEW: Button to open the ModuleModal */}
                      <button
                        onClick={(e) => handleOpenModal(e, module)}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors text-gray-500 hover:text-blue-600"
                        title="View Module Details"
                      >
                        <Info className="w-5 h-5" />
                      </button>

                      {openModuleId === module.module_id ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                  </div>

                  {/* Submodules List */}
                  {openModuleId === module.module_id && module.submodules && (
                    <div className="relative pl-10 mt-3">
                      <div className="absolute left-9 top-0 bottom-0 w-px bg-gray-300"></div>
                      {module.submodules.map((sub: any) => (
                        <div key={sub.submodule_id} className="relative flex items-start mb-4">
                          <div className="absolute left-0 top-6 flex items-center">
                            <div className="w-8 h-px bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          </div>
                          <div 
                            className={`ml-12 flex-1 rounded-lg p-4 shadow-sm flex justify-between items-center hover:shadow-md transition cursor-pointer ${renderStyles(sub.status)}`}
                            onClick={() => openSubmodule(module.module_id, sub.submodule_id)}
                          >
                            <div>
                              <h6 className="font-medium text-gray-700">{sub.submodule_name}</h6>
                              <p className="text-sm text-gray-500 mt-1">{sub.submodule_description}</p>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              {renderStatus(sub.status)} ⏱ {sub.duration} mins
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- Module Modal Component --- */}
      {selectedModule && (
        <ModuleModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          moduleName={selectedModule.module_name}
          moduleNumber={modules.indexOf(selectedModule) + 1}
          lessonsCount={selectedModule.submodules?.length || 0}
          duration={selectedModule.submodules?.reduce((acc: number, s: any) => acc + (parseInt(s.duration) || 0), 0) + " mins"}
          onStartModule={() => {
            setIsModalOpen(false);
            navigate(`/module/${selectedModule.module_id}`); // Navigates to the blackboard intro page
          }}
        />
      )}
    </div>
  );
}