import React, { useState, useEffect, useRef } from "react";
import { VictoryPie, VictoryAnimation, VictoryLabel } from "victory";
import { useTheme } from "@material-ui/core/styles";

const CircularProgressBar = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const percent = useRef(0);

  useEffect(() => {
    setData(getData(percent.current));

    let setStateInterval = setInterval(() => {
      percent.current += 25;
      percent.current = percent.current > 100 ? 0 : percent.current;
      setData(getData(percent.current));
    }, 2000);

    return () => {
      if (setStateInterval) clearInterval(setStateInterval);
    };
  }, []);

  const getData = (percent) => {
    return [
      { x: 1, y: percent },
      { x: 2, y: 100 - percent },
    ];
  };

  return (
    <div style={{ height: "320px" }}>
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        <VictoryPie
          standalone={false}
          animate={{ duration: 1000 }}
          width={400}
          height={400}
          data={data}
          innerRadius={120}
          cornerRadius={25}
          labels={() => null}
          style={{
            data: {
              fill: (d) => {
                const color = d.y > 30 ? "green" : "red";
                return d.x === 1 ? color : "transparent";
              },
            },
          }}
        />
        <VictoryAnimation
          duration={1000}
          data={{ percent: percent.current, data }}
        >
          {(newProps) => {
            return (
              <VictoryLabel
                textAnchor="middle"
                verticalAnchor="middle"
                x={200}
                y={200}
                text={`${Math.round(newProps.percent)}%`}
                style={{ fontSize: 45, fill: theme.palette.text.secondary }}
              />
            );
          }}
        </VictoryAnimation>
      </svg>
    </div>
  );
};

export default CircularProgressBar;
