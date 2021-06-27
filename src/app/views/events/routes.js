/* eslint-disable import/extensions */
import React from 'react';

const routes = [
  {
    path: '/events/settings',
    exact: true,
    component: React.lazy(() => import('./settings.jsx')),
  },
  {
    path: '/events/list',
    exact: true,
    component: React.lazy(() => import('./events.jsx')),
  },
  {
    path: '/events/NewEvent',
    exact: true,
    component: React.lazy(() => import('./forms/EventForm.jsx')),
  },
  {
    path: '/events/EditEvent/:id',
    exact: true,
    component: React.lazy(() => import('./forms/EventForm.jsx')),
  },
  {
    path: '/events/attendees',
    exact: true,
    component: React.lazy(() => import('./attendees')),
  },
];

export default routes;
