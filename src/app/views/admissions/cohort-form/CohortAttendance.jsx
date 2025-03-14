import React, { useEffect, useState } from 'react';
import { Card, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import bc from '../../../services/breathecode';

const useStyles = makeStyles(() => ({
  heatmap: {
    display: 'grid',
    gap: '2px',
  },
  week: {
    display: 'grid',
    gridTemplateRows: 'repeat(7, 1fr)',
    gap: '2px',
  },
  day: {
    width: '100%',
    padding: '10px',
    textAlign: 'center',
    color: '#fff',
  },
}));

const getColor = (attendancePercentage) => {
  const red = 255 - Math.round(attendancePercentage * 255);
  const green = Math.round(attendancePercentage * 138);
  return `rgb(${red}, ${green}, 108)`;
};

const groupDatesByWeek = (dates) => {
  const sortedDates = dates.map(date => dayjs(date)).sort((a, b) => a - b);
  const startDate = sortedDates[0];
  const weeks = {};

  sortedDates.forEach(date => {
    const diffInDays = date.diff(startDate, 'day');
    const weekNumber = Math.floor(diffInDays / 7);

    if (!weeks[weekNumber]) {
      weeks[weekNumber] = [];
    }
    weeks[weekNumber].push(date.format('YYYY-MM-DD'));
  });

  return weeks;
};

const Week = ({ week, attendanceData }) => {
  const classes = useStyles();
  return (
    <div className={classes.week}>
      {week.map((date, dayIndex) => {
        if (!date) return null;
        const day = attendanceData.find(d => d.date === date) || { attendance_ids: [], unattendance_ids: [] };
        const total = day.attendance_ids.length + day.unattendance_ids.length;
        const attendancePercentage = total ? day.attendance_ids.length / total : 0;
        const formattedDate = dayjs(date).format('MMM D');
        return (
          <div
            key={dayIndex}
            className={classes.day}
            style={{ backgroundColor: getColor(attendancePercentage) }}
          >
            <div>{formattedDate}</div>
            <div>{`${day.attendance_ids.length}/${total}`}</div>
          </div>
        );
      })}
    </div>
  );
};

const Year = ({ weeks, attendanceData }) => {
  const classes = useStyles();
  return (
    <div className={classes.heatmap} style={{ gridTemplateColumns: `repeat(${Object.keys(weeks).length}, 1fr)` }}>
      {Object.values(weeks).map((week, weekIndex) => (
        <Week key={weekIndex} week={week} attendanceData={attendanceData} />
      ))}
    </div>
  );
};

const CohortAttendance = ({ cohortId }) => {
  const classes = useStyles();
  const [attendanceData, setAttendanceData] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);

  useEffect(() => {
    bc.admissions().getCohortLog(cohortId)
      .then((response) => {
        const attendance = Object.entries(response.data).map(([date, day]) => ({
          date,
          attendance_ids: day.attendance_ids,
          unattendance_ids: day.unattendance_ids,
        }));
        setAttendanceData(attendance);
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
      });

    bc.events().getLiveClasses(cohortId)
      .then((response) => {
        setLiveClasses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching live classes:', error);
      });
  }, [cohortId]);

  const liveClassDates = liveClasses.map(liveClass => liveClass.starting_at);
  const weeks = groupDatesByWeek(liveClassDates);

  return (
    <Card elevation={3} className="pt-5 mb-6">
      <Typography variant="h6" className="px-6 mb-3">Attendance calendar</Typography>
      <Year weeks={weeks} attendanceData={attendanceData} />
    </Card>
  );
};

export default CohortAttendance;
