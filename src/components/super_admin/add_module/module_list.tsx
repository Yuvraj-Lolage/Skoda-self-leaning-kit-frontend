import type { Module } from "../../../types/Module";
import { Trash2 } from "lucide-react";
import { ToastHelper } from "../../ui/toast_helper/toast";


interface Props {
  modules: Module[];
}

const ModuleList = ({ modules }: Props) => {


  const handleDeleteModule = (moduleId: any) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this module?"
      );

      if (!isConfirmed) return;

      console.log("Deleting module with module_id:", moduleId);
      ToastHelper.success("Module deleted successfully!");
    } catch (error) {
      console.error(error);
      ToastHelper.error("Failed to delete module. Please try again.");
    }

  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Module List</h2>

      <div className="space-y-3">
        {modules.map((m) => (
          <div
            key={m.module_id}
            className="p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                {m.order_index}. {m.module_name}
              </h3>
              <p className="text-sm text-gray-500">
                {m.module_description}
              </p>
            </div>

            {/* Delete icon */}
            <button
              onClick={() => handleDeleteModule(m.module_id)}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete module"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

      </div>

      {modules.length === 0 && (
        <p className="text-gray-500 mt-3">No modules added yet.</p>
      )}
    </div>
  );
};

export default ModuleList;
