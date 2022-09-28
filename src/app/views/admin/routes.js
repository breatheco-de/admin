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
        path: "/admin/syllabus",
        exact: true,
        component: React.lazy(() => import("./syllabus")),
    },
    {
        path: "/admin/syllabus/new",
        component: React.lazy(() => import("./syllabus-form/NewSyllabus")),
    },
    {
        path: "/admin/syllabus/:syllabusSlug",
        component: React.lazy(() => import("./syllabus-form")),
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
