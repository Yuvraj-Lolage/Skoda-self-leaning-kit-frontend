import { useState } from "react";
import type { Submodule } from "../../../types/SubModule";

interface Props {
  moduleId: number;
  submodules: Submodule[];
  refresh: () => void;
}

interface FileInputEvent {
  target: {
    files: FileList | null;
  };
}

const SubmoduleForm = ({ moduleId, submodules, refresh }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState(submodules.length + 1);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
  };


  const handleSubmit = async () => {
    if (!name || !description) {
      alert("Name and description required");
      return;
    }

    console.log(name, description); 
    
    const formData = new FormData();
    formData.append("module_id", String(moduleId));
    formData.append("name", name);
    formData.append("description", description);
    formData.append("insert_position", String(position));

    if (file) {
      formData.append("file", file);
    }

    console.log("file:", file);

    // FormData cannot be JSON.stringified; log its entries instead
    for (const [key, value] of formData.entries()) {
      // If value is a File, log its name and type for readability
      if (value instanceof File) {
        console.log(key, { name: value.name, type: value.type, size: value.size });
      } else {
        console.log(key, value);
      }
    }
    
    // await fetch("http://localhost:5000/api/submodules", {
    //   method: "POST",
    //   body: formData,
    // });

    setName("");
    setDescription("");
    setPosition(submodules.length + 1);
    setFile(null);

    refresh();
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
              {idx + 1} {idx + 1 === submodules.length + 1 ? "(Add at End)" : ""}
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
