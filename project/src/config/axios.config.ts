import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Replace with your backend API URL
  withCredentials: true, // Ensure credentials (cookies) are sent with the request
});

// Interceptor to attach token dynamically before each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
