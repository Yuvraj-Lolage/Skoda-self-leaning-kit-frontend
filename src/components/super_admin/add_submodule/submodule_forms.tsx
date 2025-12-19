import { useState } from "react";
import type { Submodule } from "../../../types/SubModule";
import axiosInstance from "../../../API/axios_instance";
import axios from "axios";

interface Props {
  moduleId: number;
  submodules: Submodule[];
  refresh: () => void;
}

const SubmoduleForm = ({ moduleId, submodules, refresh }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState(submodules.length + 1);
  const [file, setFile] = useState<File | null>(null);

  // ================= FILE CHANGE =================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile && !selectedFile.type.startsWith("video/")) {
      alert("Only video files are allowed");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    console.log("Selected file:", selectedFile);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!name || !description) {
      alert("Name and description required");
      return;
    }

    if (!file) {
      alert("Video file is required");
      return;
    }

    const formData = new FormData();

    // ✅ Append ALL fields
    formData.append("module_id", String(moduleId));
    formData.append("submodule_name", name);
    formData.append("submodule_description", description);
    formData.append("order_index", String(position));
    formData.append("file", file);

    // ================= LOG FORM DATA =================
    console.log("🚀 Submitting Submodule FormData:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          type: value.type,
          size: value.size
        });
      } else {
        console.log(`${key}:`, value);
      }
    }

    try {
      // const response = await axiosInstance.post(
      //   "/submodule/create",
      //   formData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //       // ❌ DO NOT set Content-Type
      //     }
      //   }
      // );

      const response = await axios.post(
        "http://localhost:3000/submodule/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      console.log("✅ Submodule created:", response.data);

      // reset form
      setName("");
      setDescription("");
      setPosition(submodules.length + 1);
      setFile(null);
      refresh();

    } catch (error: any) {
      console.error("❌ Error creating submodule:", error?.response || error);
      alert(error?.response?.data?.message || "Failed to create submodule");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add New Submodule
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Submodule Name"
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="video/*"
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600"
          onChange={handleFileChange}
        />

        <select
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
        >
          {[...Array(submodules.length + 1)].map((_, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {idx + 1}{" "}
              {idx + 1 === submodules.length + 1 ? "(Add at End)" : ""}
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="w-full py-3 text-white rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:opacity-90"
        >
          Add Submodule
        </button>
      </div>
    </div>
  );
};

export default SubmoduleForm;
