import axios from "axios";

export const getAllUser = () => {
  return axios.get("/api/user/all");
};
export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const deleteUser = User => {
  return axios.post("/api/user/delete", User);
};
export const addNewUser = User => {
  return axios.post("/api/user/add", User);
};
export const updateUser = User => {
  return axios.post("/api/user/update", User);
};
