import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import StudentIndicatorCards from '../shared/StudentIndicatorCards';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const StudentIndicators = ({ data, studentAttendance, studentData, studentActivity, cohort }) => {
  console.log("studentAttendance", studentAttendance)
  const totalProjects = data.filter((task) => task.task_type === 'PROJECT');
  const deliveredAssignments = totalProjects.filter((project) => project.task_status === 'DONE');
  const { attended, unattended, total } = studentAttendance;
  const totalDaysInCohort = attended + unattended;

  const attendancePercentages = () => {
    if (totalDaysInCohort == 0 || (attended === 0 && unattended === 0)) {
      return {
        a_percentage: 0,
      };
    }
    return {
      a_percentage: (attended * 100) / totalDaysInCohort,
    };
  };

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
        {
          label: 'Projects Delivered',
          value: `${deliveredAssignments.length} of ${totalProjects.length}`,
        },
        {
          label: 'Attendance',
          value: <div>{Math.floor(a_percentage)}% {totalDaysInCohort < cohort.current_day && <small className="d-block">Attendance missing for {(cohort.current_day - totalDaysInCohort)} days.</small>}</div>,
        },
        { label: 'Last Login', value: lastLogin(), icon: 'group' },
        {
          label: 'Github Username',
          value: studentData.user?.github?.username || 'N/A',
        },
      ]}
    />
  );
};

StudentIndicators.propTypes = {
  data: PropTypes.object.isRequired,
  cohort: PropTypes.object.isRequired,
  studentAttendance: PropTypes.object.isRequired,
  studenActivity: PropTypes.array.isRequired,
  studentData: PropTypes.object.isRequired,
};

export default StudentIndicators;
