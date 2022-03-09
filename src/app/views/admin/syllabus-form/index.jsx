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
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';
import SchedulesList from './SchedulesList';
import SyllabusDetails from './SyllabusDetails';
import DowndownMenu from '../../../components/DropdownMenu';
import { MatxLoading } from '../../../../matx';
import ConfirmAlert from '../../../components/ConfirmAlert';
import { getSession } from '../../../redux/actions/SessionActions';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

// TODO: this require in this context is weird
const LocalizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(LocalizedFormat);

const Student = () => {
  const { syllabusSlug } = useParams();
  const session = getSession();
  const [syllabus, setSyllabus] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [makePublicDialog, setMakePublicDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const options = [
    { label: `Make ${syllabus?.private ? 'public' : 'private'}`, value: 'make_public' },
    { label: 'Edit Syllabus Content', value: 'edit_syllabus' },
  ];

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
    fetchSyllabusPromise.then(() => setIsLoading(false));
  }, []);

  const updateSyllabus = async (values) => {
    try {
      await bc.admissions().updateSyllabus(syllabus?.id, values);
      fetchSyllabus();
    } catch (error) {
      console.error(error);
    }
  };

  const howManyDaysAgo = () => {
    if (!syllabus) return 0;
    return dayjs().diff(syllabus.created_at, 'days');
  };

  const onAccept = () => updateSyllabus({ private: !syllabus.private });

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
            {syllabus?.name}
          </h3>
          <div className="flex" data-cy="how-many-days-ago">
            {`Created at: ${howManyDaysAgo()} days ago`}
          </div>
        </div>
        <DowndownMenu
          options={options}
          icon="more_horiz"
          onSelect={({ value }) => {
            if (value === 'edit_syllabus') {
              window.open(`https://build.breatheco.de/?token=${session.token}`, '_blank');
            } else if (value === 'make_public') {
              setMakePublicDialog(true);
            }
          }}
        >
          <Button data-cy="additional-actions">
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
            <SchedulesList syllabus={syllabus} />
          </Grid>
        </Grid>
      ) : ''}
      <ConfirmAlert
        title={`Are you sure you want to make ${syllabus?.private ? 'public' : 'private'} this syllabus`}
        isOpen={makePublicDialog}
        setIsOpen={setMakePublicDialog}
        onOpen={onAccept}
      />
    </div>
  );
};

export default Student;
