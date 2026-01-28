import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card/card";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../API/axios_instance";

interface GradesPageProps {
  onBackClick: () => void;
}

export default function IndividualViewProgress({ onBackClick }: GradesPageProps) {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [modules, setModules] = useState<number[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= API CALLS ================= */

  // 1️⃣ Load modules for dropdown
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axiosInstance.get(
          "/assessment-result/my-modules",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setModules(res.data);

        // auto-select first module
        if (res.data.length > 0) {
          setSelectedModule(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to load modules", err);
      }
    };

    fetchModules();
  }, []);

  // 2️⃣ Load assessment results when module changes
  useEffect(() => {
    if (!selectedModule) return;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/assessment-result/my-progress?moduleId=${selectedModule}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResults(res.data);
      } catch (err) {
        console.error("Failed to load assessment progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [selectedModule]);

  /* ================= DATA TRANSFORM (UNCHANGED LOGIC) ================= */

  const assessmentData = useMemo(() => {
    return results.map((row) => {
      const maxScore = 100;

      const bestAttempt = row.attempts.reduce(
        (best: any, cur: any) =>
          cur.score > best.score ? cur : best,
        row.attempts[0]
      );

      const latestAttempt =
        row.attempts[row.attempts.length - 1];

      return {
        id: row.assessment_id,
        name: `Module ${row.module_id} – Assessment ${row.assessment_id}`,
        bestScore: bestAttempt.score,
        bestPercentage: Math.round(
          (bestAttempt.score / maxScore) * 100
        ),
        latestStatus:
          latestAttempt.status === "PASSED"
            ? "passed"
            : "failed",
        attempts: row.attempts.map((a: any) => ({
          attemptNumber: a.attemptNo,
          score: a.score,
          maxScore,
          date: new Date(a.attemptedAt).toLocaleDateString(),
          status:
            a.status === "PASSED" ? "passed" : "failed",
          timeSpent: `${a.duration} min`,
        })),
      };
    });
  }, [results]);

  /* ================= STATS (UNCHANGED) ================= */

  const completed = assessmentData.length;
  const passed = assessmentData.filter(
    (a) => a.latestStatus === "passed"
  ).length;

  const averageScore =
    completed > 0
      ? Math.round(
          assessmentData.reduce(
            (s, a) => s + a.bestPercentage,
            0
          ) / completed
        )
      : 0;

  const passRate =
    completed > 0
      ? Math.round((passed / completed) * 100)
      : 0;

  /* ================= HELPERS ================= */

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: string) =>
    status === "passed"
      ? "text-green-600 bg-green-50"
      : "text-red-600 bg-red-50";

  const getStatusIcon = (status: string) =>
    status === "passed" ? (
      <CheckCircle2 className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );

  /* ================= RENDER ================= */

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          <span className="text-lg">←</span>
          Back
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          Assessment Progress
        </h3>
      </div>

      <p className="text-gray-600 my-6">
        Track your assessment attempts and performance
      </p>

      {/* Module Dropdown (minimal, no redesign) */}
      <div className="mb-6">
        <label className="text-sm font-medium mr-2">
          Select Module:
        </label>
        <select
          value={selectedModule ?? ""}
          onChange={(e) =>
            setSelectedModule(Number(e.target.value))
          }
          className="border rounded-md px-3 py-1 text-sm"
        >
          {modules.map((m) => (
            <option key={m} value={m}>
              Module {m}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Average Score"
          value={`${averageScore}%`}
          icon={<TrendingUp />}
        />
        <StatCard
          title="Completed"
          value={`${completed}`}
          icon={<Award />}
        />
        <StatCard
          title="Pass Rate"
          value={`${passRate}%`}
          icon={<CheckCircle2 />}
        />
        <StatCard
          title="Achievements"
          value="3"
          icon={<Trophy />}
        />
      </div>

      {/* Table */}
      <Card className="bg-white shadow-lg rounded-xl border-0">
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-6 text-gray-500">
              Loading assessment progress...
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">
                    Assessment
                  </th>
                  <th className="text-center p-4">
                    Score
                  </th>
                  <th className="text-center p-4">
                    Attempts
                  </th>
                  <th className="text-center p-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessmentData.map((a) => {
                  const expanded = expandedRows.includes(a.id);

                  return (
                    <>
                      <tr
                        key={a.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleRow(a.id)}
                      >
                        <td className="p-4 flex items-center gap-2">
                          {expanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          {a.name}
                        </td>
                        <td className="p-4 text-center">
                          {a.bestScore}/100
                        </td>
                        <td className="p-4 text-center">
                          {a.attempts.length}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(
                              a.latestStatus
                            )}`}
                          >
                            {getStatusIcon(a.latestStatus)}
                            {a.latestStatus}
                          </span>
                        </td>
                      </tr>

                      {expanded &&
                        a.attempts.map((att:any) => (
                          <tr
                            key={`${a.id}-${att.attemptNumber}`}
                            className="bg-gray-50"
                          >
                            <td className="pl-12 py-2 text-sm">
                              Attempt {att.attemptNumber}
                            </td>
                            <td className="py-2 text-center text-sm">
                              {att.score}/{att.maxScore}
                            </td>
                            <td className="py-2 text-center text-sm">
                              {att.timeSpent}
                            </td>
                            <td className="py-2 text-center text-sm">
                              {att.date}
                            </td>
                          </tr>
                        ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= SMALL STAT CARD ================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-white shadow-lg rounded-xl border-0">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
