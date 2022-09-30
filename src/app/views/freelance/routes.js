import React from "react";

const routes = [
    {
        path: "/freelance/project/new",
        exact: true,
        component: React.lazy(() => import("./project-details/NewProject")),
    },
    {
        path: "/freelance/bills",
        exact: true,
        component: React.lazy(() => import("./bills")),
    },
    // {
    //     path: "/freelance",
    //     exact: true,
    //     component: React.lazy(() => import("./freelance")),
    // },
    {
        path: "/freelance/project",
        exact: true,
        component: React.lazy(() => import("./projects")),
    },
    {
        path: "/freelance/project/:projectID",
        exact: true,
        component: React.lazy(() => import("./project-details")),
    },
    {
        path: "/invoice/:invoiceID",
        exact: true,
        public: true,
        component: React.lazy(() => import("./invoice-detail")),
    },
];

export default routes;
