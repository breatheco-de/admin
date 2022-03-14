import React from 'react';

const routes = [
  {
    path: '/mentors/staff/new',
    exact: true,
    component: React.lazy(() => import('./staff-form/NewMentor')),
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
  {
    path: '/mentors/services/:serviceID',
    exact: true,
    component: React.lazy(() => import('./service-details')),
  },
  {
    path: '/mentors/service/new',
    exact: true,
    component: React.lazy(() => import('./service-details/NewService')),
  },
];

export default routes;
