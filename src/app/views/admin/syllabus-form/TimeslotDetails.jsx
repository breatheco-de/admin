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
import dayjs from 'dayjs';
import bc from '../../../services/breathecode';
import ConfirmAlert from '../../../components/ConfirmAlert';
import { getSession } from '../../../redux/actions/SessionActions';

const TimeslotDetails = ({ timeslot, deleteTimeslot }) => {
  const [session] = useState(getSession());
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const startingHour = dayjs(timeslot.starting_at).tz(session.academy.timezone).format('HH:mm');
  const endingHour = dayjs(timeslot.ending_at).tz(session.academy.timezone).format('HH:mm');
  const weekday = dayjs(timeslot.starting_at).tz(session.academy.timezone).format('dddd');

  const getRecurrencyType = (recurrencyType) => {
    if (recurrencyType === 'DAILY') return 'DAY';
    if (recurrencyType === 'WEEKLY') return 'WEEK';
    return 'MONTH';
  };

  const onClickDelete = () => setDeleteDialogIsOpen(true);
  const onAccept = () => deleteTimeslot(timeslot?.specialty_mode, timeslot?.id);

  return (
    <>
      <Grid container alignItems="center">
        <Grid item xs={10}>
          <div className="flex">
            <div className="flex-grow">
              <p className="mt-0 mb-6px text-13" data-cy={`timeslot-detail-${timeslot?.id}`}>
                {'Every '}
                <span className="font-medium">{getRecurrencyType(timeslot.recurrency_type)}</span>
                {` on ${weekday} from ${startingHour} to ${endingHour}`}
              </p>
            </div>
          </div>
        </Grid>
        <Grid item xs={2} className="text-center">
          <div className="flex justify-end items-center">
            <IconButton onClick={onClickDelete} data-cy={`delete-timeslot-${timeslot?.id}`}>
              <Icon fontSize="small">delete</Icon>
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <ConfirmAlert
        isOpen={deleteDialogIsOpen}
        setIsOpen={setDeleteDialogIsOpen}
        onOpen={onAccept}
      />
    </>
  );
};

export default TimeslotDetails;
