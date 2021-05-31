import React, { useState, useEffect } from "react";
import DeleteIcon from '@material-ui/icons/Delete';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { withStyles } from "@material-ui/core/styles";
import {AsyncAutocomplete} from "./Autocomplete";
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
    iconButton: {
    },
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
    const [bulk, setBulk] = useState([])
    const [certificates, setCertificates] = useState([{
        user_id: "",
        cohort_slug: "",
    }]) 
    const [bulkCertificates, setBulkCertificates] = useState([])
    useEffect(() => {
        let selected = props.selectedRows.data.map(item => item.index);
        setBulk(selected.map(item => {
             if(props.items[item].user !== null) 
             return { user: props.items[item].user.id, role:"STUDENT", finantial_status: null ,educational_status: null }
        }))
        
    }, [])
    useEffect(() => {
        let indexList = props.selectedRows.data.map(item => item.index);
        indexList.map((item, index) => {
            if(index == 0){
                setCertificates([{
                    user_id: props.items[item].user.id,
                    cohort_slug: props.items[item].cohort.slug
                }])
            } 
            if(index > 0){
                let certificate = {
                    user_id: props.items[item].user.id,
                    cohort_slug: props.items[item].cohort.slug
                }
                certificates.push(certificate)
            }
            setBulkCertificates(certificates)
        })
    }, [props.selectedRows])
    const addBulkToCohort = (e) => {
        e.preventDefault();
        bc.admissions().addUserCohort(cohort.id, bulk).then(d => d).catch(r => r);
        setOpenDialog(false);
    };
    return (
        <div className={classes.iconContainer}>
            <Tooltip title={"Deselect ALL"}>
                <IconButton className={classes.iconButton}>
                    <DeleteIcon className={classes.icon} />
                </IconButton>
            </Tooltip>
            <Tooltip title={"Inverse selection"}>
                <IconButton className={classes.iconButton} onClick={() => setOpenDialog(true)}>
                    <GroupAddIcon className={classes.icon} />
                </IconButton>
            </Tooltip>
            <Tooltip title={"Re-attemps certificates"}>
                <IconButton className={classes.iconButton} onClick={() => {
                    bc.certificates().addBulkCertificates(bulkCertificates)
                    props.setSelectedRows(props.selectedRows.data = [])
                    setBulkCertificates([]);
                }}>
                    <PostAddIcon className={classes.icon} />
                </IconButton>
            </Tooltip>
            {/* Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form>
                <DialogTitle id="alert-dialog-title">
                  Add in bulk students to a cohort
                  <div className="mt-4">
                  <AsyncAutocomplete
                    onChange={(cohort) => setCohort(cohort)}
                    width={"100%"}
                    size="medium"
                    label="Cohort"
                    required={true}
                    getOptionLabel={option => `${option.name}, (${option.slug})`}
                    asyncSearch={() => bc.admissions().getAllCohorts()}
                    />
                  </div>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button color="primary" type="submit" autoFocus onClick={(e) => addBulkToCohort(e)}>
                        Save
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
            {/* Dialog */}
        </div>
    );
};


export default withStyles(defaultToolbarSelectStyles, { name: "CustomToolbarSelect" })(CustomToolbarSelect);