import React from 'react';

const crudRoute = [
  {
    path: "/crud-table",
    exact: true,
    component: React.lazy(() => import("./CrudTable"))
  }
];

export default crudRoute;
