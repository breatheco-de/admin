import React from "react";
import { Breadcrumb, SimpleCard } from "matx";
import SimpleLineChart from "./SimpleLineChart";
import StackedAreaChart from "./StackedAreaChart";
import SimpleBarChart from "./SimpleBarChart";
import LineBarAreaComposedChart from "./LineBarAreaComposedChart";
import SimpleScatterChart from "./SimpleScatterChart";
import TwoSimplePieChart from "./TwoSimplePieChart";
import SimpleRadarChart from "./SimpleRadarChart";
import SimpleRadialBar from "./SimpleRadialBar";
import SimpleTreeMap from "./SimpleTreeMap";

const AppRechart = () => {
  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Charts", path: "/charts" },
            { name: "Recharts" },
          ]}
        />
      </div>
      <SimpleCard title="simple line chart">
        <SimpleLineChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="stacked area chart">
        <StackedAreaChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="simple bar Chart">
        <SimpleBarChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="line bar area composed Chart">
        <LineBarAreaComposedChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="simple scatter Chart">
        <SimpleScatterChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="two simple pie chart">
        <TwoSimplePieChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="simple radar chart">
        <SimpleRadarChart />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="simple radial chart">
        <SimpleRadialBar />
      </SimpleCard>
      <div className="py-3" />
      <SimpleCard title="simple tree map">
        <SimpleTreeMap />
      </SimpleCard>
    </div>
  );
};

export default AppRechart;
