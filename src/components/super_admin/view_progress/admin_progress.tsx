import { ArrowLeft } from "lucide-react";
import { AdminLeaderboardSection } from "./admin_leaderboard_section";


interface AdminProgressPageProps {
  onBackClick: () => void;
}

export function AdminProgressPage({ onBackClick }: AdminProgressPageProps) {
  return (
    <div className="flex-1 p-3 bg-gray-50 font-sans">
      <div className="max-w-10xl mx-auto mb-4">
        <button
          type="button"
          onClick={onBackClick}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      <AdminLeaderboardSection />
    </div>
  );
}
