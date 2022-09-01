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

const BulkDelete = (props) => {
  const {
    classes, onBulkDelete, setSelectedRows, deleting,
  } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [idsArr, setIdsArr] = useState([]);

  const selected = useMemo(() => props.selectedRows.data.map((item) => item.index), [props.selectedRows]);

  useEffect(() => {
    setIdsArr(selected.map((item) => props.items[item].id));
  }, [selected]);

  const deleteBulkEntities = async (e) => {
    e.preventDefault();
    if(!deleting) throw Error('No deleting option has been passed to the SmartMuiDataTable');
    
    const status = await deleting(idsArr);
    setOpenDialog(false);
    if (status >= 200 && status < 300) {
        setSelectedRows([]);
        if (onBulkDelete) onBulkDelete();
        return true;
    }
    setOpenDialog(false);
  };
  return (
 
    <>
      <div className="flex flex-wrap " >
        {props.bulkActions && 
          <props.bulkActions 
            ids={idsArr} 
            selectedRows={props.selectedRows} 
            setSelectedRows={setSelectedRows} 
            displayData={props.displayData}
          />
        }
        <Tooltip title="Delete ALL">
          <IconButton className={classes.iconButton}>
            <DeleteIcon
              className={classes.icon}
              onClick={(e) => {
                setOpenDialog(true);
              }}
            />
          </IconButton>
        </Tooltip>
      </div>
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
            Are you sure you want to delete these resources
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
            <Button
              color="primary"
              type="submit"
              autoFocus
              onClick={(e) => deleteBulkEntities(e)}
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
})(BulkDelete);
