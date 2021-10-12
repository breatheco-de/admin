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

const Item = ({ timeslot }) => {
  const startingHour = moment(timeslot.starting_at).local().format('HH:mm');
  const endingHour = moment(timeslot.ending_at).local().format('HH:mm');
  const weekday = moment(timeslot.starting_at).local().format('dddd');

  const getRecurrencyType = (recurrencyType) => {
    if (recurrencyType === 'DAILY') return 'DAY';
    if (recurrencyType === 'WEEKLY') return 'WEEK';
    return 'MONTH';
  };

  const deleteTimeslot = (id) => {
    //
  }

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
          <IconButton onClick={() => deleteTimeslot(timeslot?.id)}>
            <Icon fontSize="small">delete</Icon>
          </IconButton>
        </div>
      </Grid>
    </Grid>
  );
};

const SyllabusModeDetails = ({ schedule }) => {
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    const fetchTimeslots = async () => {
      try {
        const response = await bc.admissions().getAllTimeslotsBySchedule(schedule?.id);
        setTimeslots(response.data);
      } catch (error) {
        console.error(error);
        return false;
      }
      return true;
    };
    fetchTimeslots();
  }, []);

  return (
    <Card className="p-4">
      <h5 className="m-0 font-medium pb-4">{schedule?.name}:</h5>
      {timeslots.map((v) => <Item key={`timeslot-${v.id}`} timeslot={v} />)}
      <IconButton>
        <Icon fontSize="small">add_circle</Icon>
      </IconButton>
    </Card>
  );
};

SyllabusModeDetails.propTypes = {
  // className: PropTypes.string,
};

export default SyllabusModeDetails;
