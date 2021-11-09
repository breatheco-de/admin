import React, { useState, useEffect } from 'react';
import {
  Grid, Divider, Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import bc from '../../../services/breathecode';
import ScheduleDetails from './ScheduleDetails';
import NewSchedule from './NewSchedule';

const propTypes = {
  schedules: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const SchedulesList = ({ syllabus }) => {
  const { syllabusSlug } = useParams();

  const [schedules, setSchedules] = useState([]);
  const history = useHistory();
  const [newScheduleIsOpen, setNewScheduleIsOpen] = useState(false);

  const fetchSchedules = async () => {
    try {
      const response = await bc.admissions().getAllRelatedSchedulesBySlug(syllabusSlug);
      setSchedules(response.data);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  const appendSchedule = (schedule) => {
    setSchedules([...schedules, schedule]);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

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
      <NewSchedule
        appendSchedule={appendSchedule}
        isOpen={newScheduleIsOpen}
        setIsOpen={setNewScheduleIsOpen}
        syllabus={syllabus}
      />
    </>
  );
};

SchedulesList.propTypes = propTypes;
export default SchedulesList;
