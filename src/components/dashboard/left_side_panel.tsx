import { Card, CardContent, CardHeader, CardTitle } from "../ui/card/card";
import { Button } from "../ui/button";
import { Code } from "lucide-react";
import { ProfileCard } from "../ui/profile_card";

export function LeftPanel({ xp_points }: { xp_points: number | undefined }) {
  return (
    <div className="w-80 space-y-6">
      {/* Profile Card */}
      <ProfileCard xp_points = { xp_points } />
    </div>
  );
}