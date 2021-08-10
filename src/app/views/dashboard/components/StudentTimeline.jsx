import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import ActivityGrid from './ActivityGrid';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';

const StudentTimeline = ({ studentActivity, setQuery, query }) => {
  const [limit, setLimit] = useState(10);
  const { cohortID } = useParams();

  return (
    <Grid item lg={6} md={6} sm={12} xs={12}>
      <div className="pr-8">
        <div className="mb-12">
          <AsyncAutocomplete
            size="small"
            width="100%"
            onChange={(activity) => setQuery((prev) => ({ ...prev, slug: activity ? activity.slug : '' }))}
            asyncSearch={() => bc.activity().getActivityTypes()}
            getOptionLabel={(option) => option.slug}
          />
        </div>
        {studentActivity.slice(0, limit).map((activity, index) => (
          <ActivityGrid activity={activity} index={index} />
        ))}

        <div>
          <Button
            disabled={studentActivity.length < 10}
            fullWidth
            className="text-primary bg-light-primary"
            onClick={() => {
              setLimit(limit + 10);
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
