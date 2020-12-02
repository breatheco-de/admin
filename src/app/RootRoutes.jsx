import React from "react";
import { Redirect } from "react-router-dom";

import dashboardRoutes from "./views/dashboard/DashboardRoutes";

import adminRoutes from "./views/admin/routes";

import materialRoutes from "./views/material-kit/MaterialRoutes";
import formsRoutes from "./views/forms/FormsRoutes";
import pageLayoutRoutes from "./views/page-layouts/PageLayoutRoutees";
import ListRoute from "./views/list/ListRoute";

import pagesRoutes from "./views/pages/pagesRoutes";

const redirectRoute = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard/analytics" />,
  },
];

const errorRoute = [
  {
    component: () => <Redirect to="/session/404" />,
  },
];

const routes = [
  ...dashboardRoutes,
  ...adminRoutes,
  ...materialRoutes,
  ...pageLayoutRoutes,
  ...ListRoute,
  ...pagesRoutes,
  ...redirectRoute,
  ...errorRoute,
];

export default routes;
