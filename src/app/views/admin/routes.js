import React from 'react';

const routes = [
  {
    path: '/admin/staff/new',
    exact: true,
    component: React.lazy(() => import('./staff-form/NewStaff')),
  },
  {
    path: '/admin/staff/:staffId',
    exact: true,
    component: React.lazy(() => import('./staff-form')),
  },
  {
    path: '/admin/staff',
    component: React.lazy(() => import('./staff')),
  },
  {
    path: '/admin/invites',
    exact: true,
    component: React.lazy(() => import('./invites')),
  },
];

export default routes;
