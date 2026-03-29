import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { Button } from "../../ui/button";
import { UserDetailModal } from "./user_details_modal";
import axiosInstance from "../../../API/axios_instance";
import { formatLastActive } from "../../../helper/format_datetime";

export interface UserProgress {
  id: string;
  name: string;
  email: string;
  avatar: string;
  completedModules: number;
  totalModules: number;
  progress: number;
  latestScore: number;
  lastActive: string;
  modules: any[];
  assessments: any[];
  xp: number;
  rank?: number;
  role?: string;
}

function isStaffRole(role: string | undefined) {
  const r = String(role || "")
    .toLowerCase()
    .replace(/\s+/g, "_");
  return r === "admin" || r === "super_admin";
}

export function AdminLeaderboardSection() {
  const [selectedUser, setSelectedUser] = useState<UserProgress | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<UserProgress[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/user/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const usersData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        const learnerUsers = usersData.filter(
          (user: any) => !isStaffRole(user.role)
        );

        const fetchedUsers: UserProgress[] = learnerUsers.map((user: any) => ({
          id: user.id?.toString() || "1",
          name: user.name || "User",
          email: user.email || "user@example.com",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=random`,
          completedModules: user.completedModules || 0,
          totalModules: 0,
          progress: user.progress || 0,
          latestScore: user.latestScore || 0,
          lastActive: user.last_active || "Never",
          modules: [],
          assessments: [],
          xp: user.xp || 0,
          role: user.role,
        }));

        const sorted = fetchedUsers.sort((a, b) => b.xp - a.xp);
        const withRanks = sorted.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        setUsers(withRanks);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    const fetchModules = async () => {
      try {
        const response = await axiosInstance.get("/module/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setModules(response.data || []);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUsers();
    fetchModules();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="max-w-10xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-10xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">All Users Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b text-center">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">XP Score</th>
                <th className="px-6 py-4">Completed Modules</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-yellow-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    {user.rank === 1 ? (
                      <div className="flex items-center justify-center gap-1 text-lg">
                        <span>🏆</span>
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                          1st
                        </span>
                      </div>
                    ) : user.rank === 2 ? (
                      <div className="flex items-center justify-center gap-1 text-lg">
                        <span>🥈</span>
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          2nd
                        </span>
                      </div>
                    ) : user.rank === 3 ? (
                      <div className="flex items-center justify-center gap-1 text-lg">
                        <span>🥉</span>
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                          3rd
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {user.rank}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">
                    {user.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-400">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      {user.xp}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.completedModules || 0} / {modules.length}
                  </td>
                  <td className="px-6 py-4 min-w-[150px]">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${user.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        {user.progress || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.lastActive && user.lastActive !== "Never"
                      ? formatLastActive(user.lastActive)
                      : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      className="text-blue-600 flex items-center gap-1 font-bold text-xs"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <UserDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}
    </>
  );
}
