import { useState, useEffect, useMemo } from "react";
import { CheckCircle, Play, ChevronDown, ChevronUp, Info } from "lucide-react";
import axiosInstance from "../../API/axios_instance";
import { useNavigate } from "react-router-dom";
import { ModuleModal } from "../modules/ModuleModal";
import TrainingAnalysis from "../ui/training_analysis";
import { getTokenData } from "../../helper/auth_token";


import { usePageTour } from "../../hooks/use_page_tour";
import { TOUR_KEYS } from "../../constants/tour_keys";
import { trainingTourSteps } from "../../tours/training_tour";

type ProgressStatus = "completed" | "in_progress" | "locked";

function sortedSubmodules(module: any) {
  return [...(module.submodules ?? [])].sort(
    (a, b) =>
      (a.submodule_order_index ?? a.order_index ?? 0) -
      (b.submodule_order_index ?? b.order_index ?? 0)
  );
}

/** All assessments in submodule order, then assessment order within each submodule. */
function flatAssessmentsInModuleOrder(module: any) {
  const out: any[] = [];
  for (const sub of sortedSubmodules(module)) {
    const as = [...(sub.assessments ?? [])].sort(
      (a, b) =>
        (a.order_index ?? a.assessment_id ?? 0) -
        (b.order_index ?? b.assessment_id ?? 0)
    );
    out.push(...as);
  }
  return out;
}

/** Module is complete only when every submodule and every assessment under the module is completed. */
function deriveModuleDisplayStatus(module: any): ProgressStatus {
  const subs = module.submodules ?? [];
  const assessments = subs.flatMap((s: any) => s.assessments ?? []);

  const allSubDone =
    subs.length === 0 ||
    subs.every((s: any) => s.status === "completed");
  const allAssessDone =
    assessments.length === 0 ||
    assessments.every((a: any) => a.status === "completed");

  if (allSubDone && allAssessDone) {
    if (subs.length === 0 && assessments.length === 0) {
      if (module.status === "completed" || module.status === "in_progress") {
        return module.status;
      }
      return "locked";
    }
    return "completed";
  }

  const anyStarted =
    module.status === "in_progress" ||
    subs.some(
      (s: any) =>
        s.status === "in_progress" || s.status === "completed"
    ) ||
    assessments.some(
      (a: any) =>
        a.status === "in_progress" || a.status === "completed"
    );

  if (anyStarted) return "in_progress";
  return "locked";
}

export default function TrainingModules() {
  usePageTour(TOUR_KEYS.TRAINING, trainingTourSteps, true);

  const navigate = useNavigate();
  const [token] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });
  const [modules, setModules] = useState<any[] | null>(null);
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [userData, setUserData] = useState<any>();


  const [completedModulesCount, setCompletedModulesCount] = useState(0);

  /** Single-course default; change when you add multi-track support */
  const DEFAULT_TRACK_ID = 1;

  useEffect(() => {
    async function getUserData() {
      const data = await getTokenData();
      if (data) {
        setUserData(data);
      }
    }

    getUserData();
  }, [])

  const loadModules = async () => {
    try {
      const response = await axiosInstance.get("/learning-progress/catalog", {
        params: { trackId: DEFAULT_TRACK_ID },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.status !== 200 || !response.data?.modules) {
        setModules([]);
        setCompletedModulesCount(0);
        return;
      }

      const rawModules = response.data.modules as any[];

      const normalizedModules = rawModules.map((module: any) => {
        const normalizedSubmodules = (module.submodules || [])
          .filter(Boolean)
          .slice()
          .sort(
            (a: any, b: any) =>
              (a.order_index ?? 0) - (b.order_index ?? 0)
          )
          .map((sub: any) => {
            const status =
              sub.status === "completed" ||
              sub.status === "in_progress" ||
              sub.status === "locked"
                ? sub.status
                : "locked";

            const assessments = (sub.assessments ?? []).map((a: any) => ({
              ...a,
              status:
                a.status === "completed" ||
                a.status === "in_progress" ||
                a.status === "locked"
                  ? a.status
                  : "locked",
            }));

            return {
              ...sub,
              submodule_name: sub.name,
              submodule_description: sub.description,
              submodule_order_index: sub.order_index,
              status,
              assessments,
            };
          });

        const moduleStatus =
          module.status === "completed" ||
          module.status === "in_progress" ||
          module.status === "locked"
            ? module.status
            : "locked";

        return {
          ...module,
          module_name: module.name,
          module_description: module.description,
          status: moduleStatus,
          submodules: normalizedSubmodules,
        };
      });

      setModules(normalizedModules);
      setCompletedModulesCount(
        normalizedModules.filter(
          (m) => deriveModuleDisplayStatus(m) === "completed"
        ).length
      );
    } catch (error) {
      console.error("Error loading modules:", error);
      setModules([]);
      setCompletedModulesCount(0);
    }
  };


  useEffect(() => {
    loadModules();
  }, [token]);

  /** First incomplete lesson or assessment (linear: submodule then its assessments). */
  const resumeTarget = useMemo(() => {
    if (!modules?.length) return null;
    const ordered = [...modules].sort(
      (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
    );
    for (const m of ordered) {
      if (m.status === "locked") break;
      const subs = [...(m.submodules || [])].sort(
        (a: { submodule_order_index?: number; order_index?: number }, b: any) =>
          (a.submodule_order_index ?? a.order_index ?? 0) -
          (b.submodule_order_index ?? b.order_index ?? 0)
      );
      for (const s of subs) {
        if (s.status !== "completed") {
          return {
            kind: "submodule" as const,
            moduleId: m.module_id,
            submoduleId: s.submodule_id,
            moduleName: m.module_name ?? m.name,
            label: s.submodule_name ?? s.name,
          };
        }
        const asmt = s.assessments ?? [];
        for (const a of asmt) {
          if (a.status !== "completed") {
            return {
              kind: "assessment" as const,
              moduleId: m.module_id,
              submoduleId: s.submodule_id,
              assessmentId: a.assessment_id,
              moduleName: m.module_name ?? m.name,
              label: a.title ?? `Assessment ${a.assessment_id}`,
            };
          }
        }
      }
    }
    return null;
  }, [modules]);

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

  const openAssessment = (module_id: string, assessment_id: number | string) => {
    navigate(`/module/${module_id}/assessment/${assessment_id}`);
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
      {/* Header with back button */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          <span className="text-lg">←</span>
          Back
        </button>

        {/* Page Title */}
        <h3 className="text-lg font-semibold text-gray-800">
          Training Modules
        </h3>
      </div>

      <TrainingAnalysis
        userName={userData?.name}
        totalModules={modules.length}
        completedModules={completedModulesCount}
        currentModuleName={resumeTarget?.moduleName}
        currentSubmoduleName={resumeTarget?.label}
        onContinueLearning={() => {
          if (resumeTarget) {
            if (resumeTarget.kind === "assessment") {
              openAssessment(
                String(resumeTarget.moduleId),
                resumeTarget.assessmentId
              );
            } else {
              openSubmodule(
                String(resumeTarget.moduleId),
                String(resumeTarget.submoduleId)
              );
            }
          } else {
            document
              .getElementById("training-modules")
              ?.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />
      <div className="p-6" id="training-modules">
        <div className="space-y-4">
          <h4 className="text-base font-medium text-gray-800">Training Modules</h4>
          <div className="grid grid-cols-1 gap-3">
            {modules.map((module, index) => {
              const displayStatus = deriveModuleDisplayStatus(module);
              const isCompleted = displayStatus === "completed";
              const isCurrent = displayStatus === "in_progress";
              const moduleAssessmentsFlat = flatAssessmentsInModuleOrder(module);

              return (
                <div key={module.module_id} className="border rounded-xl border-top-0 border-gray-200">
                  {/* Module Header */}
                  <div
                    onClick={() => setOpenModuleId(openModuleId === module.module_id ? null : module.module_id)}
                    className={`group flex items-center justify-between gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${isCompleted ? "bg-green-50 border-green-200" :
                      isCurrent ? "bg-gradient-to-r from-pink-50 to-orange-50 border-pink-200 shadow-md" :
                        "bg-gray-50 border-gray-200"
                      } ${!isCompleted && !isCurrent ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isCompleted ? "bg-green-500 text-white" :
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
                        <p className="text-sm text-gray-500 mt-1">{renderStatus(displayStatus)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* NEW: Button to open the ModuleModal */}
                      <button
                        onClick={(e) => handleOpenModal(e, module)}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors text-gray-500 hover:text-blue-600"
                        title="View Module Details"
                        id="module-info-button"
                      >
                        <Info className="w-5 h-5" />
                      </button>

                      {openModuleId === module.module_id ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                  </div>

                  {/* Submodules List */}
                  {openModuleId === module.module_id && module.submodules?.length > 0 && (
                    <div className="relative pl-12 mt-4">
                      {/* Vertical timeline */}
                      <div className="absolute left-12 top-0 bottom-0 w-px bg-gray-300"></div>

                      {sortedSubmodules(module).map((sub: any, subIdx: number) => (
                        <div
                          key={sub.submodule_id}
                          className="relative flex items-start mb-5"
                          id={subIdx === 0 ? "submodules-card" : undefined}
                        >
                          <div className="absolute left-2 top-6 flex items-center">
                            <div className="w-6 h-px bg-gray-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                          </div>

                          <div
                            onClick={() =>
                              sub.status !== "locked" &&
                              openSubmodule(
                                String(module.module_id),
                                String(sub.submodule_id)
                              )
                            }
                            className={`
          ml-10 w-full rounded-lg
          px-5 py-3
          flex justify-between items-center
          transition-all duration-200
          hover:shadow-md
          ${sub.status === "locked" ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
          ${renderStyles(sub.status)}
        `}
                          >
                            <div className="space-y-0.5">
                              <h6 className="font-semibold text-gray-800 text-sm">
                                {sub.submodule_name}
                              </h6>
                              <p className="text-xs text-gray-500 max-w-xl leading-snug">
                                {sub.submodule_description}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-1.5">
                              <span
                                className={`
              px-2.5 py-0.5 rounded-full text-[11px] font-medium
              ${sub.status === "completed" && "bg-green-100 text-green-700"}
              ${sub.status === "in_progress" && "bg-pink-100 text-pink-700"}
              ${sub.status === "locked" && "bg-gray-200 text-gray-500"}
            `}
                              >
                                {renderStatus(sub.status)}
                              </span>
                              <div className="text-[11px] text-gray-500 flex items-center gap-1">
                                ⏱ {sub.duration} mins
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {moduleAssessmentsFlat.length > 0 && (
                        <div className="space-y-3 mb-2">
                          <p className="ml-10 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Assessments
                          </p>
                          {moduleAssessmentsFlat.map((a: any) => (
                            <div
                              key={`a-${a.assessment_id}`}
                              className="relative flex items-start"
                            >
                              <div className="absolute left-2 top-6 flex items-center">
                                <div className="w-6 h-px bg-gray-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-violet-400"></div>
                              </div>

                              <div
                                onClick={() =>
                                  a.status !== "locked" &&
                                  openAssessment(module.module_id, a.assessment_id)
                                }
                                className={`
            ml-10 w-full rounded-lg
            px-5 py-3
            flex justify-between items-center
            transition-all duration-200
            hover:shadow-md
            ${a.status === "locked" ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
            ${renderStyles(a.status)}
          `}
                              >
                                <div className="space-y-0.5">
                                  <h6 className="font-semibold text-gray-800 text-sm">
                                    {a.title}
                                  </h6>
                                  <p className="text-xs text-gray-500 max-w-xl leading-snug">
                                    {a.description || "Knowledge check"}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                  <span
                                    className={`
                px-2.5 py-0.5 rounded-full text-[11px] font-medium
                ${a.status === "completed" && "bg-green-100 text-green-700"}
                ${a.status === "in_progress" && "bg-pink-100 text-pink-700"}
                ${a.status === "locked" && "bg-gray-200 text-gray-500"}
              `}
                                  >
                                    {renderStatus(a.status)}
                                  </span>
                                  <div className="text-[11px] text-gray-500">
                                    Assessment
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
          moduleStatus={deriveModuleDisplayStatus(selectedModule)}
          moduleNumber={modules.indexOf(selectedModule) + 1}
          lessonsCount={
            (selectedModule.submodules?.length || 0) +
            (selectedModule.submodules?.reduce(
              (acc: number, s: any) => acc + (s.assessments?.length ?? 0),
              0
            ) || 0)
          }
          duration={
            selectedModule.submodules?.reduce(
              (acc: number, s: any) => acc + (parseInt(s.duration, 10) || 0),
              0
            ) + " mins"
          }
          onStartModule={() => {
            setIsModalOpen(false);
            navigate(`/module/${selectedModule.module_id}`); // Navigates to the blackboard intro page
          }}
        />
      )}
    </div>
  );
}