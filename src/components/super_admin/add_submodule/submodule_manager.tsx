import { useEffect, useState } from "react";
import { Module } from "../../types/module";
import { Submodule } from "../../types/submodule";
import { getModules } from "../../api/modules";
import { getSubmodules } from "../../api/submodules";
import SubmoduleList from "./SubmoduleList";
import SubmoduleForm from "./SubmoduleForm";

const SubmoduleManager = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [submodules, setSubmodules] = useState<Submodule[]>([]);

  const fetchModules = async () => {
    const data = await getModules();
    const sorted = data.sort((a, b) => a.order_index - b.order_index);
    setModules(sorted);
    if (sorted.length > 0 && !selectedModule) {
      setSelectedModule(sorted[0].module_id);
    }
  };

  const fetchSubmodules = async (moduleId: number) => {
    const data = await getSubmodules(moduleId);
    setSubmodules(data.sort((a, b) => a.order_index - b.order_index));
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
              {m.order_index}. {m.name}
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
