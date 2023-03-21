import React, { useState, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  DialogTitle, Dialog, Button, Tooltip, DialogActions, IconButton,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const propTypes = {
  classes: PropTypes.string.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.array).isRequired,
  user: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.array).isRequired,
  setItems: PropTypes.arrayOf(PropTypes.array).isRequired,
  loadData: PropTypes.func,
};

const defaultToolbarSelectStyles = {
  iconButton: {},
  iconContainer: {
    marginRight: '24px',
  },
  inverseIcon: {
    transform: 'rotate(90deg)',
  },
};

const BulkAction = (props) => {

  const { classes, selectedRows, title, iconComponent, onConfirm } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const IconComponent = iconComponent;

  const selected = useMemo(() => props.selectedRows.data.map((item) => item.index), [selectedRows]);

  return (
    <>
      <Tooltip title={title}>
        <IconButton className={classes.iconButton} onClick={() => setOpenDialog(true)}>
          <IconComponent className={classes.icon} />
        </IconButton>
      </Tooltip>
      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <form>
          <DialogTitle id="alert-dialog-title">
            {title}
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" autoFocus onClick={(e) => {
                e.preventDefault();
                const ids = selected.map(item => props.items[item].id);
                onConfirm(ids);
                setOpenDialog(false);
            }}>
                Continue
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

BulkAction.propTypes = propTypes;

export default withStyles(defaultToolbarSelectStyles, {
  name: 'BulkAction',
})(BulkAction);