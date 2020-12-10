import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    Divider,
    Card,
    TextField,
    Icon,
    List,
    ListItem,
    ListItemText,
    DialogTitle,
    Dialog,
    Button,
    MenuItem,
    DialogActions,
    IconButton,
} from "@material-ui/core";
import { format } from "date-fns";
import clsx from "clsx";
import axios from "../../../../axios";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import { MatxLoading } from "matx";
import AsyncAutocomplete from "./AsyncAutocomplete";

const useStyles = makeStyles(({ palette, ...theme }) => ({
    avatar: {
        border: "4px solid rgba(var(--body), 0.03)",
        boxShadow: theme.shadows[3],
    },
}));

const CohortStudents = ({ slug, id }) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" })
    const [studenList, setStudentsList] = useState([]);
    const [currentStd, setCurrentStd] = useState({});
    const [openRoleDialog, setRoleDialog] = useState(false);

    useEffect(() => {
        getCohortStudents();
    }, [])

    const changeStudentStatus = (value, name, studentId, i) => {
        console.log(value, name, i)
        const s_status = {
            role: studenList[i].role,
            finantial_status: studenList[i].finantial_status,
            educational_status: studenList[i].educational_status
        }
        axios.put(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${id}/user/${studentId}`, { ...s_status, [name]: value })
            .then((data) => {
                console.log(data)
                if (data.status >= 200) {
                    setMsg({ alert: true, type: "success", text: "User status updated" });
                    getCohortStudents();
                } else setMsg({ alert: true, type: "error", text: "Could not update user status" })
            })
            .catch(error => {
                setMsg({ alert: true, type: "error", text: error.details || error.role[0] });
                console.log(error)
            })
    }

    const getCohortStudents = () => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/user?cohorts=${slug}`)
            .then(({ data }) => {
                setIsLoading(false);
                data.length < 1 ? setMsg({ alert: true, type: "error", text: "This Cohort is empty or doesn´t exist" }) : setStudentsList(data)
            })
            .catch(error => setMsg({ alert: true, type: "error", text: error.details }))
    }

    const addUserToCohort = (user_id) => {
        axios.post(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${id}/user`, {
            user:user_id,
            role:"STUDENT",
            finantial_status:null,
            educational_status:"ACTIVE"
        }).then((data) => {
            if(data.status >= 200){
                setMsg({ alert: true, type: "success", text: "User added successfully" });
                getCohortStudents();
            }else setMsg({ alert: true, type: "error", text: "Could not update user status" })
        })
        .catch(error => {
            console.log(error)
            setMsg({ alert: true, type: "error", text: error.details });
        })
    } 

    const deleteUserFromCohort = () => {
        console.log(currentStd)
        axios.delete(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${id}/user/${currentStd.id}`)
            .then((data) => {
                if (data.status === 204) {
                    setMsg({ alert: true, type: "success", text: "User have been deleted from cohort" });
                    getCohortStudents();
                }
                else setMsg({ alert: true, type: "error", text: "Delete not successfull" })
            })
            .catch(error => setMsg({ alert: true, type: "error", text: error.details + " or permission denied" }))
        setOpenDialog(false);
    }
    return (
        <Card className="p-4">
            {/* This Dialog opens the modal to delete the user in the cohort */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you want to delete this user from cohort {slug.toUpperCase()}?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Disagree
                    </Button>
                    <Button color="primary" autoFocus onClick={() => deleteUserFromCohort()}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="mb-4 flex justify-between items-center">
                <h4 className="m-0 font-medium">Cohort Members</h4>
                <div className="text-muted text-13 font-medium">
                    {format(new Date(), "MMM dd, yyyy")} at{" "}
                    {format(new Date(), "HH:mm:aa")}
                </div>
            </div>
            <Divider className="mb-6" />

            <div className="flex mb-6">
                <AsyncAutocomplete addUserToCohort={addUserToCohort}/>
            </div>

            <div className="overflow-auto">
                {isLoading && <MatxLoading />}
                <div className="min-w-600">
                    {studenList.map((s, i) => (
                        <div key={i} className="py-4">
                            <Grid container alignItems="center">
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                    <div className="flex">
                                        <Avatar
                                            className={clsx("h-full w-full mb-6", classes.avatar)}
                                            src={s.profile?.avatar_url}
                                        />
                                        <div className="flex-grow">
                                            <h6 className="mt-0 mb-0 text-15 text-primary">
                                                {s.user.first_name} {s.user.last_name}
                                            </h6>
                                            <p className="mt-0 mb-6px text-13">
                                                <span className="font-medium">{s.created_at}</span>
                                            </p>
                                            <p className="mt-0 mb-6px text-13">
                                                <small onClick={() => {
                                                    setRoleDialog(true);
                                                    setCurrentStd({ id: s.user.id, positionInArray: i })
                                                    }} className={"border-radius-4 px-2 pt-2px bg-secondary"} style={{ cursor: "pointer" }}>{s.role}</small>
                                            </p>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                                    <TextField
                                        className="min-w-100"
                                        label="Finantial Status"
                                        name="finantial_status"
                                        size="small"
                                        variant="outlined"
                                        value={s.finantial_status || 'N/D'}
                                        onChange={({ target: { name, value } }) => changeStudentStatus(value, name, s.user.id, i)}
                                        select
                                    >
                                        {['FULLY_PAID', 'UP_TO_DATE', 'LATE'].map((item, ind) => (
                                            <MenuItem value={item} key={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                                    <TextField
                                        className="min-w-100"
                                        label="Educational Status"
                                        name="educational_status"
                                        size="small"
                                        variant="outlined"
                                        value={s.educational_status || 'N/D'}
                                        onChange={({ target: { name, value } }) => changeStudentStatus(value, name, s.user.id, i)}
                                        select
                                    >
                                        {['ACTIVE', 'POSTPONED', 'SUSPENDED', 'GRADUATED', 'DROPPED', ''].map((item, ind) => (
                                            <MenuItem value={item} key={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                                    <div className="flex justify-end items-center">
                                        <IconButton onClick={() => {
                                            setCurrentStd({ id: s.user.id, positionInArray: i });
                                            setOpenDialog(true);
                                        }}>
                                            <Icon fontSize="small">delete</Icon>
                                        </IconButton>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    ))}
                </div>
                {msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
                    <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
                        {msg.text}
                    </Alert>
                </Snackbar> : ""}
            </div>
            {/* This Dialog opens the modal for the user role in the cohort */}
            <Dialog
                onClose={() => setRoleDialog(false)}
                open={openRoleDialog}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle id="simple-dialog-title">Select a Cohort Role</DialogTitle>
                <List>
                    {['TEACHER', 'ASISTANT', 'STUDENT'].map((role, i) => (
                        <ListItem
                            button
                            onClick={() => {
                                changeStudentStatus(role, "role", currentStd.id, currentStd.positionInArray);
                                setRoleDialog(false)
                            }}
                            key={i}
                        >
                            <ListItemText primary={role} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </Card>
    );
};


export default CohortStudents;
