import React from "react";

const routes = [
    {
        path: "/admin/staff/new",
        exact: true,
        component: React.lazy(() => import("./staff-form/NewStaff")),
    },
    {
        path: "/admin/staff/:staffId",
        exact: true,
        component: React.lazy(() => import("./staff-form")),
    },
    {
        path: "/admin/staff",
        exact: true,
        component: React.lazy(() => import("./staff")),
    },
    {
        path: "/admissions/syllabus",
        exact: true,
        component: React.lazy(() => import("../admissions/syllabus")),
    },
    {
        path: "/admissions/syllabus/new",
        component: React.lazy(() => import("../admissions/syllabus-form/NewSyllabus")),
    },
    {
        path: "/admissions/syllabus/:syllabusSlug",
        component: React.lazy(() => import("../admissions/syllabus-form")),
    },
    {
        path: "/admin/invites",
        exact: true,
        component: React.lazy(() => import("./invites")),
    },
    {
        path: "/admin/gitpod",
        exact: true,
        component: React.lazy(() => import("./gitpod")),
    },
    {
        path: '/admin/dev-settings',
        exact: true,
        component: React.lazy(() => import('./developer')),
      },
];

export default routes;
