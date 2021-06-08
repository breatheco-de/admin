import React, { useState, useEffect, useMemo } from "react";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { withStyles } from "@material-ui/core/styles";
import { AsyncAutocomplete } from "./Autocomplete";
import bc from "../services/breathecode";

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

const AddBulkToCohort = (props) => {
  const { classes } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [cohort, setCohort] = useState(null);
  const [bulk, setBulk] = useState([]);

  const selected = useMemo(() => {
    return props.selectedRows.data.map((item) => item.index);
  }, [props.selectedRows]);

 

  useEffect(() => {
    setBulk(
      selected.map((item) => {
            const { user } = props.items[item];
            const userExists = !(user === null || user === undefined);
            return {
              user: userExists ? props.items[item].user.id : null,
              id: props.items[item].id,
              role: "STUDENT",
              finantial_status: null,
              educational_status: null,
            };
      })
    );
  }, [selected]);
  const addBulkToCohort = (e) => {
    e.preventDefault();
    bc.admissions()
      .addUserCohort(cohort.id, bulk)
      .then((d) => d)
      .catch((r) => r);
    setOpenDialog(false);
  };
  return (
    <>
      <Tooltip title={"Add bulk to cohort"}>
        <IconButton
          className={classes.iconButton}
          onClick={() => setOpenDialog(true)}
        >
          <GroupAddIcon className={classes.icon} />
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
              Add in bulk students to a cohort
              <div className='mt-4'>
                <AsyncAutocomplete
                  onChange={(cohort) => setCohort(cohort)}
                  width={"100%"}
                  size='medium'
                  label='Cohort'
                  required={true}
                  getOptionLabel={(option) =>
                    `${option.name}, (${option.slug})`
                  }
                  asyncSearch={() => bc.admissions().getAllCohorts()}
                />
              </div>
            
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
                addBulkToCohort(e)
              }
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Dialog */}
    </>
  );
};

export default withStyles(defaultToolbarSelectStyles, {
  name: "AddBulkToCohort",
})(AddBulkToCohort);