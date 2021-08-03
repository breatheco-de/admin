import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, Fab, Divider, Icon,
} from '@material-ui/core';
import dayjs from 'dayjs';
import clsx from 'clsx';

const useStyles = makeStyles(({ palette }) => ({
  cardLeftVerticalLine: {
    '&:after': {
      content: '" "',
      position: 'absolute',
      height: 35,
      width: 5,
      top: -30,
      background: palette.primary.main,
    },
  },
}));

const ActivityGrid = ({ activity, index }) => {
  const classes = useStyles();
  const { slug, created_at, data } = activity;
  const formatTitle = (slug) => {
    const text = slug.replace(/_/g, ' ');
    const result = text[0].toUpperCase() + text.substring(1);
    return result;
  };
  const icons = {
    breathecode_login: 'login',
    online_platform_registration: 'app_registration',
    public_event_attendance: 'event',
    classroom_attendance: 'app_registration',
    classroom_unattendance: 'star_outline',
    lesson_opened: 'star_outline',
    office_attendance: 'star_outline',
    nps_survey_answered: 'star_outline',
    exercise_success: 'star_outline',
    academy_registration: 'star_outline',
  };
  return (
    <div>
      <Card className="overflow-unset flex py-4">
        <div className="w-100 min-w-100 text-center">
          <Fab
            className={clsx('relative mt--14', index > 0 && classes.cardLeftVerticalLine)}
            size="medium"
            color="primary"
          >
            <Icon>{icons[slug]}</Icon>
          </Fab>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between pr-4 pb-3">
            <h5 className="m-0 font-medium capitalize">{formatTitle(slug)}</h5>
            <span className="text-muted">{dayjs(created_at).format('MM-DD-YYYY')}</span>
          </div>
          <Divider />
          <p className="m-0 pt-3">
            {`Details: ${data?.details || 'No details available from this activity'}`}
          </p>
        </div>
      </Card>
      <div className="py-7" />
    </div>
  );
};

export default ActivityGrid;
