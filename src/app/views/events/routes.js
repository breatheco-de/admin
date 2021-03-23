import React from "react";

const routes = [
    {
        path: "/events/settings",
        exact: true,
        component: React.lazy(() => import("./settings.js")),
    },
    {
        path: "/events/list",
        exact: true,
        component: React.lazy(() => import("./events.js")),
    },
    {
        path: "/events/NewEvent",
        exact: true,
        component: React.lazy(() => import("./forms/EventForm.js")),
    },
    {
        path: "/events/EditEvent/:id",
        exact: true,
        component: React.lazy(() => import("./forms/EventForm.js")),
    },
    {
        path: "/events/attendees",
        exact: true,
        component: React.lazy(() => import("./attendees")),
    }
];

export default routes;
