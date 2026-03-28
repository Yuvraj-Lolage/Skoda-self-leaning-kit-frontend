import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axios_instance";

const DEFAULT_TRACK_ID = 1;

type CatalogSub = {
  submodule_id: number;
  name: string;
  order_index?: number;
  status: string;
};

type CatalogModule = {
  module_id: number;
  name: string;
  order_index?: number;
  submodules?: CatalogSub[];
  status: string;
};

type ResumeTarget = {
  moduleId: number;
  submoduleId: number;
  moduleName: string;
  submoduleName: string;
};

/** First lesson not yet completed, in global module → submodule order (matches catalog rules). */
function findResumeTarget(modules: CatalogModule[]): ResumeTarget | null {
  const ordered = [...modules].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );
  for (const m of ordered) {
    const subs = [...(m.submodules ?? [])].sort(
      (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
    );
    for (const s of subs) {
      if (s.status !== "completed") {
        return {
          moduleId: m.module_id,
          submoduleId: s.submodule_id,
          moduleName: m.name,
          submoduleName: s.name,
        };
      }
    }
  }
  return null;
}

export default function ResumeTrainingCard() {
  const navigate = useNavigate();

  const [totalCompletedModules, setTotalCompletedModules] = useState(0);
  const [allModules, setAllModules] = useState(0);
  const [resumeTarget, setResumeTarget] = useState<ResumeTarget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/learning-progress/catalog", {
          params: { trackId: DEFAULT_TRACK_ID },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const rawModules: CatalogModule[] = res.data?.modules ?? [];
        setAllModules(rawModules.length);
        setTotalCompletedModules(
          typeof res.data?.total_completed_modules === "number"
            ? res.data.total_completed_modules
            : rawModules.filter((m) => m.status === "completed").length
        );
        setResumeTarget(findResumeTarget(rawModules));
      } catch (err) {
        console.error("Failed to load training catalog for resume card", err);
        setTotalCompletedModules(0);
        setAllModules(0);
        setResumeTarget(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const percentage =
    allModules > 0
      ? Math.min(100, Math.round((totalCompletedModules / allModules) * 100))
      : 0;

  const headline =
    loading
      ? "Loading…"
      : resumeTarget
        ? resumeTarget.moduleName
        : "All modules completed";

  const subline =
    loading
      ? "Fetching your progress"
      : resumeTarget
        ? resumeTarget.submoduleName
        : "Great job — open the training list anytime to review.";

  return (
    <div
      className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white shadow-lg"
      id="resume-training"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{headline}</h3>
          <p className="text-sm text-white/90 line-clamp-2">{subline}</p>

          <p className="text-xs mt-3 opacity-90">
            {totalCompletedModules} of {allModules} modules completed
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center">
          🎓
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 opacity-90">
          <span />
          <span>{percentage}%</span>
        </div>

        <div className="w-full h-2 bg-white/30 rounded-full">
          <div
            className="h-2 bg-white rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="mt-6">
        <Button
          className="w-full bg-white text-blue-700 hover:bg-white/90 font-semibold"
          variant="ghost"
          disabled={loading}
          onClick={() => {
            if (resumeTarget) {
              navigate(
                `/module/${resumeTarget.moduleId}/submodule/${resumeTarget.submoduleId}`
              );
            } else {
              navigate("/training");
            }
          }}
        >
          {loading
            ? "Loading…"
            : resumeTarget
              ? "Resume training"
              : "View training modules"}
        </Button>
      </div>
    </div>
  );
}
