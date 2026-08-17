import axios from "axios";

const API_HOST = process.env.NEXT_PUBLIC_API_URL || "https://devninjas-tech-website-be.onrender.com";

const api = axios.create({
  baseURL: `${API_HOST}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;