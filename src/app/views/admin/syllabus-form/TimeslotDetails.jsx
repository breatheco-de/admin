import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Divider,
  Card,
  TextField,
  Icon,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Dialog,
  Button,
  MenuItem,
  DialogActions,
  IconButton,
} from '@material-ui/core';
import bc from '../../../services/breathecode';
import moment from 'moment';

const TimeslotDetails = ({ timeslot, deleteTimeslot }) => {
  const startingHour = moment(timeslot.starting_at).local().format('HH:mm');
  const endingHour = moment(timeslot.ending_at).local().format('HH:mm');
  const weekday = moment(timeslot.starting_at).local().format('dddd');

  const getRecurrencyType = (recurrencyType) => {
    if (recurrencyType === 'DAILY') return 'DAY';
    if (recurrencyType === 'WEEKLY') return 'WEEK';
    return 'MONTH';
  };

  // const deleteTimeslot = (scheduleId, timeslotId) => {
  //   bc.admissions().deleteTimeslot(scheduleId, timeslotId);
  // };

  return (
    <Grid container alignItems="center">
      <Grid item xs={10}>
        <div className="flex">
          <div className="flex-grow">
            <p className="mt-0 mb-6px text-13">
              Every
              {' '}
              <span className="font-medium">{getRecurrencyType(timeslot.recurrency_type)}</span>
              {' '}
              on {weekday} from {startingHour} to {endingHour}
            </p>
          </div>
        </div>
      </Grid>
      <Grid item xs={2} className="text-center">
        <div className="flex justify-end items-center">
          <IconButton onClick={() => deleteTimeslot(timeslot?.specialty_mode, timeslot?.id)}>
            <Icon fontSize="small">delete</Icon>
          </IconButton>
        </div>
      </Grid>
    </Grid>
  );
};

export default TimeslotDetails;
