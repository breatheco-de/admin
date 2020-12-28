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
  CircularProgress
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import axios from "../../../../axios";
import { MatxLoading } from "matx";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";

const InvoiceOverview = ({ std_id }) => {
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [stdCohorts, setStdCohorts] = useState([]);
  const [currentStd, setCurrentStd] = useState({});
  const [openRoleDialog, setRoleDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [allCohorts, setAllCohorts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = React.useState("");
  useEffect(() => {
    getStudentCohorts();
    getAllCohorts();
  }, [])

  const changeStudentStatus = (value, name, studentId, i) => {
    console.log(value, name, i)
    const s_status = {
      role: stdCohorts[i].role,
      finantial_status: stdCohorts[i].finantial_status,
      educational_status: stdCohorts[i].educational_status
    }
    axios.put(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${stdCohorts[i].cohort.id}/user/${studentId}`, { ...s_status, [name]: value })
      .then((data) => {
        console.log(data)
        if (data.status >= 200) {
          setMsg({ alert: true, type: "success", text: "User status updated" });
          getStudentCohorts();
        } else setMsg({ alert: true, type: "error", text: "Could not update user status" })
      })
      .catch(error => {
        setMsg({ alert: true, type: "error", text: error.details || error.role[0] });
        console.log(error)
      })
  }

  const getStudentCohorts = () => {
    setIsLoading(true);
    axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/user?users=${std_id}`)
      .then(({ data }) => {
        console.log(data)
        setIsLoading(false);
        data.length < 1 ? setMsg({ alert: true, type: "error", text: "This user have not cohorts assigned" }) : setStdCohorts(data)
      })
      .catch(error => setMsg({ alert: true, type: "error", text: error.details }))
  }

  const getAllCohorts = () => {
    setIsLoading(true);
    axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/`)
      .then(({ data }) => {
        console.log(data);
        setAllCohorts(data);
        setIsLoading(false);
      })
      .catch(error => console.log(error))
  }

  const deleteUserFromCohort = () => {
    axios.delete(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${currentStd.cohort_id}/user/${currentStd.id}`)
      .then((data) => {
        if (data.status === 204) {
          setMsg({ alert: true, type: "success", text: "User have been deleted from cohort" });
          getStudentCohorts();
        }
        else setMsg({ alert: true, type: "error", text: "Delete not successfull" })
      })
      .catch(error => setMsg({ alert: true, type: "error", text: error.details + " or permission denied" }))
    setOpenDialog(false);
  }
  const addUserToCohort = (cohort_id) => {
    console.log(cohort_id)
    axios.post(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${cohort_id}/user`, {
      user: std_id,
      role: "STUDENT",
      finantial_status: null,
      educational_status: "ACTIVE"
    }).then((data) => {
      if (data.status >= 200) {
        setMsg({ alert: true, type: "success", text: "User added successfully" });
        getStudentCohorts();
      } else setMsg({ alert: true, type: "error", text: "Could not add user to cohort" })
    })
      .catch(error => {
        console.log(error)
        setMsg({ alert: true, type: "error", text: error.details });
      })
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
          Are you sure you want to delete this user from this cohort?
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
      {/* This Dialog opens the modal to delete the user in the cohort */}
      {isLoading && <MatxLoading />}
      <div className="mb-4 flex justify-between items-center">
        <h4 className="m-0 font-medium">Cohorts</h4>
      </div>
      <Divider className="mb-6" />

      <div className="flex mb-6">
        <Autocomplete
          id="asynchronous-demo"
          style={{ width: "100%" }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          getOptionSelected={(option, value) => {
            setSelect(value.id);
            return option.name === value.name
          }}
          getOptionLabel={option => `${option.name}, (${option.slug})`}
          options={allCohorts}
          loading={loading}
          renderInput={params => (
            <TextField
              {...params}
              label="Search users"
              fullWidth
              variant="outlined"
              onChange={({ target: { value } }) => {
                allCohorts.filter((item) => {
                  return value === "" || item.name.includes(value) || item.slug.includes(value)
                }).map(item => `${item.name} (${item.slug})`)
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          )}
        />
        <Button className="ml-3 px-7 font-medium text-primary bg-light-primary whitespace-pre" onClick={() => addUserToCohort(select)}>
          Add to cohort
        </Button>
      </div>

      <div className="overflow-auto">
        <div className="min-w-600">
          {stdCohorts.map((s, i) => (
            <div key={s.id} className="py-4">
              <Grid container alignItems="center">
                <Grid item lg={4} md={4} sm={6} xs={6}>
                  <div className="flex">
                    <div className="flex-grow">
                      <h6 className="mt-0 mb-0 text-15 text-primary">
                        {s.cohort.name}
                      </h6>
                      <p className="mt-0 mb-6px text-13">
                        <span className="font-medium">{s.cohort.kickoff_date}</span>
                      </p>
                      <p className="mt-0 mb-6px text-13">
                        <small onClick={() => {
                          setRoleDialog(true);
                          setCurrentStd({ id: s.user.id, positionInArray: i });
                        }} className={"border-radius-4 px-2 pt-2px bg-secondary"} style={{ cursor: "pointer" }}>{s.role}</small>
                      </p>
                    </div>
                  </div>
                </Grid>
                <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                  <TextField
                    className="min-w-100"
                    label="F. Status"
                    name="finantial_status"
                    size="small"
                    variant="outlined"
                    value={s.finantial_status}
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
                    label="E. Status"
                    name="educational_status"
                    size="small"
                    variant="outlined"
                    value={s.educational_status}
                    onChange={({ target: { name, value } }) => changeStudentStatus(value, name, s.user.id, i)}
                    select
                  >
                    {['ACTIVE', 'POSTPONED', 'SUSPENDED', 'GRADUATED', 'DROPPED'].map((item, ind) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                  <div className="flex justify-end items-center">
                    <IconButton onClick={() => {
                      setCurrentStd({ id: s.user.id, positionInArray: i, cohort_id: s.cohort.id });
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
      </div>

      <Dialog
        onClose={() => setRoleDialog(false)}
        open={openRoleDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Select a Cohort Role</DialogTitle>
        <List>
          {['TEACHER', 'ASSISTANT', 'STUDENT'].map((role, i) => (
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
      {msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
        <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
          {msg.text}
        </Alert>
      </Snackbar> : ""}
    </Card>
  );
};



export default InvoiceOverview;
