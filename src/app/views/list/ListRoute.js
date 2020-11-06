import React from "react";

const ListRoute = [
  {
    path: "/matx-list",
    exact: true,
    component: React.lazy(() => import("./AppList"))
  },
  {
    path: "/infinite-scroll",
    exact: true,
    component: React.lazy(() => import("./InfiniteList"))
  }
];

export default ListRoute;
