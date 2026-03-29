import { useEffect, useState } from "react";
import type { Module } from "../../../types/Module";
import axiosInstance from "../../../API/axios_instance";
import { ToastHelper } from "../../ui/toast_helper/toast";
import { Toaster } from "react-hot-toast";

interface Props {
    modules: Module[];
    refresh: () => void;
}

const ModuleForm = ({ modules, refresh }: Props) => {
    const [module_name, setName] = useState("");
    const [module_description, setDescription] = useState("");
    const [duration, setDuration] = useState<number>(1);
    const [order_index, setPosition] = useState(modules.length + 1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPosition(modules.length + 1);
    }, [modules.length]);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const newModule = {
                module_name,
                module_description,
                duration,
                order_index,
            };

            if (!newModule.module_name || newModule.module_name.trim() === "") {
                ToastHelper.error("Module name cannot be empty.");
                throw new Error("ValidationError: module_name is required");
            }
            if (!newModule.module_description || newModule.module_description.trim() === "") {
                ToastHelper.error("Module description cannot be empty.");
                throw new Error("ValidationError: module_description is required");
            }
            const dur = Number(newModule.duration);
            if (newModule.duration == null || Number.isNaN(dur) || dur <= 0) {
                ToastHelper.error("Duration must be a positive number (minutes).");
                throw new Error("ValidationError: duration must be a positive number");
            }
            if (newModule.order_index == null || Number.isNaN(Number(newModule.order_index)) || Number(newModule.order_index) <= 0) {
                ToastHelper.error("Insert position must be a positive number.");
                throw new Error("ValidationError: order_index must be a positive number");
            }

            await axiosInstance.post("/module/create", newModule, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            
            setName("");
            setDescription("");
            setDuration(1);
            setPosition(modules.length + 1);
            ToastHelper.success("Module added successfully!");
            refresh();

        } catch (error) {
            console.error("Error adding module:", error);
            ToastHelper.error("Failed to add module. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
             <Toaster />
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
                        Duration (minutes)
                    </label>
                    <input
                        type="number"
                        min={1}
                        className="w-full mt-1 p-3 rounded-xl border border-gray-200 
          focus:ring-2 focus:ring-purple-500 outline-none"
                        value={duration || ""}
                        onChange={(e) => setDuration(Number(e.target.value))}
                    />
                </div>

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
                        "Add Module"
                    )}
                </button>
            </div>
        </div>
    );
};

export default ModuleForm;
