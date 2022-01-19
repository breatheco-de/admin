import React from 'react';

const routes = [
  {
    path: '/mentors/staff/new',
    exact: true,
    component: React.lazy(() => import('./staff-form/NewStaff')),
  },
  {
    path: '/mentors/staff/:staffId',
    exact: true,
    component: React.lazy(() => import('./staff-form')),
  },
  {
    path: '/mentors/staff',
    exact: true,
    component: React.lazy(() => import('./mentors')),
  },
  {
    path: '/mentors/sessions',
    exact: true,
    component: React.lazy(() => import('./sessions')),
  },
  {
    path: '/mentors/services',
    exact: true,
    component: React.lazy(() => import('./services')),
  },
];

export default routes;
