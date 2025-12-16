import { Card, CardContent, CardHeader, CardTitle } from "../ui/card/card";
import { Button } from "../ui/button";
import { MoreVertical, Bell, MessageCircle, Settings, User } from "lucide-react";

export function ProfileCard() {
  return (
    <Card className="bg-white shadow-lg rounded-xl border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Your Profile
          </CardTitle>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Profile Picture with Progress Ring */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {/* Progress Ring - Larger and Thicker */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="url(#profileGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - 0.75)}`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Profile Picture - Larger */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  P
                </div>
              </div>
            </div>

            {/* Points Display */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🥇</span>
              <span className="font-semibold bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                250 Points
              </span>
            </div>

            {/* Greeting Text */}
            <h3 className="font-medium text-lg mb-1">Good Morning Prashant</h3>
            <p className="text-sm text-gray-600 text-center mb-4 font-normal">Continue your journey and achieve your target</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="w-12 h-12 rounded-full p-0 border-2 border-transparent bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white hover:text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
            >
              <Bell className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-12 h-12 rounded-full p-0 border-2 border-transparent bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white hover:text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-12 h-12 rounded-full p-0 border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}