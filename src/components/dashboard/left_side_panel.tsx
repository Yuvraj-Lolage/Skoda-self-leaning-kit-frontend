import { ProfileCard } from "../ui/profile_card";

export function LeftPanel({ xp_points }: { xp_points: number | undefined }) {
  return (
    <div className="w-80 space-y-6">
      {/* Profile Card */}
      <ProfileCard xp_points = { xp_points } />
    </div>
  );
}