import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../API/axios_instance";
import { ToastHelper } from "../ui/toast_helper/toast";
import { Toaster } from "react-hot-toast";

export function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axiosInstance.post("/user/login", { email, password });

            if (response.status === 200) {
                localStorage.setItem("token", response.data);
                setToken(response.data);
                ToastHelper.success("User login successfull!");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                ToastHelper.error("Something went wrong, please try again.");
                console.error("something went wrong");
            }
        } catch (error) {
            ToastHelper.error("Something went wrong, please try again.");
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <>
        <Toaster/>
        <div className="h-screen flex w-full">
            {/* Left Side */}
            <div className="hidden lg:flex h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white items-center justify-center p-12 relative overflow-hidden">
                <div className="relative z-10 max-w-lg text-center space-y-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                        Academyis
                    </h1>
                    <p className="text-slate-300">
                        Learning Management Platform
                    </p>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Dashboard Preview"
                            className="w-full h-48 object-cover rounded-lg opacity-80"
                        />
                    </div>

                    <h2 className="text-2xl font-semibold">
                        Transform Your Learning Journey
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                        Access comprehensive courses, track your progress, and achieve your
                        learning goals with our advanced analytics and personalized learning
                        paths.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-left">
                        {["Progress Tracking", "Expert Instructors", "Interactive Content", "Certificates"].map(
                            (feature, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                                    <span>{feature}</span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 blur-xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col items-center justify-center px-6 lg:px-12 h-full w-full mx-auto   ">

                <div className="w-1/2">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-5xl font-bold mb-2">
                            Welcome back
                        </h2>
                        <p className="text-lg ">
                            Sign in to your account to continue learning
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-base font-medium mb-2"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 px-4 border border-gray-200 rounded-xl 
                                        bg-gray-50 dark:bg-gray-800 
                                        text-gray-900 dark:text-gray-100 
                                        placeholder-gray-400 dark:placeholder-gray-500 
                                        focus:bg-white dark:focus:bg-gray-900 
                                        focus:ring-2 focus:ring-orange-500 
                                        outline-none transition"
                                placeholder="Enter your email"
                            />
                        </div>


                        <div className="w-full">
                            <label htmlFor="password" className="block text-base font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full h-12 px-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl
                                      bg-gray-50 dark:bg-gray-800 
                                        text-gray-900 dark:text-gray-100 
                                        placeholder-gray-400 dark:placeholder-gray-500 
                                        focus:bg-white dark:focus:bg-gray-900 
                                        focus:ring-2 focus:ring-orange-500 
                                        outline-none transition"
                                />
                                {/* Eye Icon inside input */}
                                <span
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 dark:text-gray-300"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </span>
                            </div>
                        </div>



                        {/* Options */}
                        <div className="flex items-center justify-end">
                            {/* <label className="flex items-center space-x-2 text-base ">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 text-orange-600 rounded-md"
                                />
                                <span>Remember me</span>
                            </label> */}
                            <a href="#" className="text-base text-orange-600 hover:text-orange-500">
                                Forgot password?
                            </a>
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
                                "Sign in"
                            )}
                        </button>

                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-base ">
                            Don’t have an account?{" "}
                            <a href="#" className="text-orange-600 hover:text-orange-500 font-semibold">
                                Sign up for free
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
