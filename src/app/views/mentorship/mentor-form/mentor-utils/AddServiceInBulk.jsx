import React, { useState, useMemo } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { withStyles } from '@material-ui/core/styles';
import {
  DialogTitle, Dialog, Button, Tooltip, DialogActions, IconButton,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { AsyncAutocomplete } from '../../../../components/Autocomplete';
import bc from '../../../../services/breathecode';

const propTypes = {
  classes: PropTypes.string.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.array).isRequired,
  user: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.array).isRequired,
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

const AddServiceInBulk = (props) => {
  const { classes, selectedRows } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [service, setService] = useState(null);

  const selected = useMemo(() => props.selectedRows.data.map((item) => item.index), [selectedRows]);

  const addBulkService = (e) => {
    e.preventDefault();
    bc.mentorship()
        .updateMentorSession('', selected.map((item) => {
            return {
              id: props.items[item].id,
              mentor: props.items[item].mentor.id,
              service: service.id
            };
          }))
        .then((d) => d)
      .catch((r) => r);
    setOpenDialog(false);
  };
  return (
    <>
      <Tooltip title="Add bulk Service to the sessions">
        <IconButton className={classes.iconButton} onClick={() => setOpenDialog(true)}>
          <AddCircleOutlineIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
      {/* Dialog */}
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
            Add in bulk a Service to the sessions
            <div className="mt-4">
              <AsyncAutocomplete
                onChange={(newService) => setService(newService)}
                width="100%"
                size="medium"
                label="Service"
                debounced={false}
                required
                getOptionLabel={(option) => option.name}
                asyncSearch={() => bc.mentorship().getAllServices()}
              />
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
            <Button color="primary" type="submit" autoFocus onClick={(e) => addBulkService(e)}>
                Apply service to sessions
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Dialog */}
    </>
  );
};

AddServiceInBulk.propTypes = propTypes;

export default withStyles(defaultToolbarSelectStyles, {
  name: 'AddServiceInBulk',
})(AddServiceInBulk);