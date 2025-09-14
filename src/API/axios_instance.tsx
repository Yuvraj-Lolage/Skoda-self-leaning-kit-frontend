import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"http://localhost:5000",
    // baseURL:"https://wedstra-backend-9886.onrender.com",
    headers:{
        "Content-Type":"application/json"
    },
});

export default axiosInstance;