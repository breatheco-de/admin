import React from 'react';

const pagesRoutes = [
  {
    path: '/leads/list',
    exact: true,
    component: React.lazy(() => import('./leads')),
  },
  {
    path: '/leads/upcoming',
    exact: true,
    beta: true,
    component: React.lazy(() => import('./upcoming')),
  },
  {
    path: '/leads/list/new',
    exact: true,
    component: React.lazy(() => import('./leads-form/NewLead')),
  },
];

export default pagesRoutes;
