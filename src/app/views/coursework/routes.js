import React from "react";

const routes = [
    {
        path: "/coursework/student",
        exact: true,
        component: React.lazy(() => import("./StudentDashboard")),
    },
    {
        path: "/coursework/student/:std_id",
        exact: true,
        component: React.lazy(() => import("./StudentDashboard")),
    },
];

export default routes;
