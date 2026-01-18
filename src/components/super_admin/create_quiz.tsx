import { useEffect, useState } from "react";
import axiosInstance from "../../API/axios_instance";

interface Module {
    module_id: number;
    module_name: string;
    order_index: number;
}

interface Props {
    modules: Module[];
}

const CreateQuiz = ({ modules }: Props) => {
    const [moduleId, setModuleId] = useState<number | "">("");
    const [quizName, setQuizName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);


    useEffect(() => {
        const fetchModules = async () => {
            axiosInstance.get("/module/all", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((response) => {
                    modules = response.data.sort((a: Module, b: Module) => a.order_index - b.order_index)
                })
                .catch((error) => {
                    console.error("Error fetching modules:", error);
                });
            // const data = await getModules();
            // setModules(data.sort((a, b) => a.order_index - b.order_index));
        };
        fetchModules();
    },[])
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] ?? null;
        setFile(selectedFile);
    };

    const handleSubmit = () => {
        if (!moduleId || !quizName || !description || !file) {
            alert("All fields are required");
            return;
        }

        const formData = new FormData();
        formData.append("module_id", String(moduleId));
        formData.append("quiz_name", quizName);
        formData.append("description", description);
        formData.append("file", file);

        console.log("📦 Quiz FormData:");
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(key, {
                    name: value.name,
                    type: value.type,
                    size: value.size
                });
            } else {
                console.log(key, value);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            {/* ================= LEFT : MODULE LIST ================= */}
            <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-xl font-semibold mb-4">Module List</h2>

                <div className="space-y-3">
                    {modules.map((module, index) => (
                        <div
                            key={module.module_id}
                            className="p-4 rounded-xl border bg-gray-50"
                        >
                            <p className="font-medium">
                                {index + 1}. {module.module_name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= RIGHT : ADD QUIZ ================= */}
            <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-xl font-semibold mb-6">Add New Quiz</h2>

                <div className="space-y-4">
                    {/* Module Select */}
                    <select
                        className="w-full p-3 rounded-xl border"
                        value={moduleId}
                        onChange={(e) => setModuleId(Number(e.target.value))}
                    >
                        <option value="">Select Module</option>
                        {modules.map((module) => (
                            <option key={module.module_id} value={module.module_id}>
                                {module.module_name}
                            </option>
                        ))}
                    </select>

                    {/* Quiz Name */}
                    <input
                        type="text"
                        placeholder="Quiz Name"
                        className="w-full p-3 rounded-xl border"
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Description"
                        className="w-full p-3 rounded-xl border"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* File Upload */}
                    <input
                        type="file"
                        className="w-full p-3 rounded-xl border"
                        onChange={handleFileChange}
                    />

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 text-white rounded-xl bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                        Create Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuiz;
