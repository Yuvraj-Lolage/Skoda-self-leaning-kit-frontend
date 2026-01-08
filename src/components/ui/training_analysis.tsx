import React, { useState } from "react";

interface TrainingAnalysisProps {
  userName: string;
  totalModules: number;
  completedModules: number;
  currentSession: string;
}

const TrainingAnalysis: React.FC<TrainingAnalysisProps> = ({
  userName,
  totalModules,
  completedModules,
  currentSession,
}) => {

     const [overallPercentage, setOverallPercentage] = useState(30);
  return (
    <div className="p-6 h-auto">
      {/* Overall Progress Card */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">
              {userName.charAt(0).toUpperCase() + userName.slice(1) }’s Progress
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

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>

        {/* Current Session */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm">
            <span className="font-semibold">Current Session:</span>{" "}
            {currentSession}
          </p>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingAnalysis;
