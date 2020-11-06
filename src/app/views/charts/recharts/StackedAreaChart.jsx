import React from "react";
import {
  AreaChart,
  Area,
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
    amount: 2400
  },
  {
    name: "February",
    OnePlus: 3000,
    Mi: 1398,
    amount: 2210
  },
  {
    name: "March",
    OnePlus: 2000,
    Mi: 9800,
    amount: 2290
  },
  {
    name: "April",
    OnePlus: 2780,
    Mi: 3908,
    amount: 2000
  },
  {
    name: "May",
    OnePlus: 1890,
    Mi: 4800,
    amount: 2181
  },
  {
    name: "June",
    OnePlus: 2390,
    Mi: 3800,
    amount: 2500
  },
  {
    name: "July",
    OnePlus: 3490,
    Mi: 4300,
    amount: 2100
  },
  {
    name: "August",
    OnePlus: 3000,
    Mi: 1398,
    amount: 2210
  },
  {
    name: "September",
    OnePlus: 2000,
    Mi: 9800,
    amount: 2290
  },
  {
    name: "October",
    OnePlus: 2780,
    Mi: 3908,
    amount: 2000
  },
  {
    name: "November",
    OnePlus: 1890,
    Mi: 4800,
    amount: 2181
  },
  {
    name: "December",
    OnePlus: 2000,
    Mi: 9800,
    amount: 2290
  }
];

const StackedAreaChart = ({ height, width }) => {
  return (
    <RechartCreator height={height} width={width}>
      <AreaChart
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
        <Area
          type="monotone"
          dataKey="Mi"
          stackId="1"
          //   stroke="#8884d8"
          fill="#9068be"
        />
        <Area
          type="monotone"
          dataKey="OnePlus"
          stackId="1"
          //   stroke="#82ca9d"
          fill="#7467ef"
        />
        <Area
          type="monotone"
          dataKey="amount"
          stackId="1"
          //   stroke="#ffc658"
          fill="#6ed3cf"
        />
      </AreaChart>
    </RechartCreator>
  );
};

export default StackedAreaChart;
