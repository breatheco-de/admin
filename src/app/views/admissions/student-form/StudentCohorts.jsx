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
import config from '../../../../config.js';
import { getSession } from '../../../redux/actions/SessionActions';
import BasicTabs from 'app/components/smartTabs';

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
    educational_status: ['ACTIVE', 'POSTPONED', 'SUSPENDED', 'GRADUATED', 'DROPPED', 'NOT_COMPLETING'],
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
  const session = getSession();

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

  const tabs = [
    {
      disabled: false,
      label: 'Cohorts',
    },
    {
      disabled: false,
      component: <div>Payments Content</div>,
      label: 'Plans',
    },
  ];

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={7} xs={12}>
          <BasicTabs tabs={tabs} />
        </Grid>
      </Grid>
      <Card className="p-4">
      {isLoading && <MatxLoading />}
      <div className="mb-4 flex justify-between items-center">
        <h4 className="m-0 font-medium"></h4>
        <Button
          className="px-7 font-medium text-primary bg-light-primary whitespace-pre"
          onClick={() => addUserToCohort()}
        >
          Add to plan
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
    </>
  );
};

StudentCohorts.propTypes = propTypes;

export default StudentCohorts;
