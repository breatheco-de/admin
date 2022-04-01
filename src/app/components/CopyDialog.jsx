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
  isOpened, onClose, title, value, label,
}) => (
  <Dialog
    open={isOpened}
    onClose={() => onClose()}
    aria-labelledby="form-dialog-title"
    fullWidth
  >
    <form className="p-4">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item md={12} sm={12} xs={10}>
            <TextField
              label={label}
              name="value"
              size="medium"
              disabled
              fullWidth
              variant="outlined"
              value={value}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Grid className="p-2">
        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(value);
              toast.success('Copied successfuly', toastOption);
            }}
            autoFocus
          >
            Copy
          </Button>
          <Button onClick={() => onClose()}>Close</Button>
        </DialogActions>
      </Grid>
    </form>
  </Dialog>
);

CopyDialog.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
