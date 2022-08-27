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
    path: '/media/asset/new',
    exact: true,
    component: React.lazy(() => import('./components/ComposeAsset')),
  },
  {
    path: '/media/asset/:asset_slug',
    exact: true,
    component: React.lazy(() => import('./components/ComposeAsset')),
  },
  {
    path: '/media/kanban',
    exact: true,
    component: React.lazy(() => import('./kanban')),
  },
  {
    path: '/media/seo/cluster',
    exact: true,
    component: React.lazy(() => import('./clusters')),
  },
  {
    path: '/media/seo/technology',
    exact: true,
    component: React.lazy(() => import('./technologies')),
  },
];

export default routes;
