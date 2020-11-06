import React from "react";
import {
  LineChart,
  Line,
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

const SimpleLineChart = ({ height, width }) => {
  return (
    <RechartCreator height={height} width={width}>
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line
          type="monotone"
          dataKey="Mi"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="OnePlus"
          activeDot={{ r: 5 }}
          stroke="#82ca9d"
        />
      </LineChart>
    </RechartCreator>
  );
};

export default SimpleLineChart;
