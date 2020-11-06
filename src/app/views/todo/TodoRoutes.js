import React from "react";

const todoRoutes = [
  {
    path: "/todo/list",
    component: React.lazy(() => import("./AppTodo"))
  }
];

export default todoRoutes;
