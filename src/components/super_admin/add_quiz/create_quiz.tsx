import { useEffect, useState } from "react";
import axiosInstance from "../../../API/axios_instance";

export default function ManageAssessments() {
  const [modules, setModules] = useState<any[]>([]);
  const [,setSubmodules] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);

  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    totalMarks: "",
    passingMarks: "",
    duration: "",
    attempts: 1
  });

  // ------------------ Load Modules ------------------
  useEffect(() => {
    axiosInstance.get("/module/all", {
        headers:{
            Authorization: `Bearer ${ localStorage.getItem('token') }`
        }
    }).then(res => {
      setModules(res.data);
    });
  }, []);

  // ------------------ Load Submodules ------------------
  useEffect(() => {
    if (!selectedModule) return;

    axiosInstance
      .get(`/submodules?moduleId=${selectedModule}`)
      .then(res => {
        setSubmodules(res.data);
        setSelectedSubmodule(null);
        setAssessments([]);
      });
  }, [selectedModule]);

  // ------------------ Load Assessments ------------------
  useEffect(() => {
    if (!selectedSubmodule) return;

    axiosInstance
      .get(`/assessments?submoduleId=${selectedSubmodule}`)
      .then(res => {
        setAssessments(res.data);
      });
  }, [selectedSubmodule]);

  // ------------------ Handlers ------------------
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddAssessment = async () => {
    if (!selectedSubmodule) return;

    await axiosInstance.post("/assessments", {
      submoduleId: selectedSubmodule,
      ...form
    });

    // reload list
    const res = await axiosInstance.get(
      `/assessments?submoduleId=${selectedSubmodule}`
    );
    setAssessments(res.data);

    setForm({
      name: "",
      description: "",
      totalMarks: "",
      passingMarks: "",
      duration: "",
      attempts: 1
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Manage Assessments
      </h2>

      {/* Module Select */}
      <div className="bg-white rounded-xl p-5 shadow">
        <label className="text-sm font-medium text-gray-600">
          Select Module
        </label>
        <select
          className="mt-2 w-full border rounded-lg p-2"
          value={selectedModule ?? ""}
          onChange={(e) => setSelectedModule(Number(e.target.value))}
        >
          <option value="">Select module</option>
          {modules.map(m => (
            <option key={m.module_id} value={m.module_id}>
              {m.order_index}. {m.module_name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Assessment List */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="text-lg font-semibold mb-4">
            Assessment List
          </h3>


          <div className="space-y-3">
            {assessments.length === 0 && (
              <p className="text-sm text-gray-500">
                No assessments found
              </p>
            )}

            {assessments.map((a, index) => (
              <div
                key={a.assessment_id}
                className="border rounded-lg p-3"
              >
                <p className="font-medium">
                  {index + 1}. {a.name}
                </p>
                <p className="text-xs text-gray-500">
                  {a.total_marks} marks · {a.duration} mins
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Add Assessment */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="text-lg font-semibold mb-4">
            Add New Assessment
          </h3>

          <div className="space-y-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Assessment Name"
              className="w-full border rounded-lg p-2"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border rounded-lg p-2"
            />

            <input
              name="totalMarks"
              value={form.totalMarks}
              onChange={handleChange}
              placeholder="Total Marks"
              type="number"
              className="w-full border rounded-lg p-2"
            />

            <input
              name="passingMarks"
              value={form.passingMarks}
              onChange={handleChange}
              placeholder="Passing Marks"
              type="number"
              className="w-full border rounded-lg p-2"
            />

            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Duration (minutes)"
              type="number"
              className="w-full border rounded-lg p-2"
            />

            <select
              name="attempts"
              value={form.attempts}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              {[1, 2, 3].map(n => (
                <option key={n} value={n}>
                  {n} Attempts
                </option>
              ))}
            </select>

            <button
              onClick={handleAddAssessment}
              className="w-full mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg py-2 font-medium hover:opacity-90"
            >
              Add Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
