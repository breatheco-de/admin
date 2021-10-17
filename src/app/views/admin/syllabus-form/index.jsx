import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Icon,
  Button,
  Grid,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';
import SchedulesList from './SchedulesList';
import SyllabusDetails from './SyllabusDetails';
import DowndownMenu from '../../../components/DropdownMenu';
import { MatxLoading } from '../../../../matx';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const options = [
  { label: 'Make public', value: 'make_public' },
  { label: 'Edit Syllabus Content', value: 'edit_syllabus' },
];

const LocalizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(LocalizedFormat);

const Student = () => {
  const { syllabusSlug } = useParams();
  const [syllabus, setSyllabus] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchSyllabus = async () => {
    try {
      const response = await bc.admissions().getSyllabus(syllabusSlug);
      setSyllabus(response.data);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchSyllabusPromise = fetchSyllabus();
    const fetchSchedulesPromise = fetchSchedules();
    fetchSyllabusPromise.then(() => fetchSchedulesPromise.then(() => setIsLoading(false)));
  }, []);

  const updateSyllabus = async (values) => {
    try {
      await bc.admissions().updateSyllabus(syllabus.id, values);
    } catch (error) {
      console.error(error);
    }
  };

  const howManyDaysAgo = () => {
    if (!syllabus) return 0;
    return moment().diff(syllabus.created_at, 'days');
  };

  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        {isLoading && <MatxLoading />}
        {/* This Dialog opens the modal to delete the user in the cohort */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Add new Schedule to the syllabus
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              New Schedule
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Close
            </Button>
            <Button color="primary" autoFocus>
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <div>
          <h3 className="mt-0 mb-4 font-medium text-28">
            Full Stack Web Development
          </h3>
          <div className="flex" data-cy="how-many-days-ago">
            Created at:
            {' '}
            {howManyDaysAgo()}
            {' '}
            days ago
          </div>
        </div>
        <DowndownMenu
          options={options}
          icon="more_horiz"
          onSelect={({ value }) => {
            //setOpenDialog(value === 'password_reset');
          }}
        >
          <Button>
            <Icon>playlist_add</Icon>
            Additional Actions
          </Button>
        </DowndownMenu>
      </div>

      {syllabus ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SyllabusDetails syllabus={syllabus} onSubmit={updateSyllabus} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SchedulesList schedules={schedules} />
          </Grid>
        </Grid>
      ) : ''}
    </div>
  );
};

export default Student;
