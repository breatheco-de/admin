import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import ActivityGrid from './ActivityGrid';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';

const StudentTimeline = ({
  studentActivity, setQuery, query, activitiesCount,
}) => {
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
        {studentActivity.map((activity, index) => (
          <ActivityGrid key={index} activity={activity} index={index} />
        ))}

        <div>
          <Button
            disabled={activitiesCount <= studentActivity.length}
            fullWidth
            className="text-primary bg-light-primary"
            onClick={() => {
              setQuery((prevQuery) => ({
                ...prevQuery,
                limit: prevQuery.limit + 10,
                offset: prevQuery.offset + 10,
              }));
            }}
          >
            {activitiesCount <= studentActivity.length
              ? 'No more activities to load'
              : 'Load More Activites'}
          </Button>
        </div>
      </div>
    </Grid>
  );
};

export default StudentTimeline;
