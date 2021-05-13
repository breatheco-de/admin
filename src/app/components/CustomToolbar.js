import React, { useState, useEffect, useMemo } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
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

const CustomToolbarSelect = (props) => {
  const { classes } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [cohort, setCohort] = useState(null);
  const [bulk, setBulk] = useState([]);
  const [idsArr, setIdsArr] = useState([]);

  const selected = useMemo(() => {
    return props.selectedRows.data.map((item) => item.index);
  }, [props.selectedRows]);

  console.log("bulk", bulk);
  console.log("selected:", selected);
  console.log("idsArr:", idsArr);

  useEffect(() => {
    let bulkDeleteIds;
    if (props.id === "students") bulkDeleteIds = bulk.map((item) => item.user);
    if (props.id === "cohorts") bulkDeleteIds = bulk.map((item) => item.id);
    setIdsArr(bulkDeleteIds);
  }, [bulk]);

  useEffect(() => {
    setBulk(
      selected.map((item) => {
        console.log("item:", props.items[item]);
        switch (props.id) {
          case "students":
            if (props.items[item].user !== null)
              return {
                user: props.items[item].user.id,
                role: "STUDENT",
                finantial_status: null,
                educational_status: null,
              };

            break;
          case "cohorts":
            return {
              id: props.items[item].id,
              slug: props.items[item].slug,
              stage: props.items[item].stage,
            };
            break;
        }
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
  const deleteBulkEntities = (e) => {
    e.preventDefault();
    if (props.id === "students") {
      bc.admissions()
        .deleteStudentBulk(idsArr)
        .then((d) => d)
        .catch((r) => r);
    } else if (props.id === "cohorts") {
      bc.admissions()
        .deleteCohortsBulk(idsArr)
        .then((d) => d)
        .catch((r) => r);
    }
  };
  return (
    <div className={classes.iconContainer}>
      <Tooltip title={"Deselect ALL"}>
        <IconButton className={classes.iconButton}>
          <DeleteIcon
            className={classes.icon}
            onClick={(e) => {
              deleteBulkEntities(e);
            }}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title={"Inverse selection"}>
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
        onClose={() => setOpenDialog(false)}
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
                getOptionLabel={(option) => `${option.name}, (${option.slug})`}
                asyncSearch={() => bc.admissions().getAllCohorts()}
              />
            </div>
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color='primary'>
              Cancel
            </Button>
            <Button
              color='primary'
              type='submit'
              autoFocus
              onClick={(e) => addBulkToCohort(e)}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Dialog */}
    </div>
  );
};

export default withStyles(defaultToolbarSelectStyles, {
  name: "CustomToolbarSelect",
})(CustomToolbarSelect);
