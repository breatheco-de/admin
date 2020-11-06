import axios from "axios";

export const getAllTodo = () => {
  return axios.get("/api/todo/all");
};

export const getTodoById = todoId => {
  return axios.get("/api/todo", { data: todoId });
};

export const reorderTodoList = todoList => {
  return axios.post("/api/todo/reorder", { todoList });
};

export const addTodo = todo => {
  return axios.post("/api/todo/add", { todo });
};

export const updateTodoById = todo => {
  return axios.post("/api/todo/update", { todo });
};

export const deleteTodo = todo => {
  return axios.post("/api/todo/delete", { todo });
};

// tag management

export const getAllTodoTag = () => {
  return axios.get("/api/todo/tag");
};

export const addNewTag = tag => {
  return axios.post("/api/todo/tag/add", { tag });
};

export const deleteTag = tag => {
  return axios.post("/api/todo/tag/delete", { tag });
};
