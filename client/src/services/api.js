import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const calculateRmd = async (data) => {
  const res = await API.post("/rmd/calculate", data);
  return res.data;
};