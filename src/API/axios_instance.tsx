import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL:"https://skoda-self-leaning-kit-backend-production.up.railway.app",
});

/** Do not set a default Content-Type: application/json — it breaks FormData uploads
 *  (multer needs multipart boundaries set by the browser). JSON requests still get
 *  the correct header when you pass a plain object as `data`. */
axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export default axiosInstance;