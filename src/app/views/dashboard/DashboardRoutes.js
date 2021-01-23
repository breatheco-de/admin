import React from "react";
import { authRoles } from "../../auth/authRoles";

const dashboardRoutes = [
  {
    path: "/dashboard/analytics",
    component: React.lazy(() => import("./Analytics")),
    auth: authRoles.sa,
  },
  {
    path: "/dashboard/analytics-2",
    component: React.lazy(() => import("./Analytics2")),
    auth: authRoles.sa,
  },
];

export default dashboardRoutes;
