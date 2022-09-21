import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Tooltip,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { MatxLoading } from '../../../../matx';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';
import axios from '../../../../axios';
import { Store } from '../../../redux/Store';

const propTypes = {
  staffId: PropTypes.number.isRequired,
};

const CohortStaff = ({ staffId, setCohortOptions, user }) => {
  const [setMsg] = useState({ alert: false, type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [stdCohorts, setStdCohorts] = useState([]);
  const [currentStd, setCurrentStd] = useState({});
  const [openRoleDialog, setRoleDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [cohort, setCohort] = useState(null);

  const getStudentCohorts = () => {
    setIsLoading(true);
    bc.admissions()
      .getAllUserCohorts({
        users: staffId,
      })
      .then(async ({ data }) => {
        const { data: surveysData } = await bc.feedback().getSurveys();

        setIsLoading(false);
        if (data.length < 1) {
          setStdCohorts([]);
        } else {
          data.forEach((item, index, arr)=>{
            arr[index].survey = surveysData.filter(p => p.cohort.slug == item.cohort.slug && isNumeric(p.avg_score));
            arr[index].surveyScore = findAverage(arr[index].survey, "avg_score");
          });

          setStdCohorts(data);
          setCohortOptions(data);
        }
      })
      .catch((error) => error);
  };

  const findAverage = (arr, attr) => {
    const { length } = arr;
    return arr.reduce((acc, val) => {
      return Math.round((acc + (val[attr]/length)) * 100) / 100
    }, 0);
 };

 const isNumeric = (str) => {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  useEffect(() => {
    getStudentCohorts();
  }, []);

  const changeStudentStatus = (value, name, studentId, i) => {
    const sStatus = {
      role: stdCohorts[i].role.toUpperCase(),
      finantial_status: stdCohorts[i].finantial_status,
      educational_status: stdCohorts[i].educational_status,
      [name]: value,
    };

    bc.admissions()
      .updateCohortUserInfo(stdCohorts[i].cohort.id, studentId, sStatus)
      .then((data) => {
        if (data.status >= 200) getStudentCohorts();
      })
      .catch((error) => error);
  };

  const deleteUserFromCohort = () => {
    bc.admissions()
      .deleteUserCohort(currentStd.cohort_id, currentStd.id)
      .then((data) => {
        if (data.status === 204) getStudentCohorts();
      })
      .catch((error) => error);
    setOpenDialog(false);
  };
  const addUserToCohort = () => {
    if (cohort === null) setMsg({ alert: true, type: 'warning', text: 'Select a cohort' });
    else {
      bc.admissions()
        .addUserCohort(cohort.id, {
          user: staffId,
          role: 'STUDENT',
          finantial_status: null,
          educational_status: 'ACTIVE',
        })
        .then((data) => {
          if (data.status >= 200) getStudentCohorts();
        })
        .catch((error) => error);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <Grid lg={3} md={3} sm={3} xs={3}>
          <Card className="p-4">
            <div className="flex-column items-center ">
              <h3>{`${findAverage(stdCohorts.filter((cohort) => cohort.surveyScore !== 0), "surveyScore")}/10`}</h3>
              <p>{`${user?.user.first_name} ${user?.user.last_name}`}</p>
            </div>
          </Card>
        </Grid>
      </div>

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
            <Button
              color="primary"
              autoFocus
              onClick={() => deleteUserFromCohort()}
            >
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
          <AsyncAutocomplete
            onChange={(newCohort) => setCohort(newCohort)}
            width="100%"
            label="Search Cohorts"
            getOptionLabel={(option) => `${option.name}, (${option.slug})`}
            asyncSearch={() =>
              axios.get(
                `${Store.getState().host}/v1/admissions/academy/cohort`
              )
            }
          >
            <Button
              className="ml-3 px-7 font-medium text-primary bg-light-primary whitespace-pre"
              onClick={() => addUserToCohort()}
            >
              Add to cohort
            </Button>
          </AsyncAutocomplete>
        </div>
        <div className="overflow-auto">
          <div className="min-w-600">
            {stdCohorts.map((s, i) => (
              <div key={s.id} className="py-4">
                <Grid container alignItems="center">
                  <Grid item lg={4} md={4} sm={6} xs={6}>
                    <div className="flex">
                      <div className="flex-grow">
                        <Link to={`/admissions/cohorts/${s.cohort.slug}`}>
                          <h6 className="mt-0 mb-0 text-15 text-primary">
                            {s.cohort.name}
                          </h6>
                        </Link>
                        <p className="mt-0 mb-6px text-13">
                          <span className="font-medium">
                            {s.cohort.kickoff_date}
                          </span>
                        </p>
                        <p className="mt-0 mb-6px text-13">
                          <small
                            onClick={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                              });
                            }}
                            onKeyDown={() => {
                              setRoleDialog(true);
                              setCurrentStd({
                                id: s.user.id,
                                positionInArray: i,
                              });
                            }}
                            role="none"
                            className="border-radius-4 px-2 pt-2px bg-secondary"
                            style={{ cursor: "pointer" }}
                          >
                            {s.role}
                          </small>
                        </p>
                      </div>
                    </div>
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    md={4}
                    sm={4}
                    xs={4}
                    className="text-center"
                  >
                    <div>{`Rating: ${s.surveyScore}/10`}</div>
                  </Grid>
                  <Grid
                    item
                    lg={2}
                    md={2}
                    sm={2}
                    xs={2}
                    className="text-center"
                  >
                    <div className="flex justify-end items-center">
                      <IconButton
                        onClick={() => {
                          setCurrentStd({
                            id: s.user.id,
                            positionInArray: i,
                            cohort_id: s.cohort.id,
                          });
                          setOpenDialog(true);
                        }}
                      >
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
          <DialogTitle id="simple-dialog-title">
            Select a Cohort Role
          </DialogTitle>
          <List>
            {["TEACHER", "ASSISTANT", "REVIEWER", "STUDENT"].map((role) => (
              <ListItem
                button
                onClick={() => {
                  changeStudentStatus(
                    role,
                    "role",
                    currentStd.id,
                    currentStd.positionInArray
                  );
                  setRoleDialog(false);
                }}
              >
                <ListItemText primary={role} />
              </ListItem>
            ))}
          </List>
        </Dialog>
      </Card>
    </>
  );
};

CohortStaff.propTypes = propTypes;

export default CohortStaff;
