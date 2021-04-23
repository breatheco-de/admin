import React from "react";
import { Redirect } from "react-router-dom";

import dashboardRoutes from "./views/dashboard/DashboardRoutes";

import adminRoutes from "./views/admin/routes";
import admissionsRoutes from "./views/admissions/routes";
import eventsRoutes from "./views/events/routes";

import certificatesRoutes from "./views/certificates/certificatesRoutes"

import feedbackRoutes from "./views/feedback/routes";
import mediaRoutes from "./views/media/routes";


import materialRoutes from "./views/material-kit/MaterialRoutes";
import pageLayoutRoutes from "./views/page-layouts/PageLayoutRoutees";
import ListRoute from "./views/list/ListRoute";

import pagesRoutes from "./views/leads/pagesRoutes";

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
  ...admissionsRoutes,
  ...eventsRoutes,
  ...mediaRoutes,
  ...feedbackRoutes,
  ...materialRoutes,
  ...pageLayoutRoutes,
  ...ListRoute,
  ...pagesRoutes,
  ...certificatesRoutes,
  ...redirectRoute,
  ...errorRoute,
];

export default routes;
