import React from 'react';

const routes = [
  
  {
    path: '/growth/urls/:slug',
    exact: true,
    component: React.lazy(() => import('./short-form')),
  },
  
];

export default routes;
