import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import {
  Grid, Divider, Button, Dialog, DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import bc from '../../../services/breathecode';
import ScheduleDetails from './ScheduleDetails';
import NewSchedule from './NewSchedule';

const propTypes = {
  schedules: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const SchedulesList = ({ schedules }) => {
  const history = useHistory();
  const [newScheduleIsOpen, setNewScheduleIsOpen] = useState(false);

  const scheduleNew = () => {
    history.push('/admin/syllabus/schedules/new');
  };

  return (
    <>
      <Grid container alignItems="flex-end">
        <Grid item xs={8}>
          <h4 className="m-0 font-medium" data-cy="schedules-label">Available schedules:</h4>
        </Grid>
        <Grid item xs={4} className="text-center">
          <Button color="primary" data-cy="new-schedule" onClick={() => setNewScheduleIsOpen(true)}>
            New schedule
          </Button>
        </Grid>
      </Grid>
      <Divider className="mb-6" />
      {schedules.map((v) => <ScheduleDetails className="mb-2" key={`schedule-${v.id}`} schedule={v} />)}
      {/* <SyllabusModeDetails className="mb-2" />
      <SyllabusModeDetails className="mb-2" /> */}
      <NewSchedule isOpen={newScheduleIsOpen} setIsOpen={setNewScheduleIsOpen} />
    </>
  );
};

SchedulesList.propTypes = propTypes;
export default SchedulesList;
