import React from 'react';

const routes = [
  {
    path: '/events/settings',
    exact: true,
    component: React.lazy(() => import('./settings')),
  },
  {
    path: '/events/list',
    exact: true,
    component: React.lazy(() => import('./events')),
  },
  {
    path: '/events/NewEvent',
    exact: true,
    component: React.lazy(() => import('./forms/EventForm')),
  },
  {
    path: '/events/event/:id',
    exact: true,
    component: React.lazy(() => import('./forms/EventForm')),
  },
  {
    path: '/events/attendees',
    exact: true,
    component: React.lazy(() => import('./attendees')),
  },
];

export default routes;
