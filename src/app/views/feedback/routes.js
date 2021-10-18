import React from 'react';

const routes = [
  {
    path: '/feedback/answers',
    exact: true,
    component: React.lazy(() => import('./answers')),
  },
  {
    path: '/feedback/reviews',
    exact: true,
    component: React.lazy(() => import('./reviews')),
  },
  {
    path: '/feedback/surveys',
    exact: true,
    component: React.lazy(() => import('./surveys')),
  },
  {
    path: '/feedback/surveys/:cohort/:id',
    exact: true,
    component: React.lazy(() => import('./survey-dashboard')),
  },
  {
    path: '/feedback/survey/new',
    exact: true,
    component: React.lazy(() => import('./survey-form/newSurvey')),
  },
];

export default routes;
