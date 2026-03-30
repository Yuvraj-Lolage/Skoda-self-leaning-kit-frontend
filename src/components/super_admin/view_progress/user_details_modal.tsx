import {
  Mail,
  Calendar,
  Award,
  CheckCircle,
} from "lucide-react";
import { formatLastActive } from "../../../helper/format_datetime";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function UserDetailModal({
  isOpen,
  onClose,
  user,
}: UserDetailModalProps) {
  if (!isOpen) return null;

  const getModuleStatus = (percent: number) => {
    if (percent === 100) return "Completed";
    if (percent > 0) return "In Progress";
    return "Not Started";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-5xl max-h-[90vh] overflow-hidden">

        {/* HEADER */}
        <div className="relative border-b border-gray-200 p-5 px-8 flex justify-between items-start">

          {/* LEFT SECTION */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              {user.name}
            </h2>

            <div className="mt-2 space-y-1 text-sm text-gray-500">
              <div>ID: {user.id}</div>
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-md border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center shadow-sm"
          >
            <span>X</span>
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto max-h-[70vh] p-6 space-y-6">

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                  <Award className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.completedModules}/{user.totalModules}
                  </p>
                  <p className="text-xs text-gray-500">
                    Modules Completed
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.latestScore}%
                  </p>
                  <p className="text-xs text-gray-500">
                    Overall Progress
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {/* {user.lastActive || "Never"} */}
                    {formatLastActive(user.lastActive)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MODULES */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Module Progress
            </h3>

            <div className="space-y-3">
              {user.modules.map((module: any) => {
                const percent = module.completion_percent || 0;
                const status = getModuleStatus(percent);

                return (
                  <div
                    key={module.module_id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {/* TOP */}
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${status === "Completed"
                              ? "bg-green-500"
                              : status === "In Progress"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                              }`}
                          />
                          {module.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {module.submodule_count === 0
                            ? "No lessons"
                            : `${module.completed_submodule_count} / ${module.submodule_count} lessons completed`}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded-md ${status === "Completed"
                          ? "bg-green-50 text-green-600"
                          : status === "In Progress"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* PROGRESS */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                        <div
                          className={`h-1.5 rounded-full ${status === "Completed"
                            ? "bg-green-500"
                            : status === "In Progress"
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                            }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <span className="text-xs text-gray-500 w-10 text-right">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ASSESSMENTS */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Assessment History
            </h3>

            {user.assessments.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No assessments completed yet
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-xs">
                    <tr>
                      <th className="px-4 py-2 text-left">Assessment</th>
                      <th className="px-4 py-2">Attempt</th>
                      <th className="px-4 py-2">Marks</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.assessments.map((a: any) => {


                      return (
                        <tr key={a.id} className="border-t">
                          <td className="px-4 py-2">{a.name}</td>
                          <td className="px-4 py-2 text-center">
                            {a.attemptNumber}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {a.marksObtained}/{a.totalMarks}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`text-xs px-2 py-1 rounded ${a.status === "pass"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                                }`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {new Date(a.completedDate).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}