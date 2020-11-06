import React from 'react';

const calendarRoutes = [
  {
    path: "/calendar",
    exact: true,
    component: React.lazy(() => import("./MatxCalendar"))
  }
];

export default calendarRoutes;
