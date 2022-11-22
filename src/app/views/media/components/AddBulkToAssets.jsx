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

const AddBulkToAssets = (props) => {
  const { classes, selectedRows } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [category, setCategory] = useState(null);

  const selected = useMemo(() => props.selectedRows.data.map((item) => item.index), [selectedRows]);

  const addBulkCategory = (e) => {
    e.preventDefault();
    bc.registry()
        .updateAsset('', selected.map((item) => {
            return {
              id: props.items[item].id,
              category: category.id
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
      <Tooltip title="Add bulk Assets to a category">
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
            Add in bulk Assets to a category
            <div className="mt-4">
              <AsyncAutocomplete
                onChange={(newCategory) => setCategory(newCategory)}
                width="100%"
                size="medium"
                label="Category"
                debounced={false}
                required
                getOptionLabel={(option) => option.title}
                asyncSearch={(searchTerm) => bc.registry().getAcademyCategories({ like: searchTerm })}
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
            <Button color="primary" type="submit" autoFocus onClick={(e) => addBulkCategory(e)}>
                Apply assets to category
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Dialog */}
    </>
  );
};

AddBulkToAssets.propTypes = propTypes;

export default withStyles(defaultToolbarSelectStyles, {
  name: 'AddBulkToAssets',
})(AddBulkToAssets);