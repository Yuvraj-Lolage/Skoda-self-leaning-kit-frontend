import { useState } from "react";
import type { Module } from "../../../types/Module";
import axiosInstance from "../../../API/axios_instance";

interface Props {
    modules: Module[];
    refresh: () => void;
}

const ModuleForm = ({ modules, refresh }: Props) => {
    const [module_name, setName] = useState("");
    const [module_description, setDescription] = useState("");
    const [duration, setDuration] = useState<number>(0);
    const [order_index, setPosition] = useState(modules.length + 1);

    const handleSubmit = async () => {

        const newModule = {
            module_name,
            module_description,
            duration,
            order_index,
        };

        console.log(JSON.stringify(newModule));
        try {
            axiosInstance.post("/module/create", newModule, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
        } catch (error) {
            console.error("Error adding module:", error);    
        }
        setName("");
        setDescription("");
        setDuration(0);
        setPosition(modules.length + 1);

        refresh();
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Module</h2>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Module Name"
                    className="w-full p-3 rounded-xl border border-gray-200 
          focus:ring-2 focus:ring-purple-500 outline-none"
                    value={module_name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    placeholder="Description"
                    className="w-full p-3 rounded-xl border border-gray-200 
          focus:ring-2 focus:ring-purple-500 outline-none"
                    value={module_description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={80}
                />

                <div>
                    <label className="text-gray-600 text-sm font-medium">
                        Insert Position
                    </label>

                    <select
                        className="w-full mt-1 p-3 rounded-xl border border-gray-200 
            focus:ring-2 focus:ring-purple-500 outline-none"
                        value={order_index}
                        onChange={(e) => setPosition(Number(e.target.value))}
                    >
                        {[...Array(modules.length + 1)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}{" "}
                                {index + 1 === modules.length + 1 ? "(Add at End)" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 text-white rounded-xl 
          bg-gradient-to-r from-purple-600 to-blue-600 
          shadow-lg hover:opacity-90 transition"
                >
                    Add Module
                </button>
            </div>
        </div>
    );
};

export default ModuleForm;
