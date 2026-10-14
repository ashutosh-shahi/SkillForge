import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  ) {
    return "http://localhost:5000/api";
  }
  return "https://skillforge-api-yocd.onrender.com/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

export default api;