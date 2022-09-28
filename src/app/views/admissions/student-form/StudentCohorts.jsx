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
import dayjs from 'dayjs';
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const propTypes = {
  stdId: PropTypes.number.isRequired,
};

const actionController = {
  message: {
    educational_status: 'Educational Status',
    finantial_status: 'Finantial Status',
    role: 'Cohort Role'
  },
  options: {
    educational_status: ['ACTIVE', 'POSTPONED', 'SUSPENDED', 'GRADUATED', 'DROPPED'],
    finantial_status: ['FULLY_PAID', 'UP_TO_DATE', 'LATE'],
    role: ['TEACHER', 'ASSISTANT', 'REVIEWER', 'STUDENT']
  }
}

const StudentCohorts = ({ stdId, setCohortOptions }) => {
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
        users: stdId,
      })
      .then(({ data }) => {
        setIsLoading(false);
        if (data.length < 1) {
          setStdCohorts([]);
        } else {
          setStdCohorts(data);
          setCohortOptions(data);
        }
      })
      .catch((error) => error);
  };

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
          user: stdId,
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
        <AsyncAutocomplete
          onChange={(newCohort) => setCohort(newCohort)}
          width="100%"
          label="Search Cohorts"
          getOptionLabel={(option) => `${option.name}, (${option.slug})`}
          asyncSearch={() => axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/academy/cohort`)}
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
                          <small className="border-radius-4 ml-2 px-1 pt-2px bg-dark">{s.cohort.stage}</small>
                        </h6>
                      </Link>
                      <p className="mt-0 mb-6px text-13">
                        <span className="font-medium">{dayjs(s.cohort.kickoff_date).format('DD MMMM, YYYY')}</span>
                        <small>, {dayjs(s.cohort.kickoff_date).fromNow()}</small>
                      </p>
                      <p className="mt-0 mb-6px text-13">
                        <small
                          onClick={() => {
                            setRoleDialog(true);
                            setCurrentStd({ id: s.user.id, positionInArray: i, action: 'role'  });
                          }}
                          onKeyDown={() => {
                            setRoleDialog(true);
                            setCurrentStd({ id: s.user.id, positionInArray: i, action: 'role'  });
                          }}
                          role="none"
                          className="border-radius-4 px-2 pt-2px bg-secondary"
                          style={{ cursor: 'pointer', margin:'0 3px' }}
                        >
                          {s.role}
                        </small>
                        <small
                          onClick={() => {
                            setRoleDialog(true);
                            setCurrentStd({ id: s.user.id, positionInArray: i, action: 'finantial_status'  });
                          }}
                          onKeyDown={() => {
                            setRoleDialog(true);
                            setCurrentStd({ id: s.user.id, positionInArray: i, action: 'finantial_status'  });
                          }}
                          role="none"
                          className="border-radius-4 px-2 pt-2px bg-secondary"
                          style={{ cursor: 'pointer', margin:'0 3px' }}
                        >
                          {s.finantial_status ? s.finantial_status : 'NONE'}
                        </small>
                        <small
                          onClick={() => {
                            setRoleDialog(true);
                            setCurrentStd({ id: s.user.id, positionInArray: i, action: 'educational_status'  });
                          }}
                          onKeyDown={() => {
                            setRoleDialog(true);
                            setCurrentStd({ id: s.user.id, positionInArray: i, action: 'educational_status'  });
                          }}
                          role="none"
                          className="border-radius-4 px-2 pt-2px bg-secondary"
                          style={{ cursor: 'pointer', margin:'0 3px' }}
                        >
                          {s.educational_status}
                        </small>
                      </p>
                    </div>
                  </div>
                </Grid>
                {/* <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                  <TextField
                    className="min-w-100"
                    label="F. Status"
                    name="finantial_status"
                    size="small"
                    variant="outlined"
                    value={s.finantial_status}
                    onChange={({ target: { name, value } }) => {
                      changeStudentStatus(value, name, s.user.id, i);
                    }}
                    select
                  >
                    {['FULLY_PAID', 'UP_TO_DATE', 'LATE'].map((item) => (
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
                    onChange={({ target: { name, value } }) => {
                      changeStudentStatus(value, name, s.user.id, i);
                    }}
                    select
                  >
                    {['ACTIVE', 'POSTPONED', 'SUSPENDED', 'GRADUATED', 'DROPPED'].map((item) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid> */}
                <Grid item lg={8} md={8} sm={6} xs={6} className="text-center">
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
                    <Link to={`/dashboard/student/${s.user.id}/cohort/${s.cohort.id}`}>
                      <Tooltip title="Student Report">
                        <IconButton>
                          <Icon fontSize="small">assignment_ind</Icon>
                        </IconButton>
                      </Tooltip>
                    </Link>
                    {s.watching ? 
                          <Tooltip title="This student is being watched, click to stop watching">
                            <IconButton
                              onClick={() => {
                                changeStudentStatus(false, 'watching', s.user.id, i);
                              }}
                            >
                              <Icon fontSize="small" color="secondary">visibility</Icon>
                            </IconButton>
                          </Tooltip>
                          :
                          <Tooltip title="Add this student to the watchlist">
                            <IconButton
                              onClick={() => {
                                changeStudentStatus(true, 'watching', s.user.id, i);
                              }}
                            >
                              <Icon fontSize="small">visibility_off</Icon>
                            </IconButton>
                          </Tooltip>
                      }
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
        <DialogTitle id="simple-dialog-title">{`Select a ${actionController.message[currentStd.action]}`}</DialogTitle>
        <List>
          {currentStd.action && actionController.options[currentStd.action].map((opt) => (
            <ListItem
              button
              onClick={() => {
                changeStudentStatus(opt, currentStd.action, currentStd.id, currentStd.positionInArray);
                setRoleDialog(false);
              }}
            >
              <ListItemText primary={opt} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
};

StudentCohorts.propTypes = propTypes;

export default StudentCohorts;
