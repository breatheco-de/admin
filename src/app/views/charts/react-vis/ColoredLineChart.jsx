import React, { useState, useEffect } from "react";
import { XAxis, FlexibleWidthXYPlot, YAxis, LineSeries } from "react-vis";
import { useTheme } from "@material-ui/core/styles";

const ColoredLineChart = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();

  const loadData = () => {
    let temp = [];
    for (let i = 0; i < 20; i++) {
      const series = [];
      for (let j = 0; j < 100; j++) {
        series.push({
          x: j,
          y: (i / 10 + 1) * Math.sin((Math.PI * (i + j)) / 50),
        });
      }
      temp.push({ color: i, key: i, data: series, opacity: 0.8 });
    }

    setData([...temp]);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <FlexibleWidthXYPlot
      height={320}
      colorType="linear"
      colorDomain={[0, 9]}
      colorRange={["yellow", "orange"]}
    >
      {/* <HorizontalGridLines /> */}
      {/* <VerticalGridLines /> */}
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
      {data.map((props) => (
        <LineSeries {...props} />
      ))}
    </FlexibleWidthXYPlot>
  );
};

export default ColoredLineChart;
