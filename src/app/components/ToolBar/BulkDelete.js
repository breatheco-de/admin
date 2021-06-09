import React, { useState, useEffect, useMemo } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import bc from "../../services/breathecode";
import {
  DialogTitle,
  Dialog,
  Button,
  Tooltip,
  DialogActions,
  IconButton,
} from "@material-ui/core";

const defaultToolbarSelectStyles = {
  iconButton: {},
  iconContainer: {
    marginRight: "24px",
  },
  inverseIcon: {
    transform: "rotate(90deg)",
  },
};

const BulkDelete = (props) => {
  const { classes, reRender, setSelectedRows } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [idsArr, setIdsArr] = useState([]);

  const selected = useMemo(() => {
    return props.selectedRows.data.map((item) => item.index);
  }, [props.selectedRows]);

  useEffect(() => {
    setIdsArr(selected.map(item => props.items[item].id))
  }, [selected]);

  const deleteBulkEntities = (e) => {
    e.preventDefault();
    bc.admissions()
      .deleteStudentBulk(idsArr)
        .then((d) => {
          setOpenDialog(false)
          if(d.status >= 200 && d.status < 300){
            setSelectedRows([]);
            if(reRender) reRender();
            return true;
          }
          throw Error("Items could not be deleted")
        })
        .catch((r) => {
          setOpenDialog(false)
          return r
        });
  };
  return (
      <>
      <Tooltip title={"Delete ALL"}>
        <IconButton className={classes.iconButton}>
          <DeleteIcon
            className={classes.icon}
            onClick={(e) => {
              setOpenDialog(true);
            }}
          />
        </IconButton>
      </Tooltip>
      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <form>
          <DialogTitle id='alert-dialog-title'>
            Are you sure you want to delete these resources
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
              }}
              color='primary'
            >
              Cancel
            </Button>
            <Button
              color='primary'
              type='submit'
              autoFocus
              onClick={(e) =>
                 deleteBulkEntities(e)
              }
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
    name: "BulkDelete",
  })(BulkDelete);