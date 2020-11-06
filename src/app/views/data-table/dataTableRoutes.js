import React from "react";

const dataTableRoutes = [
  {
    path: "/data-table/simple-mui-table",
    component: React.lazy(() => import("./SimpleMuiTable")),
  },
  {
    path: "/data-table/expandable-mui-table",
    component: React.lazy(() => import("./ExpandableMuiDataTable")),
  },
];

export default dataTableRoutes;
