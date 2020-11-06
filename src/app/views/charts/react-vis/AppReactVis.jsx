import React from "react";
import { Breadcrumb, SimpleCard } from "matx";
import VisLineChart from "./VisLineChart";
import ColoredLineChart from "./ColoredLineChart";
import VisAreaChart from "./VisAreaChart";
import VisBarChart from "./VisBarChart";
import BigBaseBarSeries from "./BigBaseBarSeries";
import LabeledHeatmap from "./LabelledHeatMap";
import ContourSeriesChart from "./ContourSeries";

const AppReactVis = () => {
  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Charts", path: "/charts" },
            { name: "React Vis Charts" },
          ]}
        />
      </div>
      <SimpleCard title="heatmap with label">
        <LabeledHeatmap />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="line chart with many color">
        <ColoredLineChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="big base bar series">
        <BigBaseBarSeries />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="contour map">
        <ContourSeriesChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="line chart">
        <VisLineChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="area Chart">
        <VisAreaChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="bar Chart">
        <VisBarChart />
      </SimpleCard>
    </div>
  );
};

export default AppReactVis;
