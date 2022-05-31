import React from "react";

const routes = [
    {
        path: "/mentors/new",
        exact: true,
        component: React.lazy(() => import("./mentor-form/NewMentor")),
    },
    {
        path: "/mentors/services",
        exact: true,
        component: React.lazy(() => import("./services")),
    },
    {
        path: "/mentors/sessions",
        exact: true,
        component: React.lazy(() => import("./sessions")),
    },
    {
        path: "/mentors/:staffId",
        exact: true,
        component: React.lazy(() => import("./mentor-form")),
    },
    {
        path: "/mentors",
        exact: true,
        component: React.lazy(() => import("./mentors")),
    },
    {
        path: "/mentors/services/:serviceID",
        exact: true,
        component: React.lazy(() => import("./service-details")),
    },
    {
        path: "/mentors/service/new",
        exact: true,
        component: React.lazy(() => import("./service-details/NewService")),
    },
    {
        path: "/mentors/:mentorID/invoice/:invoiceID",
        exact: true,
        component: React.lazy(() => import("./invoice-detail")),
    },
];

export default routes;
