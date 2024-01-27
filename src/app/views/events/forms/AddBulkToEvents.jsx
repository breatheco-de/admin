import React, { useState, useMemo } from 'react';
import Apps from '@material-ui/icons/Apps';
import { withStyles } from '@material-ui/core/styles';
import {
  DialogTitle, Dialog, Button, Tooltip, DialogActions, IconButton, FormControl, Checkbox, Select, MenuItem, FormControlLabel
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { getParams } from '../../../components/SmartDataTable';
import bc from "../../../services/breathecode"

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

const AddBulkToEvents = (props) => {
  const { classes, selectedRows } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState("");

  const event_status = ["ACTIVE", "DRAFT", "FINISHED"]

  const selected = useMemo(() => props.selectedRows.data.map((item) => item.index), [selectedRows]);

  const updateEventStatus = async (e) => {
    e.preventDefault();
    bc.events()
        .updateAcademyEvent('', selected.map((item) => {
            return {
              id: props.items[item].id,
              status
            };
          }))
        .then(async (d) => {
          const { data } = await props.loadData({ limit: 10, offset: 0, ...getParams(), });
          props.setItems(data.results);
          return d
        })
      .catch((r) => r);
    setOpenDialog(false);
  };

  return (
    <>
      <Tooltip title="Execute bulk action for selected items">
        <IconButton className={classes.iconButton} onClick={() => setOpenDialog(true)}>
          <Apps className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form>
          <DialogTitle id="alert-dialog-title">
            Update events status to:
            <div className="mt-4">
              <FormControl fullWidth>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {event_status.map((status, index) => <MenuItem key={index} value={status}>{status}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
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
            <Button color="primary" type="submit" autoFocus onClick={(e) => updateEventStatus(e)}>
              Update status
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

AddBulkToEvents.propTypes = propTypes;

export default withStyles(defaultToolbarSelectStyles, {
  name: 'AddBulkToEvents',
})(AddBulkToEvents);