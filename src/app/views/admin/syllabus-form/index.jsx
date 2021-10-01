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
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';
import SyllabusModes from './SyllabusModes';
import SyllabusDetails from './SyllabusDetails';
import DowndownMenu from '../../../components/DropdownMenu';

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
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
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
          <div className="flex">
            Created at:
            20 days ago
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SyllabusDetails />
        </Grid>
        <Grid item xs={12} md={6}>
          <SyllabusModes />
        </Grid>
      </Grid>
    </div>
  );
};

export default Student;
