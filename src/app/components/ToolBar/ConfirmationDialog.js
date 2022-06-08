import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  DialogTitle,
  Dialog,
  Button,
  DialogActions,
} from '@material-ui/core';

const defaultToolbarSelectStyles = {
  iconButton: {},
  iconContainer: {
    marginRight: '24px',
  },
  inverseIcon: {
    transform: 'rotate(90deg)',
  },
};

const SingleDelete = (props) => {
  const { deleting, message, onClose } = props;
  const [openDialog, setOpenDialog] = useState(true);

  const deleteEntity = async (e) => {
    e.preventDefault();

    try {
      await deleting();

      setOpenDialog(false);
      onClose(null);

    } catch (r) {
      setOpenDialog(false);
      onClose(null);
      return r;
    }
  };
  
  return (
    <>
      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          onClose(null);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form>
          <DialogTitle id="alert-dialog-title">
            {message}
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                onClose(null);
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              autoFocus
              onClick={(e) => deleteEntity(e)}
            >
              Yes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Dialog */}
    </>
  );
};

export default withStyles(defaultToolbarSelectStyles, {
  name: 'BulkDelete',
})(SingleDelete);
