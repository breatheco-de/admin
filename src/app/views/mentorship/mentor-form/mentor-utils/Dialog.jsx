import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
} from '@material-ui/core';
import { toast } from 'react-toastify';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

export const CopyDialog = ({
  open, setCopyDialog, title, url,
}) => (
  <Dialog
    open={open}
    onClose={() => setCopyDialog({ ...open, openDialog: false })}
    aria-labelledby="form-dialog-title"
    fullWidth
  >
    <form className="p-4">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item md={12} sm={12} xs={10}>
            <TextField
              label="URL"
              name="url"
              size="medium"
              disabled
              fullWidth
              variant="outlined"
              value={url}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Grid className="p-2">
        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success('Invite url copied successfuly', toastOption);
            }}
            autoFocus
          >
            Copy
          </Button>
          <Button onClick={() => setCopyDialog({ ...open, openDialog: false })}>Close</Button>
        </DialogActions>
      </Grid>
    </form>
  </Dialog>
);

CopyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setCopyDialog: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
