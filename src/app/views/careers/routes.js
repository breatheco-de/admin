import React from 'react';

const routes = [
  {
    path: '/career/partner/:slug',
    exact: true,
    component: React.lazy(() => import('./partner-form')),
  },
  {
    exact: true,
    path: '/career/partners',
    component: React.lazy(() => import('./partners')),
  },
  {
    path: '/career/talent/:stdId',
    exact: true,
    component: React.lazy(() => import('./talent-form')),
  },
  {
    path: '/career/talents',
    component: React.lazy(() => import('./talents')),
  },
];

export default routes;
