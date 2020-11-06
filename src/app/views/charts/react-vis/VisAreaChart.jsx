import React from "react";

import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  // VerticalGridLines,
  // HorizontalGridLines,
  AreaSeries,
} from "react-vis";
import { useTheme } from "@material-ui/styles";

const VisAreaChart = () => {
  const theme = useTheme();

  return (
    <FlexibleWidthXYPlot height={320}>
      {/* <VerticalGridLines />
      <HorizontalGridLines /> */}
      <XAxis
        style={{
          text: {
            stroke: "none",
            fill: theme.palette.text.secondary,
            fontWeight: 600,
          },
        }}
      />
      <YAxis
        style={{
          text: {
            stroke: "none",
            fill: theme.palette.text.secondary,
            fontWeight: 600,
          },
        }}
      />
      <AreaSeries
        className="area-series-example"
        curve="curveNatural"
        data={[
          { x: 1, y: 10 },
          { x: 2, y: 5 },
          { x: 3, y: 15 },
        ]}
      />
    </FlexibleWidthXYPlot>
  );
};

export default VisAreaChart;
