import React from "react";
import { scaleLinear } from "d3-scale";

import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  HeatmapSeries,
  LabelSeries,
  Hint,
} from "react-vis";
import { useTheme } from "@material-ui/styles";

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const data = alphabet.reduce((acc, letter1, idx) => {
  return acc.concat(
    alphabet.map((letter2, jdx) => ({
      x: `${letter1}1`,
      y: `${letter2}2`,
      color: (idx + jdx) % Math.floor(jdx / idx) || idx,
    }))
  );
}, []);
const { min, max } = data.reduce(
  (acc, row) => ({
    min: Math.min(acc.min, row.color),
    max: Math.max(acc.max, row.color),
  }),
  { min: Infinity, max: -Infinity }
);

const LabeledHeatmap = () => {
  const value = false;
  const theme = useTheme();

  const exampleColorScale = scaleLinear()
    .domain([min, (min + max) / 2, max])
    .range(["orange", "white", "cyan"]);

  return (
    <FlexibleWidthXYPlot
      xType="ordinal"
      xDomain={alphabet.map((letter) => `${letter}1`)}
      yType="ordinal"
      yDomain={alphabet.map((letter) => `${letter}2`).reverse()}
      margin={50}
      height={500}
    >
      <XAxis
        orientation="top"
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
      <HeatmapSeries
        colorType="literal"
        getColor={(d) => exampleColorScale(d.color)}
        style={{
          stroke: "white",
          strokeWidth: "2px",
          rectStyle: {
            rx: 10,
            ry: 10,
          },
        }}
        className="heatmap-series-example"
        data={data}
        onValueMouseOver={(v) => this.setState({ value: v })}
        onSeriesMouseOut={(v) => this.setState({ value: false })}
      />
      <LabelSeries
        style={{ pointerEvents: "none" }}
        data={data}
        labelAnchorX="middle"
        labelAnchorY="baseline"
        getLabel={(d) => `${d.color}`}
      />
      {value !== false && <Hint value={value} />}
    </FlexibleWidthXYPlot>
  );
};

export default LabeledHeatmap;
