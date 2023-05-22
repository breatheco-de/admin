import React from 'react';

const pagesRoutes = [
  {
    path: '/growth/leads',
    exact: true,
    component: React.lazy(() => import('./leads')),
  },
  {
    path: '/growth/leads/:id',
    exact: true,
    component: React.lazy(() => import('./leads-form/NewLead')),
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
  {
    path: '/growth/sales/bulk',
    exact: true,
    component: React.lazy(() => import('./leads-form/BulkUpload')),
  },
  {
    path: '/growth/urls',
    exact: true,
    component: React.lazy(() => import('../growth/urls.jsx')),
  },
  {
    path: '/growth/newshort',
    exact: true,
    component: React.lazy(() => import('../growth/short-form/NewShort')),
  },
  {
    path: '/growth/settings',
    exact: true,
    component: React.lazy(() => import('../leads/settings')),
  },
  // {
  //   path: '/growth/urls/:slug',
  //   exact: true,
  //   component: React.lazy(() => import('./leads-form/test')),
  // },
];

export default pagesRoutes;
