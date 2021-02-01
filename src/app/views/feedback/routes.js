import React from "react";

const routes = [
    {
        path: "/feedback/answers",
        exact: true,
        component: React.lazy(() => import("./answers.js")),
        beta: true,
    },
    {
        path: "/feedback/surveys",
        exact: true,
        component: React.lazy(() => import("./surveys.js")),
        beta: true,
    },
];

export default routes;
