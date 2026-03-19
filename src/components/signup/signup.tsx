import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../API/axios_instance";
import { ToastHelper } from "../ui/toast_helper/toast";
import { Helmet } from "react-helmet";
import signup_vdo from '../../assets/login_vdo.mp4';
import { Link, useNavigate } from "react-router-dom";

export function SignupPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSignup = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (formData.password !== formData.confirmPassword) {
    //         ToastHelper.error("Passwords do not match!");
    //         return;
    //     }
    //     try {
    //         setLoading(true);
    //         const response = await axiosInstance.post("/user/signup", formData);

    //         if (response.status === 201) {
    //             ToastHelper.success("Signup successful! Please log in.");
    //             navigate("/login", { replace: true });
    //         } else {
    //             ToastHelper.error("Something went wrong, please try again.");
    //         }
    //     } catch (error) {
    //         ToastHelper.error("Something went wrong, please try again.");
    //         console.error(error);
    //     }
    //     setLoading(false);
    // };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            ToastHelper.error("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: "User", // or dynamic if needed
            };

            const response = await axiosInstance.post("/user/signup", payload);

            if (response.status === 201) {
                ToastHelper.success("Signup successful! Please log in.");
                navigate("/login", { replace: true });
            } else {
                ToastHelper.error("Something went wrong, please try again.");
            }

        } catch (error) {
            ToastHelper.error("Something went wrong, please try again.");
            console.error(error);
        } finally {
            setLoading(false); // ✅ always runs
        }
    };

    return (
        <>
            <Helmet>
                <title>Škode | SLK - Signup</title>
            </Helmet>
            <div className="h-screen flex w-full">
                {/* Left Side - Form */}
                <div className="flex flex-col items-center justify-center px-6 lg:px-12 h-full w-full mx-auto">
                    <div className="w-full">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-5xl font-bold mb-2">
                                Create Account
                            </h2>
                            <p className="text-lg ">
                                Sign up to get started
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSignup} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-base font-medium mb-2"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 pr-10
                                    border border-gray-300 rounded-xl
                                        outline-none transition
                                        bg-white"
                                    autoComplete="off"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-base font-medium mb-2"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 pr-10
                                    border border-gray-300 rounded-xl
                                        outline-none transition
                                        bg-white"
                                    autoComplete="off"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-base font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="off"
                                        className="w-full h-12 px-4 pr-10
                                    border border-gray-300 rounded-xl
                                        outline-none transition"
                                    />
                                    <span
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 dark:text-gray-300"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-base font-medium mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        autoComplete="off"
                                        className="w-full h-12 px-4 pr-10
                                    border border-gray-300 rounded-xl
                                        outline-none transition"
                                    />
                                    <span
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 dark:text-gray-300"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </span>
                                </div>
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                className={`w-full h-12 rounded-xl font-semibold transition transform shadow-lg flex items-center justify-center
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:scale-[1.02] active:scale-[0.98] text-white"}`}
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
                                    "Sign up"
                                )}
                            </button>
                        </form>
                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-base ">
                                Already have an account?{" "}
                                <Link to="/login">
                                    <span className="text-blue-600 hover:text-blue-500 font-semibold">
                                        Log in here
                                    </span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Video */}
                <div className="hidden lg:flex h-full w-full text-white items-center justify-center p-12 relative overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    >
                        <source src={signup_vdo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </>
    );
}