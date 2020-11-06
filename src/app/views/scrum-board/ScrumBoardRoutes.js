import React from "react";

const scrumBoardRoutes = [
  {
    path: "/scrum-board/:id",
    component: React.lazy(() => import("./Board"))
  },
  {
    path: "/scrum-board",
    component: React.lazy(() => import("./AppScrumBoard"))
  }
];

export default scrumBoardRoutes;
