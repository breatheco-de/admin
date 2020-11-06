import axios from "axios";

export const getAllList = () => {
  return axios.get("/api/list/all");
};
