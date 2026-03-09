import axios from "axios";

const axiosInstance = axios.create({
    // baseURL:"http://localhost:3000",
    baseURL:"https://skoda-self-leaning-kit-backend-production.up.railway.app",
    headers:{
        "Content-Type":"application/json"

    },
});

export default axiosInstance;