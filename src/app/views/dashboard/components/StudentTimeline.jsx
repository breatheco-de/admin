import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import ActivityGrid from './ActivityGrid';

const StudentTimeline = ({ studentActivity }) => {
  const [listQuantity, setListQuantity] = useState(10);
  return (
    <Grid item lg={6} md={6} sm={12} xs={12}>
      <div className="pr-8">
        {studentActivity.slice(0, listQuantity).map((activity) => (
          <ActivityGrid activity={activity} />
        ))}
        <div>
          <Button
            disabled={studentActivity.length < 10}
            fullWidth
            className="text-primary bg-light-primary"
            onClick={() => {
              setListQuantity(listQuantity + 10);
            }}
          >
            {studentActivity.length > 10 ? 'Load More' : 'No more activities to load'}
          </Button>
        </div>
      </div>
    </Grid>
  );
};

export default StudentTimeline;
