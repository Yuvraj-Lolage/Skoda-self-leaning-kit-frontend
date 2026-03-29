import { useEffect, useState } from "react";
import type { Submodule } from "../../../types/SubModule";
import { ToastHelper } from "../../ui/toast_helper/toast";
import { Toaster } from "react-hot-toast";
import axiosInstance from "../../../API/axios_instance";

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
  const [fileType, setFileType] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosition(submodules.length + 1);
  }, [submodules.length]);

  const fileTypes = ["Video", "Presentation", "DeepLink", "PDF"];

  const FILE_TYPE_MIME_MAP: Record<string, string[]> = {
    Video: ["video/mp4", "video/webm", "video/ogg"],

    Presentation: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],

    PDF: ["application/pdf"],

    // Excel: [
    //   "application/vnd.ms-excel",
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // ],

    // word: [
    //   "application/msword",
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // ],

    // No file upload needed`
    DeepLink: [],
    "Wed-based content": [],
  };


  const getAcceptValue = (fileType: string) => {
    switch (fileType) {
      case "Video":
        return "video/*";
      case "Presentation":
        return ".ppt,.pptx";
      case "PDF":
        return ".pdf";
      case "Excel":
        return ".xls,.xlsx";
      case "word":
        return ".doc,.docx";
      default:
        return "*";
    }
  };

  // const getErrorMessage = (fileType: string) => {
  //   switch (fileType) {
  //     case "Video":
  //       return "Please upload a video file (MP4, WebM)";
  //     case "PDF":
  //       return "Please upload a PDF document";
  //     case "Presentation":
  //       return "Please upload a PPT or PPTX file";
  //     case "Excel":
  //       return "Please upload an Excel file";
  //     case "word":
  //       return "Please upload a Word document";
  //     default:
  //       return "Invalid file type selected";
  //   }
  // };



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) return;

    // If selected type does not require file
    if (fileType === "DeepLink" || fileType === "Wed-based content") {
      ToastHelper.info("This content type does not use file upload in this form yet.");
      e.target.value = "";
      return;
    }

    const allowedMimeTypes = FILE_TYPE_MIME_MAP[fileType];

    if (!allowedMimeTypes?.includes(selectedFile.type)) {
      ToastHelper.error(`Invalid file type for ${fileType}`);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };



  const handleSubmit = async () => {
    setLoading(true);
    if (!name.trim() || !description.trim()) {
      ToastHelper.error("Name and Description are required");
      setLoading(false);
      return;
    }

    if (!fileType) {
      ToastHelper.error("Select a file type.");
      setLoading(false);
      return;
    }

    if (!file) {
      ToastHelper.error("A file is required for this content type.");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // Append ALL fields
    formData.append("module_id", String(moduleId));
    formData.append("submodule_name", name.trim());
    formData.append("submodule_description", description.trim());
    formData.append("order_index", String(position));
    formData.append("file", file);
    formData.append("file_type", fileType);

    try {
      await axiosInstance.post(
        "/submodule/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-file-type": fileType,
          },
        }
      );

      ToastHelper.success("Submodule created successfully!");

      // reset form
      setName("");
      setDescription("");
      setPosition(submodules.length + 1);
      setFile(null);
      setFileType("");
      refresh();

    } catch (error: any) {
      console.error("Error creating submodule:", error?.response || error);
      ToastHelper.error(
        error?.response?.data?.message || "Failed to create submodule"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <Toaster />
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

        <select
          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value="" disabled>
            Select File Type
          </option>

          {fileTypes.map((fType) => (
            <option key={fType} value={fType}>
              {fType}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept={getAcceptValue(fileType)}
          disabled={fileType === "DeepLink" || fileType === "Wed-based content"}
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
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
              ></path>
            </svg>
          ) : (
            "Add Submodule"
          )}
        </button>
      </div>
    </div>
  );
};

export default SubmoduleForm;
