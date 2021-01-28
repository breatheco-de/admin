import React from "react";

const routes = [
    {
        path: "/admin/cohorts/new",
        exact: true,
        component: React.lazy(() => import("./cohort-form/NewCohort")),
    },
    {
        path: "/admin/cohorts/:slug",
        exact: true,
        component: React.lazy(() => import("./cohort-form")),
    },
    {
        exact: true,
        path: "/admin/cohorts",
        component: React.lazy(() => import("./cohorts")),
    },
    {
        path: "/admin/students/new",
        exact: true,
        component: React.lazy(() => import("./student-form/NewStudent")),
    },
    {
        path: "/admin/students/:std_id/:name",
        exact: true,
        component: React.lazy(() => import("./student-form")),
    },
    {
        path: "/admin/students",
        component: React.lazy(() => import("./students")),
    },
    {
        path: "/admin/staff/new",
        exact: true,
        component: React.lazy(() => import("./staff-form/NewStaff")),
    },
    {
        path: "/admin/staff",
        component: React.lazy(() => import("./staff")),
    },
    {
        path: "/admin/invites",
        exact: true,
        component: React.lazy(() => import("./invites")),
    }
];

export default routes;
