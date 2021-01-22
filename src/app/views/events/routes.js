import React from "react";

const routes = [
    {
        path: "/events/settings",
        exact: true,
        component: React.lazy(() => import("./settings.js")),
    },
];

export default routes;
