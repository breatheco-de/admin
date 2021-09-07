import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import StudentIndicatorCards from '../shared/StudentIndicatorCards';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const StudentIndicators = ({ data, studentActivity, studentData }) => {
  const cohortCurrentDay = studentActivity[0]?.day || 1;
  const deliveredAssignments = data.filter((assignment) => assignment.task_status === 'DONE');
  const attendance = studentActivity.filter((activity) => activity.slug === 'classroom_attendance');
  const unattendance = studentActivity.filter(
    (activity) => activity.slug === 'classroom_unattendance',
  );

  const attendancePercentages = () => ({
    a_percentage: (attendance.length * 100) / cohortCurrentDay,
    u_percentage: (unattendance.length * 100) / cohortCurrentDay,
  });

  const { a_percentage } = attendancePercentages();

  const lastLogin = () => {
    let dateStr = studentActivity
      .filter((activity) => activity.slug === 'breathecode_login')
      .slice(0)[0]?.created_at;

    dateStr = dayjs(dateStr).format('MM-DD-YYYY');
    return dateStr;
  };

  return (
    <StudentIndicatorCards
      metrics={[
        { label: 'Projects Delivered', value: deliveredAssignments.length, icon: 'group' },
        { label: 'Attendance', value: `${Math.floor(a_percentage)}%`, icon: 'star' },
        { label: 'Last Login', value: lastLogin(), icon: 'group' },
        {
          label: 'Github Username',
          value: studentData.user?.profile?.github_username,
          icon: 'group',
        },
      ]}
    />
  );
};

StudentIndicators.propTypes = {
  data: PropTypes.object.isRequired,
  studentActivity: PropTypes.object.isRequired,
};

export default StudentIndicators;
