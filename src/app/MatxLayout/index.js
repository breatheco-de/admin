import React from 'react';

const MatxLayouts = {
  layout1: React.lazy(() => import('./Layout1/Layout1')),
  layout2: React.lazy(() => import('./Layout2/Layout2')),
};

export default MatxLayouts;
