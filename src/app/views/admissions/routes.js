import React from "react";

const routes = [
    {
        path: "/admissions/cohorts/new",
        exact: true,
        component: React.lazy(() => import("./cohort-form/NewCohort")),
    },
    {
        path: "/admissions/cohorts/:slug",
        exact: true,
        component: React.lazy(() => import("./cohort-form")),
    },
    {
        exact: true,
        path: "/admissions/cohorts",
        component: React.lazy(() => import("./cohorts")),
    },
    {
        path: "/admissions/students/new",
        exact: true,
        component: React.lazy(() => import("./student-form/NewStudent")),
    },
    {
        path: "/admissions/students/:stdId",
        exact: true,
        component: React.lazy(() => import("./student-form")),
    },
    {
        path: "/admissions/students",
        component: React.lazy(() => import("./students")),
    },
    {
        path: "/admissions/watchlist",
        component: React.lazy(() => import("./watchlist")),
    },
];

export default routes;
