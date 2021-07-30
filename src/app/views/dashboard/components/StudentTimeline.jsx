import React from 'react';
import { Grid } from '@material-ui/core';
import ActivityGrid from './ActivityGrid';

const StudentTimeline = ({ studentActivity }) => {
  console.log('student activity:', studentActivity);

  return (
    <Grid item lg={6} md={6} sm={12} xs={12}>
      <div className="pr-8">
        {studentActivity.map((activity) => (
          <ActivityGrid activity={activity} />
        ))}
      </div>
    </Grid>
  );
};

export default StudentTimeline;
