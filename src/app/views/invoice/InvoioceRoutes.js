import React from "react";

const invoiceRoutes = [
  {
    path: "/invoice/list",
    exact: true,
    component: React.lazy(() => import("./InvoiceList"))
  },
  {
    path: "/invoice/:id",
    component: React.lazy(() => import("./InvoiceDetails"))
  },
  {
    path: "/invoice/edit/:id",
    component: React.lazy(() => import("./InvoiceList"))
  }
];

export default invoiceRoutes;
