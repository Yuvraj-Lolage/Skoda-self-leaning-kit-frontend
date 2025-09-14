import toast from "react-hot-toast";
import type { ToastOptions } from "react-hot-toast";
import { CheckCircle } from "lucide-react"; // or any icon you prefer

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: "bottom-center",
};

export const ToastHelper = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: string, options?: ToastOptions) => {
    toast(message, { ...defaultOptions, ...options });
  },
  custom_success: (
    message: string,
    options?: ToastOptions & { style?: React.CSSProperties }
  ) => {
    toast(message, {
      icon: "✅", // Default green tick
      style: {
      borderRadius: '100px',
      background: '#333',
      color: '#fff',
      height:'50px',
        ...(options?.style || {}),
      },
      ...defaultOptions,
      ...options,
    });
  },


  custom_error: (
    message: string,
    options?: ToastOptions & { style?: React.CSSProperties }
  ) => {
    toast(message, {
      icon: "❌", // Red cross
      style: {
        borderRadius: "100px",
        background: "#333",
        color: "#fff",
        padding:'10px',
        height:'50px',
        ...(options?.style || {}),
      },
      ...defaultOptions,
      ...options,
    });
  },
};
