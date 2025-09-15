import { useState, useEffect } from "react";
import { CheckCircle, Play, ChevronDown, ChevronUp } from "lucide-react";
import axiosInstance from "../../API/axios_instance";

export default function TrainingModules() {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });
  const [modules, setModules] = useState<any[] | null>(null);
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);

  const loadModules = async () => {
    try {
      const response = await axiosInstance.get("/module");
      if (response.status === 200) {
        console.log(response.data);
        setModules(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadModules();
  }, [token]);

  if (!modules) {
    return <div className="p-6 text-gray-500">Loading modules...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200">
      <div className="p-6">
        {/* Modules Grid */}
        <div className="space-y-4">
          <h4 className="text-base font-medium text-gray-800">
            Training Modules
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {modules.map((module, index) => (
              <div key={module.module_id} className="border rounded-xl">
                {/* Module Header */}
                <div
                  onClick={() =>
                    setOpenModuleId(
                      openModuleId === module.module_id ? null : module.module_id
                    )
                  }
                  className={`group flex items-center justify-between gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    module.completed
                      ? "bg-green-50 hover:bg-green-100 border border-green-200"
                      : module.current
                      ? "bg-gradient-to-r from-pink-50 to-orange-50 hover:from-pink-100 hover:to-orange-100 border border-pink-200 shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  } ${!module.completed && !module.current ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Module Number / Status */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        module.completed
                          ? "bg-green-500 text-white"
                          : module.current
                          ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white group-hover:scale-110"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : module.current ? (
                        <Play className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* Module Content */}
                    <div className="flex-1 min-w-0">
                      <h5
                        className={`font-medium transition-colors ${
                          module.completed
                            ? "text-green-800"
                            : module.current
                            ? "text-pink-800"
                            : "text-gray-700"
                        }`}
                      >
                        {module.name}
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">
                        {module.completed
                          ? "Completed"
                          : module.current
                          ? "In Progress"
                          : "Locked"}
                      </p>
                    </div>
                  </div>

                  {/* Expand/Collapse Icon */}
                  {openModuleId === module.module_id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                {/* Submodules */}
                {openModuleId === module.module_id && module.submodules && (
                  <div className="pl-14 pr-6 pb-4 space-y-3">
                    {module.submodules.map((sub: any) => (
                      <div
                        key={sub.submodule_id}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition"
                      >
                        <div>
                          <h6 className="font-medium text-gray-700">
                            {sub.name}
                          </h6>
                          <p className="text-sm text-gray-500">
                            {sub.description}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {sub.duration} mins
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
