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

const activityTypes = {
  breathecode_login: {
    icon: 'people',
    render: (activity) => `User login at ${dayjs(activity.created_at).format('h-mm-A')}`,
  },
  online_platform_registration: {
    icon: 'app_registration',
    render: (activity) => `The Student registered on day ${activity.day}`,
  },
  public_event_attendance: {
    icon: 'event_seat',
    render: (activity) => `The Student attended to "${activity.data}" event on day ${activity.day}`,
  },
  classroom_attendance: {
    icon: 'app_registration',
    render: (activity) => `The Student attended on day ${activity.day}`,
  },
  classroom_unattendance: {
    icon: 'star_outline',
    render: (activity) => `The Student missed class on day ${activity.day}`,
  },
  lesson_opened: {
    icon: 'star_outline',
    render: (activity) => `The Student oppened a lesson on day ${activity.day}`,
  },
  office_attendance: {
    icon: 'star_outline',
    render: (activity) => `The Student attended officde on day ${activity.day}`,
  },
  nps_survey_answered: {
    icon: 'star_outline',
    render: (activity) => `The Student answered nps survey with score ${activity.data}`,
  },
  exercise_success: {
    icon: 'star_outline',
    render: (activity) => {
      const exerciseDetails = JSON.parse(activity.data);
      const { slug, editor } = exerciseDetails;
      return `${slug} was completed successfully on ${editor}`;
    },
  },
  academy_registration: {
    icon: 'app_registration',
    render: (activity) => `The Student registered to the academy on ${activity.day}`,
  },
};

const printDetails = (activity) => {
  if (activityTypes[activity.slug]) {
    if (activityTypes[activity.slug].render) {
      if (activity.day === null) {
        activity.day = '"Not Especified"';
      }
      return activityTypes[activity.slug].render(activity) || 'No Activity Details';
    }
    return 'No Render Method for this activity';
  }
  return 'Unknown Activity Type';
};

const ActivityGrid = ({ activity, index }) => {
  const classes = useStyles();
  const { slug, created_at } = activity;
  const formatTitle = (slug) => {
    const text = slug.replace(/_/g, ' ');
    const result = text[0].toUpperCase() + text.substring(1);
    return result;
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
            <Icon>{activityTypes[slug].icon}</Icon>
          </Fab>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between pr-4 pb-3">
            <h5 className="m-0 font-medium capitalize">{formatTitle(slug)}</h5>
            <span className="text-muted">{dayjs(created_at).format('MM-DD-YYYY')}</span>
          </div>
          <Divider />
          <p className="m-0 pt-3">{printDetails(activity)}</p>
        </div>
      </Card>
      <div className="py-7" />
    </div>
  );
};

export default ActivityGrid;
