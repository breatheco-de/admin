import React, { useState, useEffect } from "react";
import * as _ from "lodash";
import {
  VictoryChart,
  VictoryTheme,
  VictoryStack,
  VictoryArea,
  VictoryContainer,
} from "victory";

import { useTheme } from "@material-ui/styles";

const VictoryAreaAnimation = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();

  const getData = () => {
    return _.range(7).map(() => {
      return [
        { x: 1, y: _.random(1, 5) },
        { x: 2, y: _.random(1, 10) },
        { x: 3, y: _.random(2, 10) },
        { x: 4, y: _.random(2, 10) },
        { x: 5, y: _.random(2, 15) },
      ];
    });
  };

  useEffect(() => {
    setData(getData());
    let setStateInterval = setInterval(() => {
      setData(getData());
    }, 4000);

    return () => clearInterval(setStateInterval);
  }, []);

  return (
    <div className="h-320">
      <VictoryChart
        width={700}
        containerComponent={<VictoryContainer responsive={true} />}
        theme={VictoryTheme.material}
        animate={{ duration: 1000 }}
        style={{
          label: { fontSize: 45, fill: theme.palette.text.secondary },
        }}
      >
        <VictoryStack colorScale={"blue"}>
          {data.map((data, i) => {
            return <VictoryArea key={i} data={data} interpolation={"basis"} />;
          })}
        </VictoryStack>
      </VictoryChart>
    </div>
  );
};

export default VictoryAreaAnimation;
