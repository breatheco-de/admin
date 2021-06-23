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
    {
        path: "/feedback/surveys/:id",
        exact: true,
        component: React.lazy(() => import("./survey-dashboard")),
        beta: true,
    },
    {
        path: "/feedback/survey/new",
        exact: true,
        component: React.lazy(() => import("./survey-form/newSurvey.js")),
    }
];

export default routes;