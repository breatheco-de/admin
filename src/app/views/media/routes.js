import React from "react";

const routes = [
    {
        path: "/media/gallery",
        exact: true,
        component: React.lazy(() => import("./gallery")),
    },
];

export default routes;