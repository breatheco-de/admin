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
import TimeslotDetails from './TimeslotDetails';
import NewTimeslot from './NewTimeslot';

const ScheduleDetails = ({ schedule }) => {
  const [timeslots, setTimeslots] = useState([]);
  const [newTimeslotIsOpen, setNewTimeslotIsOpen] = useState(false);

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

  useEffect(() => {
    fetchTimeslots();
  }, []);

  const deleteTimeslot = async (scheduleId, timeslotId) => {
    await bc.admissions().deleteTimeslot(scheduleId, timeslotId);
    await fetchTimeslots();
  };

  return (
    <>
      <Card className="p-4">
        <h5 className="m-0 font-medium pb-4" data-cy={`schedule-title-${schedule?.id}`}>
          {schedule?.name}
          :
        </h5>
        {timeslots.map((v) => (
          <TimeslotDetails key={`timeslot-${v.id}`} timeslot={v} deleteTimeslot={deleteTimeslot} />
        ))}
        <IconButton onClick={() => setNewTimeslotIsOpen(true)} data-cy={`new-timeslot-${schedule?.id}`}>
          <Icon fontSize="small">
            add_circle
          </Icon>
        </IconButton>
      </Card>
      <NewTimeslot
        isOpen={newTimeslotIsOpen}
        setIsOpen={setNewTimeslotIsOpen}
        schedule={schedule}
      />
    </>
  );
};

ScheduleDetails.propTypes = {
  // className: PropTypes.string,
};

export default ScheduleDetails;
