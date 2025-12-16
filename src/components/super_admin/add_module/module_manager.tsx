import { useEffect, useState } from "react";
import type { Module } from "../../../types/Module";
// import { getModules } from "../../api/modules";
import ModuleList from "./module_list";
import ModuleForm from "./module_form";
import axiosInstance from "../../../API/axios_instance";

const ModuleManager = () => {
  const [modules, setModules] = useState<Module[]>([]);

  const fetchModules = async () => {
    axiosInstance.get("/module/all",{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then((response) => {
      setModules(
        response.data.sort((a: Module, b: Module) => a.order_index - b.order_index)
      );
    })
    .catch((error) => {
      console.error("Error fetching modules:", error);
    });
    // const data = await getModules();
    // setModules(data.sort((a, b) => a.order_index - b.order_index));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Modules</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT: MODULE LIST */}
        <ModuleList modules={modules} />

        {/* RIGHT: ADD MODULE FORM */}
        <ModuleForm modules={modules} refresh={fetchModules} />
      </div>
    </div>
  );
};

export default ModuleManager;
