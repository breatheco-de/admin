import React from "react";

const routes = [
  {
    path: "/admin/cohorts",
    component: React.lazy(() => import("./cohorts")),
  },
  {
    path: "/admin/students",
    component: React.lazy(() => import("./students")),
  },
];

export default routes;
