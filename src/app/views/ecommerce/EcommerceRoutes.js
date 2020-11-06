import React from "react";
import { authRoles } from "../../auth/authRoles";

const ecommerceRoutes = [
  {
    path: "/ecommerce/shop",
    component: React.lazy(() => import("./Shop")),
    auth: authRoles.admin
  },
  {
    path: "/ecommerce/cart",
    component: React.lazy(() => import("./Cart")),
    auth: authRoles.admin
  },
  {
    path: "/ecommerce/checkout",
    component: React.lazy(() => import("./Checkout")),
    auth: authRoles.admin
  }
];

export default ecommerceRoutes;
