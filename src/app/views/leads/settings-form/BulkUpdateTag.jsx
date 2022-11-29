import React, { useState, useMemo } from 'react';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { withStyles } from '@material-ui/core/styles';
import {
  DialogTitle, Dialog, Button, Tooltip, DialogActions, IconButton,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
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

const BulkUpdateTag = (props) => {
  const { classes, selectedRows } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [type, setType] = useState(null);

  const selected = useMemo(() => props.selectedRows.data.map((item) => item.index), [selectedRows]);

  const addBulkType = (e) => {
    e.preventDefault();
    bc.marketing()
      .updateAcademyTags('', selected.map((item) => {
            return {
              id: props.items[item].id,
              tag_type: type,
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
      <Tooltip title="Add bulk type to the tags">
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
            Bulk update tag's type
            <div className="mt-4">
              <AsyncAutocomplete
                onChange={(newType) => setType(newType)}
                width="100%"
                size="medium"
                label="Types"
                debounced={false}
                required
                getOptionLabel={(option) => option}
                asyncSearch={props.asyncSearch}
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
            <Button color="primary" type="submit" autoFocus onClick={(e) => addBulkType(e)}>
                Apply type to tags
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Dialog */}
    </>
  );
};

BulkUpdateTag.propTypes = propTypes;

export default withStyles(defaultToolbarSelectStyles, {
  name: 'BulkUpdateTag',
})(BulkUpdateTag);