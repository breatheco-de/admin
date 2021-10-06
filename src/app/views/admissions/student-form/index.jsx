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
  MenuItem,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import { resolveResponse } from 'utils';
import { makeStyles } from '@material-ui/core/styles';
import bc from '../../../services/breathecode';
import StudentCohorts from './StudentCohorts';
import StudentDetails from './StudentDetails';
import DowndownMenu from '../../../components/DropdownMenu';
import { CopyDialog } from '../../admin/staff-form/staff-utils/Dialog';

const useStyles = makeStyles({
  modalStyle: {
    width: '400px',
  },
});

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const options = [
  { label: 'Password reset', value: 'password_reset' },
  { label: 'Open student profile', value: 'student_profile' },
  { label: 'Change Role', value: 'change_role' },
  { label: 'Reset Github Link', value: 'github_reset' },
  { label: 'Add new note', value: 'add_note' },
];

const LocalizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(LocalizedFormat);

const Student = () => {
  const classes = useStyles();
  const { stdId } = useParams();
  const [member, setMember] = useState(null);
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [noteFormValues, setNoteFormValues] = useState({
    noteType: '',
    noteBody: '',
  });

  const [githubResetDialog, setGithubDialogReset] = useState(false);
  const [newNoteDialog, setNewNoteDialog] = useState(false);
  const [copyDialog, setCopyDialog] = useState({
    title: 'Reset Github url',
    url: 'https://github.something.com',
    openDialog: false,
  });

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
        setInviteLink(res.data.reset_password_url);
        if (res.data && res.data.reset_password_url) {
          navigator.clipboard.writeText(res.data.reset_password_url);
        }
      })
      .catch((error) => error);
    setOpenDialog(false);
    setOpenModal(true);
  };

  const githubReset = () => {
    bc.admissions()
      .getTemporalToken(member)
      .then(({ data }) => {
        setCopyDialog({
          ...copyDialog,
          openDialog: true,
          url: `${data.reset_github_url}?url=https://student.breatheco.de/login`,
        });
      })
      .catch((error) => error);
    setGithubDialogReset(false);
  };

  const copyPasswordResetLink = () => {
    bc.auth();
    toast.success('Password reset url copied', toastOption);
  };
  useEffect(() => {
    getMemberById();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('note:', noteFormValues);
  };

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
        {/* Add new note modal */}
        <Dialog
          open={newNoteDialog}
          onClose={() => setNewNoteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth="md"
        >
          <DialogTitle className="ml-2" id="alert-dialog-title">
            Student note
          </DialogTitle>
          <DialogContent>
            <TextField
              className="m-2"
              label="Select note type"
              size="small"
              fullWidth
              variant="outlined"
              value={noteFormValues.noteType}
              onChange={(e) => {
                setNoteFormValues({ ...noteFormValues, noteType: e.target.value });
              }}
              select
            >
              {['educational note', 'career note'].map((item) => (
                <MenuItem value={item} key={item}>
                  {item.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="m-2"
              label="Type the student note"
              multiline
              row={5}
              fullWidth
              variant="outlined"
              onChange={(e) => {
                setNoteFormValues({ ...noteFormValues, noteBody: e.target.value });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewNoteDialog(false)} color="primary">
              Close
            </Button>
            <Button
              color="primary"
              autoFocus
              onClick={() => {
                console.log('I will be adding a new note', noteFormValues);
                setNewNoteDialog(false);
              }}
            >
              Add the note to student
            </Button>
          </DialogActions>
        </Dialog>
        {/* Temporal Token - Github Reset */}
        <Dialog
          open={githubResetDialog}
          onClose={() => setGithubDialogReset(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            A reset github url will be generated for
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {member?.user.email}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGithubDialogReset(false)} color="primary">
              Close
            </Button>
            <Button color="primary" autoFocus onClick={() => githubReset()}>
              Generate
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(true)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Password reset link</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <TextField
                className={classes.modalStyle}
                value={inviteLink}
                disabled
                id="outlined-disabled"
                label="URL"
                variant="outlined"
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="primary">
              Close
            </Button>
            <Button color="primary" autoFocus onClick={() => copyPasswordResetLink()}>
              Copy
            </Button>
          </DialogActions>
        </Dialog>
        <CopyDialog
          title={copyDialog.title}
          url={copyDialog.url}
          open={copyDialog.openDialog}
          setCopyDialog={setCopyDialog}
        />
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
            setGithubDialogReset(value === 'github_reset');
            setNewNoteDialog(value === 'add_note');
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
