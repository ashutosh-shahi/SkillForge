import axios from "axios";

const api = axios.create({
  baseURL: "https://skillforge-api-yocd.onrender.com/",
  withCredentials: true,
});

export default api;