import { Card, CardContent, CardHeader, CardTitle } from "../ui/card/card";
import { Button } from "../ui/button";
import { MoreVertical, Bell, MessageCircle, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getTokenData } from "../../helper/auth_token";

export function ProfileCard({xp_points}:{xp_points:number | undefined}) {
  const [userData, setUserData] = useState<any>()
  useEffect(() => {
    async function getUserData() {
      const data = await getTokenData();
      if (data) {
        setUserData(data);
      }
    }

    getUserData();
  }, [])
  return (
    <Card className="bg-white shadow-lg rounded-xl border-0" id="user-profile-section">
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
                  strokeDashoffset={`${2 * Math.PI * 58 * (100)}`}
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
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            </div>

            {/* Points Display */}
            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                { xp_points } Points
              </span>
            </div>

            {/* Greeting Text */}
            <h3 className="font-medium text-lg mb-1">
              Welcome, {userData?.name
                ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1)
                : ""}
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4 font-normal">Continue your journey and achieve your target</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}