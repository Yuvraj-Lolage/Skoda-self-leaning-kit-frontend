import React, { useMemo } from "react";

interface TrainingAnalysisProps {
  userName?: string;
  totalModules: number;
  completedModules: number;
  /** Current module title from catalog (next / active lesson). */
  currentModuleName?: string;
  /** Current submodule (lesson) title from catalog. */
  currentSubmoduleName?: string;
  /** Resume navigation or scroll to list when nothing left to resume. */
  onContinueLearning?: () => void;
}

const TrainingAnalysis: React.FC<TrainingAnalysisProps> = ({
  userName,
  totalModules,
  completedModules,
  currentModuleName,
  currentSubmoduleName,
  onContinueLearning,
}) => {
  const displayName = useMemo(() => {
    const raw = userName?.trim();
    if (!raw) return "Your";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [userName]);

  const overallPercentage = useMemo(() => {
    if (!totalModules || totalModules === 0) return 0;
    return Math.min(
      100,
      Math.round((completedModules / totalModules) * 100)
    );
  }, [completedModules, totalModules]);

  const hasCurrentLesson =
    Boolean(currentModuleName?.trim()) &&
    Boolean(currentSubmoduleName?.trim());

  const sessionLabel = hasCurrentLesson
    ? null
    : completedModules >= totalModules && totalModules > 0
      ? "All modules completed — review any lesson below."
      : "Open a lesson below to continue.";

  return (
    <div className="p-6 h-auto">
      <div
        className="bg-white rounded-xl p-6 shadow-lg"
        id="training-analysis-card"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">
              {displayName}&rsquo;s Progress
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              💡 Good start! Keep the focus and pace!
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">
              {completedModules} / {totalModules} Modules
            </p>
            <p className="text-green-600 font-semibold">
              ↑ {overallPercentage}%
            </p>
          </div>
        </div>

        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold text-gray-900">
                Current session
              </span>
            </p>
            {hasCurrentLesson ? (
              <>
                <p className="text-gray-800 font-medium">
                  {currentModuleName}
                </p>
                <p className="text-gray-600 text-sm">{currentSubmoduleName}</p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">{sessionLabel}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onContinueLearning}
            className="shrink-0 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900"
          >
            Continue learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingAnalysis;
