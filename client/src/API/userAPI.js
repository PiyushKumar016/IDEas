import axios from "axios"

const API = axios.create({
    baseURL:import.meta.env.VITE_USER_API ,
    withCredentials: true,
    headers: {
    "Content-Type": "application/json",
  }
})

export const codeExecute = (code) => {
  return API.post("/runCode" , code);
}
export const postUser = (data) => {
  return API.post("/signup" , data);
}
export const getMe = () => {
  return API.get("/me");
}
export const loginUser = (data) => {
  return API.post("/login" , data);
}
export const getProjectById = (id) => {
  return API.get(`/project/${id}`);
}
export const postProject = (project) => {
  return API.post("/project" , project);
}
export const getAllProjects = () => {
  return API.get("/myProjects");
}