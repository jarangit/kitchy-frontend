import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
// Custom config interface
interface CustomConfig {
  silent?: boolean;
}
interface RequestConfig extends AxiosRequestConfig {
  customConfig?: CustomConfig;
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


export default axiosClient;
