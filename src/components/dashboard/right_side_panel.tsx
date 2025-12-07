import { Card, CardContent, CardHeader, CardTitle } from "../ui/card/card";
import { Button } from "../ui/button";
import { Code } from "lucide-react";
import { ProfileCard } from "../ui/profile_card";

export function RightPanel() {
  return (
    <div className="w-80 space-y-6">
      {/* Profile Card */}
      <ProfileCard />

      {/* Problem of the Day */}
      <Card className="bg-white shadow-lg rounded-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-600" />
            Problem of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-medium mb-2">Array Rotation</h3>
              <p className="text-sm text-gray-600">
                Solve Array Rotation in JavaScript
              </p>
            </div>
            <Button variant="outline" className="w-full">
              Start Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}