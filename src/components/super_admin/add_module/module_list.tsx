// import type { Module } from "../../../types/Module";
// import { Trash2 } from "lucide-react";
// import { ToastHelper } from "../../ui/toast_helper/toast";
// import axiosInstance from "../../../API/axios_instance";


// interface Props {
//   modules: Module[];
// }

// const ModuleList = ({ modules }: Props) => {

//   const token = localStorage.getItem("token") || "";

//   const handleDeleteModule = async (moduleId: any) => {
//     try {
//       const isConfirmed = window.confirm(
//         "Are you sure you want to delete this module?"
//       );

//       if (!isConfirmed) return;

//       console.log("Deleting module with module_id:", moduleId);

//       // 🔹 Axios DELETE call
//       const response = await axiosInstance.delete(`/module/delete/${moduleId}`, {
//         data: { module_id: moduleId },
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // 🔹 Success handling
//       ToastHelper.success(
//         response?.data?.message || "Module deleted successfully!"
//       );

//       // 🔹 Refresh modules (BEST approach)
//       // await fetchModules();

//     } catch (error: any) {
//       console.error("Delete error:", error);

//       ToastHelper.error(
//         error?.response?.data?.error || "Failed to delete module."
//       );
//     }
//   };


//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">Module List</h2>

//       <div className="space-y-3">
//         {modules.map((m) => (
//           <div
//             key={m.module_id}
//             className="p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start"
//           >
//             <div>
//               <h3 className="font-semibold text-gray-800">
//                 {m.order_index}. {m.module_name}
//               </h3>
//               <p className="text-sm text-gray-500">
//                 {m.module_description}
//               </p>
//             </div>

//             {/* Delete icon */}
//             <button
//               onClick={() => handleDeleteModule(m.module_id)}
//               className="text-red-500 hover:text-red-700 transition"
//               title="Delete module"
//             >
//               <Trash2 size={18} />
//             </button>
//           </div>
//         ))}

//       </div>

//       {modules.length === 0 && (
//         <p className="text-gray-500 mt-3">No modules added yet.</p>
//       )}
//     </div>
//   );
// };

// export default ModuleList;

import { useState } from "react";
import type { Module } from "../../../types/Module";
import { Trash2 } from "lucide-react";
import { ToastHelper } from "../../ui/toast_helper/toast";
import axiosInstance from "../../../API/axios_instance";

interface Props {
  modules: Module[];
  fetchModules: () => Promise<void>; // 🔥 important
}

const ModuleList = ({ modules, fetchModules }: Props) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const token = localStorage.getItem("token") || "";

  const handleDeleteModule = async (moduleId: number) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this module?"
      );

      if (!isConfirmed) return;

      setDeletingId(moduleId);

      const response = await axiosInstance.delete(
        `/module/delete/${moduleId}`,
        {
          data: { module_id: moduleId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      ToastHelper.success(
        response?.data?.message || "Module deleted successfully!"
      );

      // 🔥 Refresh list from backend
      await fetchModules();

    } catch (error: any) {
      console.error("Delete error:", error);

      ToastHelper.error(
        error?.response?.data?.error || "Failed to delete module."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Module List
      </h2>

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

            {/* Delete button */}
            <button
              onClick={() => handleDeleteModule(m.module_id)}
              disabled={deletingId === m.module_id}
              className={`transition ${
                deletingId === m.module_id
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700"
              }`}
              title="Delete module"
            >
              {deletingId === m.module_id ? (
                <span className="text-sm">Deleting...</span>
              ) : (
                <Trash2 size={18} />
              )}
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