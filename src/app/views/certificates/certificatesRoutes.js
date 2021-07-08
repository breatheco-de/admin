import React from 'react';

const certificatesRoutes = [
  {
    path: '/certificates',
    exact: true,
    component: React.lazy(() => import('./certificates')),
  },
  {
    path: '/certificates/new',
    exact: true,
    component: React.lazy(() => import('./NewCertificate')),
  },
  {
    path: '/certificates/cohort/:cohortId',
    exact: true,
    component: React.lazy(() => import('./certificates')),
  },
  {
    path: '/certificates/new/:certificateSlug',
    exact: true,
    component: React.lazy(() => import('./NewCertificate')),
  },
];

export default certificatesRoutes;
