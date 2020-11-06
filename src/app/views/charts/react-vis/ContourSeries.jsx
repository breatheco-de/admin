import React from "react";

import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  ContourSeries,
  MarkSeriesCanvas,
  Borders,
} from "react-vis";

import { ContourData } from "./ContourData.js";

const ContourSeriesChart = () => {
  const data = ContourData;

  return (
    <FlexibleWidthXYPlot
      xDomain={[40, 100]}
      yDomain={[1.5, 8]}
      getX={(d) => d.waiting}
      getY={(d) => d.eruptions}
      height={300}
      width={700}
    >
      <ContourSeries
        animation
        className="contour-series-example"
        style={{
          stroke: "#125C77",
          strokeLinejoin: "round",
        }}
        colorRange={["#79C7E3", "#FF9833"]}
        data={data}
      />
      <MarkSeriesCanvas animation data={data} size={1} color={"#125C77"} />
      <Borders style={{ all: { fill: "#fff" } }} />
      <XAxis />
      <YAxis />
    </FlexibleWidthXYPlot>
  );
};

export default ContourSeriesChart;
