import React from 'react';

const chartsRoute = [
  {
    path: "/charts/echarts",
    component: React.lazy(() => import("./echarts/AppEchart"))
  },
  {
    path: "/charts/recharts",
    component: React.lazy(() => import("./recharts/AppRechart"))
  },
  {
    path: "/charts/victory-charts",
    component: React.lazy(() => import("./victory-charts/AppVictoryChart"))
  },
  {
    path: "/charts/react-vis",
    component: React.lazy(() => import("./react-vis/AppReactVis"))
  }
];

export default chartsRoute;
