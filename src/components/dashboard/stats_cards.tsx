import { Card, CardContent } from "../ui/card/card";
import { Star, CheckSquare, Bell } from "lucide-react";

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Average Rating */}
      <Card className="bg-white shadow-lg rounded-xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Average Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">8/10</span>
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Tasks */}
      <Card className="bg-white shadow-lg rounded-xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Active Tasks</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">12</span>
                <span className="text-gray-500">tasks</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification */}
      <Card className="bg-white shadow-lg rounded-xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Notifications</p>
              <p className="text-sm">You have new messages!</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}