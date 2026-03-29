import { useEffect, useState } from "react";
import { Users, Layers } from "lucide-react";
import axiosInstance from "../../../API/axios_instance";
import { AdminLeaderboardSection } from "../view_progress/admin_leaderboard_section";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalModules, setTotalModules] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const load = async () => {
      try {
        setStatsLoading(true);
        const [usersRes, modulesRes] = await Promise.all([
          axiosInstance.get("/user/all", { headers }),
          axiosInstance.get("/module/all", { headers }),
        ]);

        const usersData = Array.isArray(usersRes.data)
          ? usersRes.data
          : usersRes.data?.data || [];
        const modulesData = Array.isArray(modulesRes.data)
          ? modulesRes.data
          : [];

        setTotalUsers(usersData.length);
        setTotalModules(modulesData.length);
      } catch {
        setTotalUsers(null);
        setTotalModules(null);
      } finally {
        setStatsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="flex-1 bg-gray-50 font-sans min-h-full">
      <div className="max-w-10xl mx-auto px-3 sm:px-4 py-6 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview and learner leaderboard
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex gap-4 items-start">
            <div className="rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 p-3">
              <Users className="w-7 h-7 text-purple-700" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total users</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums mt-1">
                {statsLoading ? "—" : totalUsers ?? "—"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                All accounts in the system
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 flex gap-4 items-start">
            <div className="rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 p-3">
              <Layers className="w-7 h-7 text-blue-700" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total modules</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums mt-1">
                {statsLoading ? "—" : totalModules ?? "—"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Training modules configured
              </p>
            </div>
          </div>
        </div>

        <section className="pb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Leaderboard
          </h2>
          <AdminLeaderboardSection />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
