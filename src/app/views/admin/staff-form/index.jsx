import React, { useState, useEffect } from 'react';
import {
  Dialog, Icon, Button, Grid, DialogTitle, DialogActions, DialogContent, DialogContentText,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import bc from '../../../services/breathecode';
import StaffDetails from './StaffDetails';
import DowndownMenu from '../../../components/DropdownMenu';
import axios from '../../../../axios';

const options = [
  { label: 'Send password reset', value: 'password_reset' },
  { label: 'Open student profile', value: 'student_profile' },
];

const LocalizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(LocalizedFormat);

const Staff = () => {
  const { staffId } = useParams();
  // const [msg, setMsg] = useState({ alert: false, type: '', text: '' });
  const [member, setMember] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const getMemberById = () => {
    bc.auth().getAcademyMember(staffId)
      .then(({ data }) => {
        console.log(data);
        setMember(data);
      })
      .catch((error) => error);
  };
  const passwordReset = () => {
    axios.post(`${process.env.REACT_APP_API_HOST}/v1/user/password/reset`, { email: member?.user.email })
      .then(({ data }) => data)
      .catch((error) => error);
    setOpenDialog(false);
  };
  useEffect(() => {
    getMemberById();
  }, []);
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
            An email to reset password will be sent to
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {member?.user.email}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Close
            </Button>
            <Button color="primary" autoFocus onClick={() => passwordReset()}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <div>
          <h3 className="mt-0 mb-4 font-medium text-28">{`${member?.user.first_name} ${member?.user.last_name}`}</h3>
          <div className="flex">
            Member since:
            {' '}
            {dayjs(member?.created_at).format('LL')}
          </div>
        </div>
        <DowndownMenu options={options} icon="more_horiz" onSelect={({ value }) => setOpenDialog(value === 'password_reset')}>
          <Button>
            <Icon>playlist_add</Icon>
            Additional Actions
          </Button>
        </DowndownMenu>
      </div>

      <Grid container spacing={3}>
        <Grid item md={5} xs={12}>
          <StaffDetails staff_id={staffId} user={member} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Staff;
