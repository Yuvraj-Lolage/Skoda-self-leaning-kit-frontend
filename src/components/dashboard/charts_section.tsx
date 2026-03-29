import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../API/axios_instance";

const DEFAULT_TRACK_ID = 1;

export function ChartsSection() {
  const [totalCompletedModules, setTotalCompletedModules] =
    useState<number>(0);
  const [allModules, setAllModules] = useState<number>(0);

  /* ================= API CALLS ================= */

  /** Loads counts from user_learning_path_progress (recalculated on server). */
  const fetchTrainingProgress = async () => {
    try {
      const res = await axiosInstance.get("/learning-progress/track", {
        params: { trackId: DEFAULT_TRACK_ID },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const lp = res.data?.learningPath;
      setTotalCompletedModules(
        Number(lp?.completed_modules_count ?? 0)
      );
      setAllModules(Number(lp?.total_modules_count ?? 0));
    } catch (err) {
      console.error("Failed to load training progress", err);
      setTotalCompletedModules(0);
      setAllModules(0);
    }
  };

  useEffect(() => {
    fetchTrainingProgress();
  }, []);

  /* ================= DERIVED DATA ================= */

  const completionPercentage = useMemo(() => {
    if (allModules === 0) return 0;
    return Math.round(
      (totalCompletedModules / allModules) * 100
    );
  }, [totalCompletedModules, allModules]);

  const activitiesData = useMemo(
    () => [
      {
        name: "Completed",
        value: totalCompletedModules,
        color: "#ec4899",
      },
      {
        name: "Remaining",
        value: Math.max(
          allModules - totalCompletedModules,
          0
        ),
        color: "#e2e8f0",
      },
    ],
    [totalCompletedModules, allModules]
  );

  /* ================= RENDER ================= */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card
        className="bg-white shadow-lg rounded-xl border-0"
        id="progress-chart"
      >
        <CardHeader>
          <CardTitle>Training Progress</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={activitiesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {activitiesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold">
                  {completionPercentage}%
                </span>
                <span className="text-sm text-gray-500">
                  Complete
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {totalCompletedModules} of {allModules} modules
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
