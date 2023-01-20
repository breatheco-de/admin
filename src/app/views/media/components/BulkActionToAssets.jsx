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

const BulkActionToAssets = (props) => {
  const { classes, selectedRows } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [actionSlug, setActionSlug] = useState("");
  const [overrideMeta, setOverrideMeta] = useState(false);

  const actions = ["pull", "push", "analyze_seo", "test", "clean"]

  const selected = useMemo(() => props.selectedRows.data.map((item) => item.index), [selectedRows]);

  const executeBulkAction = (e) => {
    e.preventDefault();
    bc.registry()
      .bulkAssetAction(actionSlug, { override_meta: overrideMeta, assets: selected.map((item) => props.items[item].slug) })
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
            Execute bulk action for selected items
            <div className="mt-4">
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={actionSlug}
                  label="Action"
                  onChange={(e) => setActionSlug(e.target.value)}
                >
                  {actions.map((action, index) => <MenuItem value={action}>{action}</MenuItem>)}
                </Select>
                <FormControlLabel label="Override Meta Info" control={<Checkbox onChange={() => setOverrideMeta(!overrideMeta)} />}/>
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
            <Button color="primary" type="submit" autoFocus onClick={(e) => executeBulkAction(e)}>
              Execute Action
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

BulkActionToAssets.propTypes = propTypes;

export default withStyles(defaultToolbarSelectStyles, {
  name: 'BulkActionToAssets',
})(BulkActionToAssets);