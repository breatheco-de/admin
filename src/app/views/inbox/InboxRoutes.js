import React from "react";

const inboxRoute = [
  {
    path: "/inbox",
    exact: true,
    component: React.lazy(() => import("./AppInbox"))
  }
];

export default inboxRoute;
