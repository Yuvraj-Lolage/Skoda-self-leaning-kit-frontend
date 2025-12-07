import React from "react";
import { Button } from "../ui/button";

export default function ResumeTrainingCard() {
  const completedModules = 3;
  const totalModules = 8;
  const percent = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Full Stack Development</h3>
          <p className="text-sm text-white/90">
            Master the fundamentals to advanced concepts
          </p>

          <p className="text-xs mt-3 opacity-90">
            {completedModules} of {totalModules} modules completed
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center">
          🎓
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 opacity-90">
          <span></span>
          <span>{percent}%</span>
        </div>

        <div className="w-full h-2 bg-white/30 rounded-full">
          <div
            className="h-2 bg-white rounded-full transition-all"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <Button
          className="w-full bg-white text-blue-700 hover:bg-white/90 font-semibold"
          variant="ghost"
        >
          Resume Training
        </Button>
      </div>
    </div>
  );
}
