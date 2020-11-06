import axios from "axios";

export const getAllBoard = () => {
  return axios.get("/api/scrum-board/all-board");
};
export const getBoardById = id => {
  return axios.get("/api/scrum-board", { data: id });
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

export const addNewBoard = title => {
  return axios.post("/api/scrum-board/add-board", title);
};
export const addNewColumnInBoard = columnData => {
  return axios.post("/api/scrum-board/add-column", columnData);
};
export const addNewCardInList = cardData => {
  return axios.post("/api/scrum-board/add-card", cardData);
};
