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
import bc from '../../../services/breathecode';
import StaffDetails from './StaffDetails';
import DowndownMenu from '../../../components/DropdownMenu';
import axios from '../../../../axios';

import { CopyDialog } from './staff-utils/Dialog';

const LocalizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(LocalizedFormat);

const Staff = () => {
  const { staffId } = useParams();
  const [member, setMember] = useState(null);
  const [dialogState, setDialogState] = useState({
    openDialog: false,
    title: '',
    action: () => {},
  });
  const [copyDialog, setCopyDialog] = useState({
    title: 'Reset Github url',
    url: 'https://github.something.com',
    openDialog: false,
  });

  const getMemberById = () => {
    bc.auth()
      .getAcademyMember(staffId)
      .then(({ data }) => {
        console.log(data);
        setMember(data);
      })
      .catch((error) => error);
  };
  const passwordReset = () => {
    axios
      .post(`${process.env.REACT_APP_API_HOST}/v1/user/password/reset`, {
        email: member?.user.email,
      })
      .then(({ data }) => data)
      .catch((error) => error);
    setDialogState({ ...dialogState, openDialog: false });
  };
  const githubReset = () => {
    bc.admissions()
      .getTemporalToken(member)
      .then(({ data }) => {
        setCopyDialog({
          ...copyDialog,
          openDialog: true,
          url: `${data.reset_github_url}?url=https://staff.breatheco.de/login`,
        });
      })
      .catch((error) => error);
    setDialogState({ ...dialogState, openDialog: false });
  };
  const options = [
    {
      label: 'Send password reset',
      value: 'password_reset',
      title: 'An email to reset password will be sent to',
      action: passwordReset,
    },
    { label: 'Open student profile', value: 'student_profile', title: '' },
    {
      label: 'Reset Github Link',
      value: 'github_reset',
      title: 'A reset github url will be generated for',
      action: githubReset,
    },
  ];
  useEffect(() => {
    getMemberById();
  }, []);
  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        {/* This Dialog opens the modal to delete the user in the cohort */}
        <Dialog
          open={dialogState.openDialog}
          onClose={() => setDialogState({ ...dialogState, openDialog: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{dialogState.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {member?.user.email}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDialogState({ ...dialogState, openDialog: false })}
              color="primary"
            >
              Close
            </Button>
            <Button color="primary" autoFocus onClick={() => dialogState.action()}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <CopyDialog
          title={copyDialog.title}
          url={copyDialog.url}
          open={copyDialog.openDialog}
          setCopyDialog={setCopyDialog}
        />
        {/* <ActionsDialog /> */}
        <div>
          <h3 className="mt-0 mb-4 font-medium text-28">{`${member?.user.first_name} ${member?.user.last_name}`}</h3>
          <div className="flex">
            Member since:
            {dayjs(member?.created_at).format('LL')}
          </div>
        </div>
        <DowndownMenu
          options={options}
          icon="more_horiz"
          onSelect={({ value }) => {
            if (value === 'student_profile') {
              return;
            }
            const selected = options.find((option) => option.value === value);
            setDialogState({ openDialog: true, title: selected.title, action: selected.action });
          }}
        >
          <Button>
            <Icon>playlist_add</Icon>
            Additional Actions
          </Button>
        </DowndownMenu>
      </div>

      <Grid container spacing={3}>
        <Grid item md={5} xs={12}>
          <StaffDetails staffId={staffId} user={member} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Staff;
