import { useState } from "react";
import { addSubmodule } from "../../api/submodules";
import { Submodule } from "../../types/submodule";

interface Props {
  moduleId: number;
  submodules: Submodule[];
  refresh: () => void;
}

const SubmoduleForm = ({ moduleId, submodules, refresh }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState(submodules.length + 1);

  const handleSubmit = async () => {
    await addSubmodule({
      module_id: moduleId,
      name,
      description,
      insert_position: position,
    });

    setName("");
    setDescription("");
    setPosition(submodules.length + 1);

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
