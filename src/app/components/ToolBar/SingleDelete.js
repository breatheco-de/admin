import React, { useState, useEffect, useMemo } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import {
  DialogTitle,
  Dialog,
  Button,
  Tooltip,
  DialogActions,
  IconButton,
} from '@material-ui/core';
import bc from '../../services/breathecode';

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
  console.log(props);
  const { deleting, message, onClose } = props;
  const [openDialog, setOpenDialog] = useState(true);

  const deleteEntity = async (e) => {
    e.preventDefault();

    try {
      result = await deleting();
      console.log(result);
      setOpenDialog(false);
      if (result.status >= 200 && result.status < 300) {
        onClose(null);
        return true;
      }
    } catch (r) {
      setOpenDialog(false);
      return r;
    }

    // deleting()
    //   .then((status) => {
    //     setOpenDialog(false);
    //     if (status >= 200 && status < 300) {

    //       onClose(null);
    //       return true;
    //     }
    //     throw Error('Items could not be deleted');
    //   })
    //   .catch((r) => {
    //     setOpenDialog(false);
    //     return r;
    //   });
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
