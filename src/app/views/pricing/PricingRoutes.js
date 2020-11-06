import React from "react";

const pricingRoutes = [
  {
    path: "/others/pricing-1",
    component: React.lazy(() => import("./Pricing1")),
  },
  {
    path: "/others/pricing-2",
    component: React.lazy(() => import("./Pricing2")),
  },
  {
    path: "/others/pricing-3",
    component: React.lazy(() => import("./Pricing3")),
  },
  {
    path: "/others/pricing-4",
    component: React.lazy(() => import("./Pricing4")),
  },
];

export default pricingRoutes;
