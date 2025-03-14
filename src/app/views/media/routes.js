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
    path: '/media/new_articles',
    exact: true,
    component: React.lazy(() => import('./new_articles')),
  },
  {
    path: '/media/calendar',
    exact: true,
    component: React.lazy(() => import('./media_calendar')),
  },
  {
    path: '/media/article_comments',
    exact: true,
    component: React.lazy(() => import('./article_comments')),
  },
  {
    path: '/media/asset_errors',
    exact: true,
    component: React.lazy(() => import('./article_errors')),
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
