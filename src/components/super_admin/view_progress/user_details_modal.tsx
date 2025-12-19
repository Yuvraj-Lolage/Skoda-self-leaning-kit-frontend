import {
  X,
  Mail,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
} from "lucide-react";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../ui/avatar";

interface ModuleProgress {
  id: string;
  name: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: "completed" | "in-progress" | "not-started";
}

interface Assessment {
  id: string;
  name: string;
  attemptNumber: number;
  marksObtained: number;
  totalMarks: number;
  status: "pass" | "fail";
  completedDate: string;
}

interface UserProgress {
  id: string;
  name: string;
  email: string;
  avatar: string;
  completedModules: number;
  totalModules: number;
  progress: number;
  latestScore: number;
  lastActive: string;
  modules: ModuleProgress[];
  assessments: Assessment[];
}

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProgress;
}

export function UserDetailModal({
  isOpen,
  onClose,
  user,
}: UserDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{
          animation: "fadeIn 0.2s ease-out",
        }}
      ></div>

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        style={{
          animation: "scaleIn 0.2s ease-out",
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* <Avatar className="w-20 h-20 border-4 border-white/30">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar> */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {user.name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">ID:</span>
                  <span>{user.id}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {user.progress}%
              </div>
              <div className="text-sm text-blue-100">
                Overall Progress
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.completedModules}/
                      {user.totalModules}
                    </p>
                    <p className="text-xs text-gray-600">
                      Modules Completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.latestScore}%
                    </p>
                    <p className="text-xs text-gray-600">
                      Latest Score
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {user.lastActive}
                    </p>
                    <p className="text-xs text-gray-600">
                      Last Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Module-wise Progress */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Module Progress
              </h3>
              <div className="space-y-4">
                {user.modules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            module.status === "completed"
                              ? "bg-green-100"
                              : module.status === "in-progress"
                                ? "bg-blue-100"
                                : "bg-gray-200"
                          }`}
                        >
                          {module.status === "completed" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : module.status ===
                            "in-progress" ? (
                            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                          ) : (
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {module.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {module.completedLessons} /{" "}
                            {module.totalLessons} lessons
                            completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            module.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : module.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {module.status === "completed"
                            ? "Completed"
                            : module.status === "in-progress"
                              ? "In Progress"
                              : "Not Started"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            module.status === "completed"
                              ? "bg-green-600"
                              : module.status === "in-progress"
                                ? "bg-blue-600"
                                : "bg-gray-400"
                          }`}
                          style={{
                            width: `${module.progress}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {module.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Assessment History
              </h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Assessment Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Attempt
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Marks Obtained
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {user.assessments.map((assessment) => {
                      const percentage = Math.round(
                        (assessment.marksObtained /
                          assessment.totalMarks) *
                          100,
                      );
                      return (
                        <tr
                          key={assessment.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900">
                              {assessment.name}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">
                              Attempt {assessment.attemptNumber}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {assessment.marksObtained}/
                                {assessment.totalMarks}
                              </span>
                              <span
                                className={`text-xs font-medium ${
                                  percentage >= 80
                                    ? "text-green-600"
                                    : percentage >= 60
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                ({percentage}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {assessment.status === "pass" ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3" />
                                Fail
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">
                              {new Date(
                                assessment.completedDate,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {user.assessments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No assessments completed yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}