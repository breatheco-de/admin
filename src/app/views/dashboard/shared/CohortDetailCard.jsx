import React from 'react';
import { Grid, Card, Divider } from '@material-ui/core';

export const CohortDetailCard = ({
  teachersArray, stage, endingDate, startDate, name,
}) => (
  <Grid container spacing={3}>
    <Grid item md={12} lg={12} xs={12}>
      <Card>
        <div className="p-5 flex flex-wrap justify-between items-center m--2">
          <div className="flex items-center m-2">
            <div>
              <h5 className="m-0">{name}</h5>
              <p className="mb-0 mt-2 text-muted font-normal capitalize">{stage}</p>
            </div>
          </div>
        </div>
        <Divider />
        <div className="p-5 flex flex-wrap justify-between m--2">
          <div className="flex-grow max-w-220 m-2 mr-6">
            <div className="flex justify-between items-center mb-2">
              <p className="m-0 font-medium text-muted">Start Date</p>
            </div>
            <div>
              <p>{startDate}</p>
            </div>
          </div>
          <div className="flex-grow max-w-220 m-2 ">
            <div className="flex justify-between items-center mb-2">
              <p className="m-0 font-medium text-muted">Ending Date</p>
            </div>
            <div>
              <p>{endingDate}</p>
            </div>
          </div>
        </div>
        <div className="pl-5 pr-5">
          <p className="m-0 font-medium text-muted">Teachers</p>
          {teachersArray && teachersArray.map((teacher, index) => <p key={index}>{teacher}</p>)}
        </div>
        <Divider />
      </Card>
    </Grid>
  </Grid>
);

export default CohortDetailCard;
