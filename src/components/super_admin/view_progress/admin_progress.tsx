import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Users,
  TrendingUp,
  BookOpen,
  ClipboardCheck,
  Eye,
} from "lucide-react";
import { Button } from "../../ui/button";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../ui/avatar";
import { UserDetailModal } from "./user_details_modal";

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
  modules: ModuleProgress[];
  assessments: Assessment[];
}

interface ModuleProgress {
  id: string;
  name: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: "completed" | "in-progress" | "not-started";
}

interface Assessment {
  id: string;
  name: string;
  attemptNumber: number;
  marksObtained: number;
  totalMarks: number;
  status: "pass" | "fail";
  completedDate: string;
}

export function AdminProgressPage({
  onBackClick,
}: AdminProgressPageProps) {
  const [selectedUser, setSelectedUser] =
    useState<UserProgress | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for users
  const users: UserProgress[] = [
    {
      id: "U001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      completedModules: 8,
      totalModules: 12,
      progress: 67,
      latestScore: 85,
      lastActive: "2 hours ago",
      modules: [
        {
          id: "M1",
          name: "Python & Statistics Foundations",
          progress: 100,
          completedLessons: 8,
          totalLessons: 8,
          status: "completed",
        },
        {
          id: "M2",
          name: "Exploratory Data Analysis",
          progress: 75,
          completedLessons: 9,
          totalLessons: 12,
          status: "in-progress",
        },
        {
          id: "M3",
          name: "Machine Learning Fundamentals",
          progress: 40,
          completedLessons: 6,
          totalLessons: 15,
          status: "in-progress",
        },
        {
          id: "M4",
          name: "Deep Learning & Neural Networks",
          progress: 0,
          completedLessons: 0,
          totalLessons: 10,
          status: "not-started",
        },
      ],
      assessments: [
        {
          id: "A1",
          name: "Python Basics Quiz",
          attemptNumber: 1,
          marksObtained: 85,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-15",
        },
        {
          id: "A2",
          name: "Statistics Assessment",
          attemptNumber: 2,
          marksObtained: 78,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-16",
        },
        {
          id: "A3",
          name: "EDA Mid-term",
          attemptNumber: 1,
          marksObtained: 92,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-18",
        },
      ],
    },
    {
      id: "U002",
      name: "Michael Chen",
      email: "michael.chen@company.com",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      completedModules: 12,
      totalModules: 12,
      progress: 100,
      latestScore: 95,
      lastActive: "1 day ago",
      modules: [
        {
          id: "M1",
          name: "Python & Statistics Foundations",
          progress: 100,
          completedLessons: 8,
          totalLessons: 8,
          status: "completed",
        },
        {
          id: "M2",
          name: "Exploratory Data Analysis",
          progress: 100,
          completedLessons: 12,
          totalLessons: 12,
          status: "completed",
        },
        {
          id: "M3",
          name: "Machine Learning Fundamentals",
          progress: 100,
          completedLessons: 15,
          totalLessons: 15,
          status: "completed",
        },
        {
          id: "M4",
          name: "Deep Learning & Neural Networks",
          progress: 100,
          completedLessons: 10,
          totalLessons: 10,
          status: "completed",
        },
      ],
      assessments: [
        {
          id: "A1",
          name: "Python Basics Quiz",
          attemptNumber: 1,
          marksObtained: 95,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-10",
        },
        {
          id: "A2",
          name: "Statistics Assessment",
          attemptNumber: 1,
          marksObtained: 88,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-11",
        },
        {
          id: "A3",
          name: "EDA Mid-term",
          attemptNumber: 1,
          marksObtained: 96,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-13",
        },
        {
          id: "A4",
          name: "ML Final Assessment",
          attemptNumber: 1,
          marksObtained: 92,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-17",
        },
      ],
    },
    {
      id: "U003",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
      completedModules: 5,
      totalModules: 12,
      progress: 42,
      latestScore: 72,
      lastActive: "3 hours ago",
      modules: [
        {
          id: "M1",
          name: "Python & Statistics Foundations",
          progress: 100,
          completedLessons: 8,
          totalLessons: 8,
          status: "completed",
        },
        {
          id: "M2",
          name: "Exploratory Data Analysis",
          progress: 50,
          completedLessons: 6,
          totalLessons: 12,
          status: "in-progress",
        },
        {
          id: "M3",
          name: "Machine Learning Fundamentals",
          progress: 20,
          completedLessons: 3,
          totalLessons: 15,
          status: "in-progress",
        },
        {
          id: "M4",
          name: "Deep Learning & Neural Networks",
          progress: 0,
          completedLessons: 0,
          totalLessons: 10,
          status: "not-started",
        },
      ],
      assessments: [
        {
          id: "A1",
          name: "Python Basics Quiz",
          attemptNumber: 2,
          marksObtained: 72,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-14",
        },
        {
          id: "A2",
          name: "Statistics Assessment",
          attemptNumber: 1,
          marksObtained: 65,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-16",
        },
      ],
    },
    {
      id: "U004",
      name: "David Park",
      email: "david.park@company.com",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
      completedModules: 10,
      totalModules: 12,
      progress: 83,
      latestScore: 88,
      lastActive: "5 hours ago",
      modules: [
        {
          id: "M1",
          name: "Python & Statistics Foundations",
          progress: 100,
          completedLessons: 8,
          totalLessons: 8,
          status: "completed",
        },
        {
          id: "M2",
          name: "Exploratory Data Analysis",
          progress: 100,
          completedLessons: 12,
          totalLessons: 12,
          status: "completed",
        },
        {
          id: "M3",
          name: "Machine Learning Fundamentals",
          progress: 87,
          completedLessons: 13,
          totalLessons: 15,
          status: "in-progress",
        },
        {
          id: "M4",
          name: "Deep Learning & Neural Networks",
          progress: 30,
          completedLessons: 3,
          totalLessons: 10,
          status: "in-progress",
        },
      ],
      assessments: [
        {
          id: "A1",
          name: "Python Basics Quiz",
          attemptNumber: 1,
          marksObtained: 88,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-12",
        },
        {
          id: "A2",
          name: "Statistics Assessment",
          attemptNumber: 1,
          marksObtained: 82,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-13",
        },
        {
          id: "A3",
          name: "EDA Mid-term",
          attemptNumber: 1,
          marksObtained: 90,
          totalMarks: 100,
          status: "pass",
          completedDate: "2024-12-15",
        },
      ],
    },
    {
      id: "U005",
      name: "Jessica Taylor",
      email: "jessica.taylor@company.com",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80",
      completedModules: 3,
      totalModules: 12,
      progress: 25,
      latestScore: 58,
      lastActive: "1 week ago",
      modules: [
        {
          id: "M1",
          name: "Python & Statistics Foundations",
          progress: 75,
          completedLessons: 6,
          totalLessons: 8,
          status: "in-progress",
        },
        {
          id: "M2",
          name: "Exploratory Data Analysis",
          progress: 25,
          completedLessons: 3,
          totalLessons: 12,
          status: "in-progress",
        },
        {
          id: "M3",
          name: "Machine Learning Fundamentals",
          progress: 0,
          completedLessons: 0,
          totalLessons: 15,
          status: "not-started",
        },
        {
          id: "M4",
          name: "Deep Learning & Neural Networks",
          progress: 0,
          completedLessons: 0,
          totalLessons: 10,
          status: "not-started",
        },
      ],
      assessments: [
        {
          id: "A1",
          name: "Python Basics Quiz",
          attemptNumber: 3,
          marksObtained: 58,
          totalMarks: 100,
          status: "fail",
          completedDate: "2024-12-10",
        },
      ],
    },
  ];

  // Calculate summary statistics
  const totalUsers = users.length;
  const averageCompletion = Math.round(
    users.reduce((sum, user) => sum + user.progress, 0) /
      users.length,
  );
  const totalModulesCompleted = users.reduce(
    (sum, user) => sum + user.completedModules,
    0,
  );
  const totalAssessments =
    users.filter((user) => user.progress < 100).length * 2; // Mock calculation

  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const handleViewDetails = (user: UserProgress) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <p className="text-4xl font-semibold text-gray-900">
                User Progress Dashboard
              </p>
            </div>
          </div>
          {/* <Avatar className="w-10 h-10">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar> */}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {totalUsers}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Total Users
          </p>
          {/* <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12% from last month</span>
          </div> */}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {averageCompletion}%
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Average Completion
          </p>
          {/* <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+5% from last month</span>
          </div> */}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {totalModulesCompleted}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Modules Completed
          </p>
          {/* <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+18% from last month</span>
          </div> */}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {totalAssessments}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Total Assessments
          </p>
          {/* <div className="mt-4 flex items-center gap-2 text-xs text-orange-600">
            <TrendingUp className="w-4 h-4" />
            <span>Requires attention</span>
          </div> */}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" className="border-gray-300">
            Filter
          </Button>
          <Button variant="outline" className="border-gray-300">
            Export
          </Button>
        </div>
      </div>

      {/* User Progress Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Completed Modules
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Latest Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {user.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {/* <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar> */}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {user.completedModules} /{" "}
                      {user.totalModules}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${user.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {user.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.latestScore >= 80
                          ? "bg-green-100 text-green-800"
                          : user.latestScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.latestScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e:any) => {
                        e.stopPropagation();
                        handleViewDetails(user);
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
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
    </div>
  );
}