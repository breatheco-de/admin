import React from "react";

const pagesRoutes = [
  {
    path: "/leads/list",
    component: React.lazy(() => import("./leads")),
  },
];

export default pagesRoutes;
