import React from "react";

const routes = [
    {
        path: "/provisioning/github",
        exact: true,
        component: React.lazy(() => import("./github")),
    },
];

export default routes;
