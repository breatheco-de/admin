import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import AssignmentGrid from './AssignmentGrid';
import StatCard4 from '../shared/StatCard4';

const AssignmentsInformation = ({ data }) => {
  const deliveredAssignments = data.filter((assignment) => assignment.task_status === 'DONE');
  const undeliveredAssignments = data.filter((assignment) => assignment.task_status === 'PENDING');

  const metrics = [
    {
      icon: 'colorize',
      value: deliveredAssignments.length,
      title: 'Projects Delivered',
    },
  ];

  return (
    <>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        <StatCard4 metrics={metrics} />
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={12}>
        {undeliveredAssignments.map((assignment) => (
          <AssignmentGrid key={assignment.id} data={assignment} />
        ))}
      </Grid>
    </>
  );
};

AssignmentsInformation.propTypes = {
  data: PropTypes.array.isRequired,
};

export default AssignmentsInformation;
