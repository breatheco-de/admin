import React from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { RechartCreator } from "matx";

const data = [
  {
    name: "January",
    OnePlus: 4000,
    Mi: 2400,
    amt: 2400
  },
  {
    name: "February",
    OnePlus: 3000,
    Mi: 1398,
    amt: 2210
  },
  {
    name: "March",
    OnePlus: 2000,
    Mi: 9800,
    amt: 2290
  },
  {
    name: "April",
    OnePlus: 2780,
    Mi: 3908,
    amt: 2000
  },
  {
    name: "May",
    OnePlus: 1890,
    Mi: 4800,
    amt: 2181
  },
  {
    name: "June",
    OnePlus: 2390,
    Mi: 3800,
    amt: 2500
  },
  {
    name: "July",
    OnePlus: 3490,
    Mi: 4300,
    amt: 2100
  },
  {
    name: "August",
    OnePlus: 3000,
    Mi: 1398,
    amt: 2210
  },
  {
    name: "September",
    OnePlus: 2000,
    Mi: 9800,
    amt: 2290
  },
  {
    name: "October",
    OnePlus: 2780,
    Mi: 3908,
    amt: 2000
  },
  {
    name: "November",
    OnePlus: 1890,
    Mi: 4800,
    amt: 2181
  },
  {
    name: "December",
    OnePlus: 2000,
    Mi: 9800,
    amt: 2290
  }
];

const LineBarAreaComposedChart = ({ height, width }) => {
  return (
    <RechartCreator height={height} width={width}>
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
        <Bar dataKey="Mi" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="OnePlus" stroke="#ff7300" />
        {/* <Scatter dataKey="cnt" fill="red" /> */}
      </ComposedChart>
    </RechartCreator>
  );
};

export default LineBarAreaComposedChart;
