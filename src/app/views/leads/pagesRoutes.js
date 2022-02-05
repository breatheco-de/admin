import React from 'react';

const pagesRoutes = [
  {
    path: '/growth/leads',
    exact: true,
    component: React.lazy(() => import('./leads')),
  },
  {
    path: '/growth/reviews',
    exact: true,
    component: React.lazy(() => import('./reviews')),
  },
  {
    path: '/growth/sales',
    exact: true,
    beta: true,
    component: React.lazy(() => import('./won.jsx')),
  },
  {
    path: '/growth/sales/new',
    exact: true,
    component: React.lazy(() => import('./leads-form/NewLead')),
  },
];

export default pagesRoutes;
