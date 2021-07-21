import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import AssignmentGrid from './AssignmentGrid';
import StudentDetailCard from '../shared/StudentDetailCard';
import TimelineStudentActivity from './TimelineStudentActivity';

const AssignmentsInformation = ({ data }) => {
  const deliveredAssignments = data.filter((assignment) => assignment.task_status === 'DONE');
  const undeliveredAssignments = data.filter((assignment) => assignment.task_status === 'PENDING');

  const metrics = [
    {
      icon: 'colorize',
      value: deliveredAssignments.length,
      title: 'Projects Delivered',
    },
    {
      icon: 'colorize',
      value: deliveredAssignments.length,
      title: 'Projects Delivered',
    },
    {
      icon: 'colorize',
      value: deliveredAssignments.length,
      title: 'Projects Delivered',
    },
    {
      icon: 'colorize',
      value: deliveredAssignments.length,
      title: 'Projects Delivered',
    },
  ];

  return (
    <>
      <Grid item lg={3} md={3} sm={12} xs={12}>
        <div className="px-8">
          <StudentDetailCard metrics={metrics} />
        </div>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <TimelineStudentActivity />
      </Grid>
      <Grid item lg={3} md={3} sm={12} xs={12}>
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
