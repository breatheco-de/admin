import React from "react";
import { EchartCreator } from "matx";

const option = {
  backgroundColor: "rgba(0, 0, 0, 0)",
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    show: false,
  },
  legend: {
    show: false,
  },
  tooltip: { show: false },
  xAxis: {
    // type: "category",
    // data: [0, 10, 20, 30, 40, 0, 10, 20, 30, 40],
    showGrid: false,
    boundaryGap: false,
    axisLine: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  series: [
    {
      data: [
        [5.323935116038612, 0.8619856545169],
        [35.264713062959544, 26.724439915172766],
        [51.73530129825366, 6.117848837602899],
        [78.23529411764707, 34.80069535650455],
      ],
      type: "line",
      smooth: true,
      symbolSize: 0,
      lineStyle: {
        width: 2,
        color: ["rgba(255,255,255,0.87"],
      },
    },
  ],
};

const DummyChart = ({ height }) => {
  return <EchartCreator height={height} option={option} />;
};

export default DummyChart;
