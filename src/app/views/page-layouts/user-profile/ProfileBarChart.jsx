import React from "react";
import Chart from "react-apexcharts";

const ProfileBarChart = ({ height, color }) => {
  const option = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        columnWidth: "8px",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "transparent",
      row: {
        opacity: 0,
      },
    },
    colors: ["rgba(var(--primary), 1)"],
    xaxis: {
      categories: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "rgba(var(--body), 0.87)",
          fontSize: "14px",
          fontFamily: "Roboto, Arial, sans-serif",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      show: false,
    },
  };

  const series = [
    {
      name: "Data Use",
      data: [40, 60, 80, 100, 80, 60, 40],
    },
  ];

  return (
    <Chart
      type="bar"
      height={height}
      series={series}
      options={{
        ...option,
        color: [...color],
      }}
    />
  );
};

export default ProfileBarChart;
