import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_API;

const instanceAxios = axios.create({
  baseURL: baseURL,
});

export default instanceAxios;
