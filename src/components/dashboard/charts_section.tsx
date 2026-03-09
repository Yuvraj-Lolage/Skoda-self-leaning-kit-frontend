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

export function ChartsSection() {
  const [totalCompletedModules, setTotalCompletedModules] =
    useState<number>(0);
  const [allModules, setAllModules] = useState<number>(0);

  /* ================= API CALLS ================= */

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
