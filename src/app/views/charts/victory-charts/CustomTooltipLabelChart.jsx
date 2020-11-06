import React from "react";
import { VictoryLabel, VictoryTooltip, VictoryPie } from "victory";

const CustomLabel = (props = {}) => {
  return (
    <g>
      <VictoryLabel {...props} />
      <VictoryTooltip
        {...props}
        text={`# ${props.text}`}
        style={{ fill: "white" }}
        x={200}
        y={250}
        orientation="top"
        pointerLength={0}
        cornerRadius={50}
        flyoutWidth={100}
        flyoutHeight={100}
        flyoutStyle={{ fill: "black" }}
      />
    </g>
  );
};

CustomLabel.defaultEvents = VictoryTooltip.defaultEvents;

const CustomTooltipLableChart = () => {
  return (
    <div className="flex justify-center">
      <div style={{ width: "300px" }}>
        <VictoryPie
          style={{ labels: { fill: "white" } }}
          innerRadius={100}
          labelRadius={120}
          labels={(d) => d.y}
          labelComponent={<CustomLabel />}
          data={[
            { x: 1, y: 5 },
            { x: 2, y: 4 },
            { x: 3, y: 2 },
            { x: 4, y: 3 },
            { x: 5, y: 1 },
          ]}
        />
      </div>
    </div>
  );
};

export default CustomTooltipLableChart;
