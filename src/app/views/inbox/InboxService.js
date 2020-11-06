import axios from "axios";

export const getAllMessage = () => {
  return axios.get("/api/inbox/all");
};
export const getMessageById = id => {
  return axios.get("/api/inbox", { data: id });
};
export const deleteMessage = message => {
  return axios.post("/api/inbox/delete", message);
};
export const addNewMessage = message => {
  return axios.post("/api/inbox/add", message);
};
export const updateMessage = message => {
  return axios.post("/api/inbox/update", message);
};
