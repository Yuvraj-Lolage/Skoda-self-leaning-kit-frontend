import { useEffect, useState } from "react";
import type { Module } from "../../../types/Module";
import type { Submodule } from "../../../types/SubModule";
import SubmoduleList from "./submodule_list";
import SubmoduleForm from "./submodule_forms";
import axiosInstance from "../../../API/axios_instance";
import { getToken } from "../../../helper/auth_token";

const SubmoduleManager = () => {
  const [token, setToken] = useState(() => getToken() || "");
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [submodules, setSubmodules] = useState<Submodule[]>([]);

  const fetchModules = async () => {
    await axiosInstance.get(`/module/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response)=>{
      setModules(response.data);
      if (response.data.length > 0) {
        setSelectedModule(response.data[0].module_id);
      }
    })
    .catch((error)=>{
      console.error("Error fetching modules:", error);
    });
  };

  const fetchSubmodules = async (moduleId: number) => {
    await axiosInstance.get(`/submodule/by/module/${ selectedModule }`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response)=>{
      setSubmodules(response.data); 
    })
    .catch((error)=>{
      console.error("Error fetching submodules:", error);
    });
  };

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) fetchSubmodules(selectedModule);
  }, [selectedModule]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Submodules</h1>

      {/* Module Selector */}
      <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 w-full mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Select Module
        </label>
        <select
          className="p-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600"
          value={selectedModule ?? ""}
          onChange={(e) => setSelectedModule(Number(e.target.value))}
        >
          {modules.map((m) => (
            <option key={m.module_id} value={m.module_id}>
              {m.order_index}. {m.module_name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <SubmoduleList submodules={submodules} />

        <SubmoduleForm
          moduleId={selectedModule!}
          submodules={submodules}
          refresh={() => fetchSubmodules(selectedModule!)}
        />
      </div>
    </div>
  );
};

export default SubmoduleManager;
