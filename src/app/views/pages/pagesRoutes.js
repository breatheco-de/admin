import React from "react";

const pagesRoutes = [
  {
    path: "/pages/user-list-1",
    component: React.lazy(() => import("./user-list/UserList1")),
  },
  {
    path: "/pages/user-list-2",
    component: React.lazy(() => import("./user-list/UserList2")),
  },
  {
    path: "/pages/user-list-3",
    component: React.lazy(() => import("./user-list/UserList3")),
  },
  {
    path: "/pages/user-list-4",
    component: React.lazy(() => import("./user-list/UserList4")),
  },
  {
    path: "/pages/product-list",
    component: React.lazy(() => import("./products/ProductList")),
  },
  {
    path: "/pages/new-product",
    component: React.lazy(() => import("./products/ProductForm")),
  },
  {
    path: "/pages/view-product",
    component: React.lazy(() => import("./products/ProductViewer")),
  },
  {
    path: "/pages/order-list",
    component: React.lazy(() => import("./orders/OrderList")),
  },
];

export default pagesRoutes;
