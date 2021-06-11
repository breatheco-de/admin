import React, { useState } from "react";
import {
  Button,
  DialogTitle,
  Dialog,
  DialogActions,
  Icon,
  IconButton,
  Tooltip,
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
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{inviteLink}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
              toast.success("Invite url copied successfuly", toastOption);
            }}
            color='primary'
            autoFocus
          >
            Copy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CopyInviteModal;
