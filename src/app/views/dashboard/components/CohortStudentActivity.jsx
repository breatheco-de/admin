import React from 'react';
import PropTypes from 'prop-types';
import { Grid, List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';

import AssignmentGrid from './AssignmentGrid';
import StudentDetailCard from '../shared/StudentDetailCard';
import StudentTimeline from './StudentTimeline';

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

const CohortStudentActivity = ({ data, studentActivity, cohortData }) => {
  const classes = useStyles();
  // const cohortCurrentDay = studentActivity[0]?.day;
  // const deliveredAssignments = data.filter((assignment) => assignment.task_status === 'DONE');
  const undeliveredAssignments = data.filter((assignment) => assignment.task_status === 'PENDING');
  // const attendance = studentActivity.filter((activity) => activity.slug === 'classroom_attendance');
  // const unattendance = studentActivity.filter(
  //   (activity) => activity.slug === 'classroom_unattendance',
  // );

  // const attendancePercentages = () => ({
  //   a_percentage: (attendance.length * 100) / cohortCurrentDay,
  //   u_percentage: (unattendance.length * 100) / cohortCurrentDay,
  // });

  // const { a_percentage, u_percentage } = attendancePercentages();

  // const lastLogin = () => {
  //   let dateStr = studentActivity
  //     .filter((activity) => activity.slug === 'breathecode_login')
  //     .slice(-1)[0]?.created_at;

  //   dateStr = dayjs(dateStr).format('MM-DD-YYYY');
  //   return dateStr;
  // };

  const {
    name, kickoff_date, ending_date, stage, teachers,
  } = cohortData;
  const startDate = dayjs(kickoff_date).format('MM-DD-YYYY');
  const endingDate = dayjs(ending_date).format('MM-DD-YYYY');
  let teachersArray;
  if (teachers) {
    const cohortTeacherArray = teachers.map((teacher) => {
      const { first_name, last_name, email } = teacher.user;
      return `${first_name} ${last_name} - ${email}`;
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
    // {
    //   icon: 'colorize',
    //   value: lastLogin(),
    //   title: 'Last Login',
    // },
  ];

  return (
    <>
      <Grid item lg={3} md={3} sm={12} xs={12}>
        <div className="px-8">
          <StudentDetailCard metrics={metrics} />
        </div>
      </Grid>
      <StudentTimeline studentActivity={studentActivity} />
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

CohortStudentActivity.propTypes = {
  data: PropTypes.array.isRequired,
  studentActivity: PropTypes.array.isRequired,
  cohortData: PropTypes.array.isRequired,
};

export default CohortStudentActivity;
