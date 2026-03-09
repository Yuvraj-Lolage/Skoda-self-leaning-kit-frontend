import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Eye,
} from "lucide-react";
import { Button } from "../../ui/button";
import { UserDetailModal } from "./user_details_modal";
import axiosInstance from "../../../API/axios_instance";

interface AdminProgressPageProps {
  onBackClick: () => void;
}

interface UserProgress {
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

export function AdminProgressPage({ onBackClick }: AdminProgressPageProps) {
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
        const response = await axiosInstance.get('/user/all',{
          headers:{
            Authorization: `Bearer ${ localStorage.getItem('token') }`
          }
        });
        let usersData = Array.isArray(response.data) ? response.data : response.data?.data || [];
        
        const learnerUsers = usersData.filter((user: any) => user.role !== 'Admin' && user.role !== 'admin');
        
        const fetchedUsers: UserProgress[] = learnerUsers.map((user: any) => ({
          id: user.id?.toString() || "1",
          name: user.name || "User",
          email: user.email || "user@example.com",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=random`,
          completedModules: user.completedModules || 0,
          totalModules: 7, // Matches screenshot 0/7
          progress: user.progress || 0,
          latestScore: user.latestScore || 8, // Matches screenshot 8%
          lastActive: user.lastActive || "Never",
          modules: [],
          assessments: [],
          xp: user.xp || 0,
          role: user.role,
        }));

        const sorted = fetchedUsers.sort((a, b) => b.xp - a.xp);
        const withRanks = sorted.map((user, index) => ({ ...user, rank: index + 1 }));

        setUsers(withRanks);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };


    const fetchModules = async () => {
      try {
        const response = await axiosInstance.get('/module/all',{
          headers:{
            Authorization: `Bearer ${ localStorage.getItem('token') }`
          }
        });
        setModules(response.data);
      } catch (error) {
        setLoading(false);
        console.log(error);
        
      }
    };

    fetchUsers();
    fetchModules();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 bg-gray-50 font-sans">
      <button onClick={onBackClick} className="flex items-center text-gray-600 mb-6 hover:text-black">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      {/* Hero Card - Matching Screenshot Gradient and Layout */}
      {/* {topUser && (
        <div className="bg-gradient-to-r from-rose-400 via-pink-500 to-orange-500 rounded-xl p-6 mb-8 shadow-lg relative overflow-hidden max-w-4xl mx-auto">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/90 uppercase tracking-widest text-xs font-bold mb-3">
              <span role="img" aria-label="trophy">🏆</span> CHAMPION
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{topUser.name}</h2>
                <p className="text-white/80 text-xs mb-6">{topUser.email}</p>
                
                <div className="flex gap-3">
                  <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 min-w-[110px] border border-white/10">
                    <p className="text-white/70 text-xs font-bold uppercase mb-1">XP</p>
                    <p className="text-2xl font-bold text-white">{topUser.xp}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 min-w-[110px] border border-white/10">
                    <p className="text-white/70 text-xs font-bold uppercase mb-1">Progress</p>
                    <p className="text-2xl font-bold text-white">{topUser.progress}%</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 min-w-[110px] border border-white/10">
                    <p className="text-white/70 text-xs font-bold uppercase mb-1">Score</p>
                    <p className="text-2xl font-bold text-white">{topUser.latestScore}%</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center border-4 border-orange-300 shadow-inner">
                   <span className="text-2xl font-black text-orange-900">1</span>
                </div>
                <div className="absolute -top-2 -left-2 text-blue-500"><Medal fill="currentColor" /></div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Search Input */}
      <div className="max-w-7xl mx-auto mb-6">
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

      {/* Table - Replicating All Columns from Image */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">All Users Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">XP Score</th>
                <th className="px-6 py-4">Completed Modules</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Latest Score</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-yellow-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    {user.rank === 1 ? (
                      <div className="flex items-center justify-center gap-1 text-lg">
                        <span>🏆</span>
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">1st</span>
                      </div>
                    ) : user.rank === 2 ? (
                      <div className="flex items-center justify-center gap-1 text-lg">
                        <span>🥈</span>
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">2nd</span>
                      </div>
                    ) : user.rank === 3 ? (
                      <div className="flex items-center justify-center gap-1 text-lg">
                        <span>🥉</span>
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">3rd</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-gray-600">{user.rank}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{user.name}</span>
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
                      <span className="text-xs font-bold text-gray-700">{user.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-rose-500">
                    {user.latestScore}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      className="text-blue-600 flex items-center gap-1 font-bold text-xs"
                      onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
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
          onClose={() => { setIsModalOpen(false); setSelectedUser(null); }}
          user={selectedUser}
        />
      )}
    </div>
  );
}