import React from 'react';

const routes = [
  {
    path: '/developer/settings',
    exact: true,
    component: React.lazy(() => import('./developer')),
  },
];

export default routes;