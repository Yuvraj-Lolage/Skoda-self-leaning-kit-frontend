import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Lock,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../ui/card/card";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../API/axios_instance";

export default function IndividualViewProgress() {

  /* ================= STATE ================= */
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");



  /* ================= FETCH MODULE PROGRESS ================= */
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await axiosInstance.get("/learning-progress/catalog", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setModules(res.data.modules);

        // ✅ auto select first module
        if (res.data.modules.length > 0) {
          setSelectedModule(res.data.modules[0].module_id);
        }

      } catch (err) {
        console.error("Failed to load modules", err);
      }
    };

    fetchCatalog();
  }, []);

  /* ================= FETCH ASSESSMENTS ================= */
  useEffect(() => {
    if (!selectedModule) return;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/assessment-result/my-progress?moduleId=${selectedModule}`,
          {
            headers: { Authorization: `Bearer ${token}` },
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

  /* ================= MODULE STATUS STYLE ================= */

  const getModuleStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50";
      case "in_progress":
        return "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50";
      case "locked":
        return "border-gray-300 bg-gray-100 opacity-70";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "locked":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* ================= ASSESSMENT LOGIC (UNCHANGED) ================= */

  const assessmentData = useMemo(() => {
    const passPercentage = 50;

    return results.map((row) => {
      const maxScore = 10;

      const bestAttempt = row.attempts.reduce(
        (best: any, cur: any) =>
          cur.score > best.score ? cur : best,
        row.attempts[0]
      );

      const bestPercentage = Math.round(
        (bestAttempt.score / maxScore) * 100
      );

      return {
        id: row.assessment_id,
        name: `Module ${row.module_id} – Assessment ${row.assessment_id}`,
        bestScore: bestAttempt.score,
        bestPercentage,
        latestStatus:
          bestPercentage >= passPercentage ? "passed" : "failed",
        attempts: row.attempts.map((a: any) => ({
          attemptNumber: a.attemptNo,
          score: a.score,
          maxScore,
          date: new Date(a.attemptedAt).toLocaleDateString(),
          status: a.status === "PASSED" ? "passed" : "failed",
          timeSpent: `${a.duration} min`,
        })),
      };
    });
  }, [results]);

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
    <div className="flex-1 p-4 bg-gray-50">

      {/* ================= MODULES SECTION ================= */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Learning Progress
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => {
            const progress =
              m.submodule_count > 0
                ? Math.round(
                  (m.completed_submodule_count /
                    m.submodule_count) *
                  100
                )
                : 0;

            return (
              <Card
                key={m.module_id}
                className={`border-l-4 shadow-md rounded-xl ${getModuleStyle(
                  m.status
                )}`}
              >
                <CardContent className="p-5">

                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">
                      {m.name}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                        m.status
                      )}`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {m.description}
                  </p>

                  {/* PROGRESS BAR */}
                  <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                    <div
                      className={`h-2 rounded-full ${m.status === "completed"
                        ? "bg-green-500"
                        : m.status === "in_progress"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                        }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    {m.completed_submodule_count} /{" "}
                    {m.submodule_count} completed
                  </p>

                  {/* LOCK ICON */}
                  {m.status === "locked" && (
                    <div className="mt-2 flex items-center text-gray-500 text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <Card className="bg-white shadow-lg rounded-xl border-0">
        <CardContent>
          <div className="mb-5 pt-5 px-5 pb-0">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Assessment Results
            </h2>

            {/* Dropdown */}
            <div className="w-full md:w-72">
              <select
                value={selectedModule ?? ""}
                onChange={(e) => setSelectedModule(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 hover:border-gray-400 transition"
              >
                {modules.map((m) => (
                  <option key={m.module_id} value={m.module_id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loading ? (
            <p className="text-center py-6 text-gray-500">
              Loading assessment progress...
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Assessment</th>
                  <th className="text-center p-4">Score</th>
                  <th className="text-center p-4">Attempts</th>
                  <th className="text-center p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                { assessmentData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No assessments found for this module.
                    </td>
                  </tr>
                ) : (
                  assessmentData.map((a) => {
                  const expanded = expandedRows.includes(a.id);

                  return (
                    <>
                      <tr
                        key={a.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleRow(a.id)}
                      >
                        <td className="p-4 flex items-center gap-2">
                          {expanded ? <ChevronDown /> : <ChevronRight />}
                          {a.name}
                        </td>
                        <td className="text-center">{a.bestScore}/10</td>
                        <td className="text-center">{a.attempts.length}</td>
                        <td className="text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              a.latestStatus
                            )}`}
                          >
                            {getStatusIcon(a.latestStatus)}
                            <span className="capitalize">{a.latestStatus}</span>
                          </span>
                        </td>
                      </tr>

                      {expanded &&
                        a.attempts.map((att: any) => (
                          <tr key={`${a.id}-${att.attemptNumber}`} className="bg-gray-50">
                            <td className="pl-12 py-2 text-sm">
                              Attempt {att.attemptNumber}
                            </td>
                            <td className="text-center">{att.score}/{att.maxScore}</td>
                            <td className="text-center">{att.timeSpent}</td>
                            <td className="text-center">{att.date}</td>
                          </tr>
                        ))}
                    </>
                  );
                }))} 
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}