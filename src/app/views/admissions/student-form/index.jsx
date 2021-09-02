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
import StudentCohorts from './StudentCohorts';
import StudentDetails from './StudentDetails';
import DowndownMenu from '../../../components/DropdownMenu';
import { resolveResponse } from 'utils';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const options = [
  { label: 'Password reset', value: 'password_reset' },
  { label: 'Open student profile', value: 'student_profile' },
  { label: 'Change Role', value: 'change_role' },
];

const LocalizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(LocalizedFormat);

const Student = () => {
  const { stdId } = useParams();
  const [member, setMember] = useState(null);
  const [copied, setCopied] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogTwo, setOpenDialogTwo] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);

  const getMemberById = () => {
    bc.auth()
      .getAcademyMember(stdId)
      .then(({ data }) => setMember(data))
      .catch((error) => error);
  };
  const passwordReset = () => {
    bc.auth()
      .passwordReset(member.id)
      .then((res) => {
        if (res.data && res.data.reset_password_url) {
          navigator.clipboard.writeText(res.data.reset_password_url);
          // toast.success('Password reset url copied', toastOption);
        }
      })
      .catch((error) => error);
    setOpenDialog(false);
    setOpenDialogTwo(true)
  };
  const passwordResetTwo = () => {
    bc.auth()
      .passwordReset(member.id)
      .then((res) => {
        if (res.data && res.data.reset_password_url) {
          navigator.clipboard.writeText(res.data.reset_password_url);
          toast.success('Password reset url copied', toastOption);
        }
      })
      .catch((error) => error);
    setOpenDialog(false);
    // setOpenDialogTwo(false)
  };
  useEffect(() => {
    getMemberById();
  }, []);

  console.log(resolveResponse + ' jason');
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
        <Dialog
          open={openDialogTwo}
          onClose={() => setOpenDialogTwo(true)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Password reset link
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              *link here*
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialogTwo(false)} color="primary">
              Close
            </Button>
            <Button color="primary" autoFocus onClick={() => passwordResetTwo()}>
              Copy Link
            </Button>
          </DialogActions>
        </Dialog>
        <div>
          <h3 className="mt-0 mb-4 font-medium text-28">
            {`${member?.user.first_name} ${member?.user.last_name}`}
          </h3>
          <div className="flex">
            Member since:
            {dayjs(member?.created_at).format('LL')}
          </div>
        </div>
        <DowndownMenu
          options={options}
          icon="more_horiz"
          onSelect={({ value }) => {
            setOpenDialog(value === 'password_reset');
            setOpenRoleDialog(value === 'change_role');
          }}
        >
          <Button>
            <Icon>playlist_add</Icon>
            Additional Actions
          </Button>
        </DowndownMenu>
      </div>

      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <StudentDetails
            stdId={stdId}
            user={member}
            openRoleDialog={openRoleDialog}
            setOpenRoleDialog={setOpenRoleDialog}
          />
        </Grid>
        <Grid item md={8} xs={12}>
          <StudentCohorts stdId={stdId} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Student;
