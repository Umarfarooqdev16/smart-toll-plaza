import axios from "axios";

export const api = axios.create({
  baseURL: "https://smart-toll-plaza-1.onrender.com/api",
});