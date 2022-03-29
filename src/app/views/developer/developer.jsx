import React from "react";
import { Breadcrumb } from "../../../matx";
import DeveloperToken from "./DeveloperToken";

const Developer = () => {
  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Event', path: '/' }, 
            { name: 'Developer' },
          ]}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <DeveloperToken />
      </div>
    </div>
  );
};

export default Developer;
