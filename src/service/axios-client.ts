import axios, { type AxiosInstance } from "axios";
// Custom config interface
// interface CustomConfig {
//   silent?: boolean;
// }
// interface RequestConfig extends AxiosRequestConfig {
//   customConfig?: CustomConfig;
// }

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    // Add any request interceptors here
    // For example, you can add an authorization token if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default axiosClient;
