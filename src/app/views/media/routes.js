import React from 'react';

const routes = [
  {
    path: '/media/gallery',
    exact: true,
    component: React.lazy(() => import('./gallery')),
  },
  {
    path: '/media/asset',
    exact: true,
    component: React.lazy(() => import('./assets')),
  },
  {
    path: '/media/kanban',
    exact: true,
    component: React.lazy(() => import('./kanban')),
  },
];

export default routes;
