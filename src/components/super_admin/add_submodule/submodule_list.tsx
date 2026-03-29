import type { Submodule } from "../../../types/SubModule";
import { Trash2 } from "lucide-react";
import { ToastHelper } from "../../ui/toast_helper/toast";
import axiosInstance from "../../../API/axios_instance";

interface SubmoduleListProps {
  submodules: Submodule[];
  fetchSubmodules: (moduleId: number) => void;
  moduleId: number;
}

const SubmoduleList = ({ submodules, fetchSubmodules, moduleId }: SubmoduleListProps) => {

  const handleDeleteSubmodule = async (submoduleId: any) => {
  try {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this submodule?"
    );

    if (!isConfirmed) return;

    console.log("Deleting submodule with submodule_id:", submoduleId);

    // 🔹 API call
    const response = await axiosInstance.delete(
      `/submodule/delete/${submoduleId}`,
      {
        headers: {
          Authorization: `Bearer ${ localStorage.getItem("token") }`,
        },
      }
    );

    // 🔹 Success toast
    ToastHelper.success(
      response?.data?.message || "Submodule deleted successfully!"
    );

    // 🔹 Refresh list (VERY IMPORTANT)
    fetchSubmodules(moduleId);

  } catch (error: any) {
    console.error("Delete submodule error:", error);

    // 🔹 Error toast
    ToastHelper.error(
      error?.response?.data?.message || "Failed to delete submodule."
    );
  }
};

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Submodule List
      </h2>

      <div className="space-y-3">
        {submodules.map((s) => (
  <div
    key={s.submodule_id}
    className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start"
  >
    <div>
      <h3 className="font-semibold text-gray-800">
        {s.order_index}. {s.name}
      </h3>
      <p className="text-sm text-gray-500">
        {s.description}
      </p>
    </div>

    {/* Delete icon */}
    <button
      onClick={() => handleDeleteSubmodule(s.submodule_id)}
      className="text-red-500 hover:text-red-700 transition"
      title="Delete submodule"
    >
      <Trash2 size={18} />
    </button>
  </div>
))}


        {submodules.length === 0 && (
          <p className="text-gray-500">No submodules added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SubmoduleList;
