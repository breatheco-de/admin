import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import StudentIndicatorCards from '../shared/StudentIndicatorCards';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const StudentIndicators = ({ data, studenAttendance, studentData }) => {
  const totalProjects = data.filter((task) => task.task_type === 'PROJECT');
  const deliveredAssignments = totalProjects.filter((project) => project.task_status === 'DONE');
  const attendance = studenAttendance.filter(
    (activity) => activity.slug === 'classroom_attendance',
  );
  const unattendance = studenAttendance.filter(
    (activity) => activity.slug === 'classroom_unattendance',
  );
  const totalDaysInCohort = attendance.length + unattendance.length;

  const attendancePercentages = () => {
    if (attendance.length === 0 && unattendance.length === 0) {
      return {
        a_percentage: 0,
      };
    }
    return {
      a_percentage: (attendance.length * 100) / totalDaysInCohort,
    };
  };

  const { a_percentage } = attendancePercentages();

  const lastLogin = () => {
    let dateStr = studenAttendance
      .filter((activity) => activity.slug === 'breathecode_login')
      .slice(0)[0]?.created_at;

    dateStr = dayjs(dateStr).format('MM-DD-YYYY');
    return dateStr;
  };

  return (
    <StudentIndicatorCards
      metrics={[
        {
          label: 'Projects Delivered',
          value: `${deliveredAssignments.length} of ${totalProjects.length}`,
          icon: 'group',
        },
        {
          label: 'Attendance',
          value: `${Math.floor(a_percentage)}%`,
          icon: 'star',
        },
        { label: 'Last Login', value: lastLogin(), icon: 'group' },
        {
          label: 'Github Username',
          value: studentData.user?.github?.username || 'N/A',
          icon: 'group',
        },
      ]}
    />
  );
};

StudentIndicators.propTypes = {
  data: PropTypes.object.isRequired,
  studenAttendance: PropTypes.object.isRequired,
  studentData: PropTypes.object.isRequired,
};

export default StudentIndicators;
