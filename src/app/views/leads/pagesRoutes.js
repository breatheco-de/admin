import React from 'react';

const pagesRoutes = [
  {
    path: '/leads/list',
    exact: true,
    component: React.lazy(() => import('./leads')),
  },
  {
    path: '/leads/won',
    exact: true,
    beta: true,
    component: React.lazy(() => import('./won.jsx')),
  },
  {
    path: '/leads/list/new',
    exact: true,
    component: React.lazy(() => import('./leads-form/NewLead')),
  },
];

export default pagesRoutes;
