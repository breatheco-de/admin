import React from 'react';
import PropTypes from 'prop-types';
import { Grid, List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AssignmentGrid from './AssignmentGrid';
import StudentDetailCard from '../shared/StudentDetailCard';
import TimelineStudentActivity from './TimelineStudentActivity';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '50ch',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '7px',
  },
  inline: {
    display: 'inline',
  },
}));

const AssignmentsInformation = ({ data }) => {
  const classes = useStyles();
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
        <List className={classes.root}>
          {undeliveredAssignments.map((assignment, index) => (
            <AssignmentGrid
              key={assignment.id}
              data={assignment}
              classes={classes}
              isLastItem={undeliveredAssignments.length - 1 === index}
            />
          ))}
        </List>
      </Grid>
    </>
  );
};

AssignmentsInformation.propTypes = {
  data: PropTypes.array.isRequired,
};

export default AssignmentsInformation;
