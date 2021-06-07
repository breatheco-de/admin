import React, { useState, useEffect, useMemo } from "react";
import PostAddIcon from '@material-ui/icons/PostAdd';
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
  const { classes, reRender } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [cohort, setCohort] = useState(null);
  const [bulk, setBulk] = useState([]);
  const [idsArr, setIdsArr] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const selected = useMemo(() => {
    return props.selectedRows.data.map((item) => item.index);
  }, [props.selectedRows]);

  useEffect(() => {
    setIdsArr(bulk.map((item) => item.id).filter((id) => id !== null));
  }, [bulk]);

  useEffect(() => {
    setBulk(
      selected.map((item) => {
        switch (props.id) {
          case "students":
            const { user } = props.items[item];
            const userExists = !(user === null || user === undefined);
            return {
              user: userExists ? props.items[item].user.id : null,
              id: props.items[item].id,
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
          case "staff":
            return {
              id: props.items[item].id,
              email: props.items[item].email,
              status: props.items[item].status,
            };
            break;
          case "certificates":
            return {
              id: props.items[item].id,
              preview_url: props.items[item].preview_url,
              status_text: props.items[item].status_text,
            };
            break;
          case "leads":
            return {
              id: props.items[item].id,
              location: props.items[item].location,
              course: props.items[item].course,
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
        .then(() => {
          props.selectedRows.data = [];
          reRender();
        })
        .catch((r) => r);
    } else if (props.id === "cohorts") {
      bc.admissions()
        .deleteCohortsBulk(idsArr)
        .then((d) => d)
        .then(() => reRender())
        .catch((r) => r);
    } else if (props.id === "staff") {
      bc.admissions()
        .deleteStaffBulk(idsArr)
        .then((d) => d)
        .then(() => {
          props.selectedRows.data = [];
          reRender();
        })
        .catch((r) => r);
    } else if (props.id === "certificates") {
      bc.admissions()
        .deleteCertificatesBulk(idsArr)
        .then((d) => d)
        .then(() => {
          props.selectedRows.data = [];
          reRender();
        })
        .catch((r) => r);
    } else if (props.id === "leads") {
      bc.admissions()
        .deleteLeadsBulk(idsArr)
        .then((d) => d)
        .then(() => {
          props.selectedRows.data = [];
          reRender();
        })
        .catch((r) => r);
    }
  };
  return (
    <div className={classes.iconContainer}>
      <Tooltip title={"Delete ALL"}>
        <IconButton className={classes.iconButton}>
          <DeleteIcon
            className={classes.icon}
            onClick={(e) => {
              setBulkDeleting(true);
              setOpenDialog(true);
            }}
          />
        </IconButton>
      </Tooltip>
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
          setBulkDeleting(false);
          setOpenDialog(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <form>
          <DialogTitle id='alert-dialog-title'>
            {bulkDeleting
              ? "Are you sure you want to delete these resources"
              : "Add in bulk students to a cohort"}
            {!bulkDeleting && (
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
            )}
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setBulkDeleting(false);
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
                bulkDeleting ? deleteBulkEntities(e) : addBulkToCohort(e)
              }
            >
              {bulkDeleting ? "Yes" : "Save"}
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
