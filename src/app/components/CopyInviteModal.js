import React, { useState } from "react";
import {
  Button,
  DialogTitle,
  Dialog,
  Icon,
  IconButton,
  Tooltip,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
} from "@material-ui/core";
import bc from "app/services/breathecode";
import { toast } from "react-toastify";

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const CopyInviteModal = ({ user }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const getMemberInvite = (user) => {
    bc.auth()
      .getMemberInvite(user)
      .then((res) => {
        if (res === undefined) setOpenDialog(false);
        if (res.data) {
          setInviteLink(res.data.invite_url);
        }
      })
      .catch((error) => error);
  };

  return (
    <>
      <Tooltip title='Copy invite link'>
        <IconButton
          onClick={() => {
            setOpenDialog(true);
            getMemberInvite(user);
          }}
        >
          <Icon>assignment</Icon>
        </IconButton>
      </Tooltip>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby='form-dialog-title'
        fullWidth={true}
      >
        <form className='p-4'>
          <DialogTitle id='form-dialog-title'>Invite Link</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} alignItems='center'>
              <Grid item md={12} sm={12} xs={10}>
                <TextField
                  label='URL'
                  name='url'
                  size='medium'
                  disabled
                  fullWidth
                  variant='outlined'
                  value={inviteLink}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Grid className='p-2'>
            <DialogActions>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  toast.success("Invite url copied successfuly", toastOption);
                }}
                autoFocus
              >
                Copy
              </Button>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </Grid>
        </form>
      </Dialog>
    </>
  );
};

export default CopyInviteModal;
