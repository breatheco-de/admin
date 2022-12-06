import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Button, Card, Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';

import AssignmentGrid from './AssignmentGrid';
import StudentTimeline from './StudentTimeline';
import CohortDetailCard from '../shared/CohortDetailCard';

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

const CohortStudentActivity = ({
  data,
  studentActivity,
  studenAttendance,
  cohortData,
  setQuery,
  query,
  hasMoreActivity,
}) => {
  const classes = useStyles();
  const totalProjects = data.filter((task) => task.task_type === 'PROJECT');
  const undeliveredProjects = totalProjects.filter(
    (assignment) => assignment.task_status === 'PENDING',
  );
  const [limit, setLimit] = useState(15);
  const {
    name, kickoff_date, ending_date, stage, teachers, current_day
  } = cohortData;
  const startDate = dayjs(kickoff_date).format('MM-DD-YYYY');
  const endingDate = dayjs(ending_date).format('MM-DD-YYYY');
  let teachersArray;
  if (teachers) {
    const cohortTeacherArray = teachers.map((teacher) => {
      const { first_name, last_name } = teacher.user;
      return `${first_name} ${last_name} - ${teacher.role}`;
    });
    teachersArray = cohortTeacherArray;
  }

  const metrics = [
    {
      icon: 'colorize',
      value: name,
      title: 'Name',
    },
    {
      icon: 'colorize',
      value: startDate,
      title: 'Start Date',
    },
    {
      icon: 'colorize',
      value: endingDate,
      title: 'Ending Date',
    },
    {
      icon: 'colorize',
      value: stage,
      title: 'Stage',
    },
    {
      icon: 'colorize',
      value: teachersArray,
      title: 'Teachers',
    },
  ];

  return (
    <>
      <Grid item lg={3} md={3} sm={12} xs={12}>
        <div className="px-8">
          <CohortDetailCard
            teachersArray={teachersArray}
            stage={stage}
            currentDay={current_day}
            endingDate={endingDate}
            startDate={startDate}
            name={name}
          />
        </div>
      </Grid>
      <StudentTimeline
        studentActivity={studentActivity}
        setQuery={setQuery}
        query={query}
        hasMoreActivity={hasMoreActivity}
      />
      <Grid item lg={3} md={3} sm={12} xs={12}>
        <Card className={classes.root}>
          <div className="p-5 flex flex-wrap justify-between items-center m--2">
            <div className="flex items-center m-2">
              <div>
                <h5 className="m-0">Undelivered Projects</h5>
              </div>
            </div>
          </div>
          <Divider />
          {undeliveredProjects.length < 1 && (
            <p className="m-4 text-muted font-normal ">No pending projects</p>
          )}
          {undeliveredProjects.slice(0, limit).map((assignment, index) => (
            <AssignmentGrid
              key={assignment.id}
              data={assignment}
              classes={classes}
              isLastItem={undeliveredProjects.length - 1 === index}
            />
          ))}
        </Card>
        <div className="pt-4">
          <Button
            disabled={undeliveredProjects.length < limit}
            fullWidth
            className="text-primary bg-light-primary"
            onClick={() => {
              setLimit(limit + 10);
            }}
          >
            {undeliveredProjects.length > limit ? 'Load More' : 'No more projects to load'}
          </Button>
        </div>
      </Grid>
    </>
  );
};

CohortStudentActivity.propTypes = {
  data: PropTypes.object.isRequired,
  studentActivity: PropTypes.object.isRequired,
  cohortData: PropTypes.object.isRequired,
};

export default CohortStudentActivity;
