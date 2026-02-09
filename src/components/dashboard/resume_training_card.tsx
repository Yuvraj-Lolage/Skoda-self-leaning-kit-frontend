import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axios_instance";

export default function ResumeTrainingCard() {
  const navigate = useNavigate();

  const [totalCompletedModules, setTotalCompletedModules] =
    useState<number>(0);
  const [allModules, setAllModules] = useState<number>(0);

  const fetchCompletedModules = async () => {
    try {
      const res = await axiosInstance.get(
        "/module/with-submodules/with-status/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTotalCompletedModules(
        res.data?.modules?.total_completed_modules ?? 0
      );
    } catch (err) {
      console.error("Failed to load module progress", err);
    }
  };

  const fetchAllModules = async () => {
    try {
      const res = await axiosInstance.get("/module/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAllModules(res.data?.length ?? 0);
    } catch (err) {
      console.error("Error fetching all modules", err);
    }
  };

  useEffect(() => {
    fetchCompletedModules();
    fetchAllModules();
  }, []);

  // ✅ DERIVED VALUE (always up-to-date)
  const percentage =
    allModules > 0
      ? Math.round((totalCompletedModules / allModules) * 100)
      : 0;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">
            Organization Overview
          </h3>
          <p className="text-sm text-white/90">
            New Submodule
          </p>

          <p className="text-xs mt-3 opacity-90">
            {totalCompletedModules} of {allModules} modules completed
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
          onClick={() => navigate("/module/1/submodule/17")}
        >
          Resume Training
        </Button>
      </div>
    </div>
  );
}
