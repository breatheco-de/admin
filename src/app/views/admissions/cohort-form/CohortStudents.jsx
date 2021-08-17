import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { MatxLoading } from '../../../../matx';
import bc from '../../../services/breathecode';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import { useQuery } from '../../../hooks/useQuery';

const propTypes = {
  cohortId: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: '4px solid rgba(var(--body), 0.03)',
    boxShadow: theme.shadows[3],
  },
}));

const CohortStudents = ({ slug, cohortId }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [studenList, setStudentsList] = useState([]);
  const [currentStd, setCurrentStd] = useState({});
  const [openRoleDialog, setRoleDialog] = useState(false);
  const [user, setUser] = useState(null);
  // Redux actions and store
  const query = useQuery();
  const [queryLimit, setQueryLimit] = useState(query.get('limit') || 10);
  const [hasMore, setHasMore] = useState(true);
  const handlePaginationNextPage = () => {
    setQueryLimit((prevQueryLimit) => prevQueryLimit + 10);
  };
  const getCohortStudents = () => {
    setIsLoading(true);
    const queryData = {
      cohorts: slug,
      limit: queryLimit,
      offset: 0,
    };
    bc.admissions()
      .getAllUserCohorts(queryData)
      .then((data) => {
        if (data.status >= 200 && data.status < 300) {
          const { results, next } = data.data;
          setHasMore(next !== null);
          setIsLoading(false);
          if (results.length < 1) {
            setStudentsList([]);
          } else setStudentsList(results);
        }
      })
      .catch((error) => error);
  };
  useEffect(() => {
    getCohortStudents();
  }, [queryLimit]);

  const changeStudentStatus = (value, name, studentId, i) => {
    const sStatus = {
      role: studenList[i].role,
      finantial_status: studenList[i].finantial_status,
      educational_status: studenList[i].educational_status,
    };
    bc.admissions()
      .updateCohortUserInfo(cohortId, studentId, {
        ...sStatus,
        [name]: value,
      })
      .then((data) => {
        if (data.status >= 200) getCohortStudents();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addUserToCohort = (userId) => {
    bc.admissions()
      .addUserCohort(cohortId, {
        user: userId,
        role: 'STUDENT',
        finantial_status: null,
        educational_status: 'ACTIVE',
      })
      .then((data) => {
        if (data.status >= 200 && data.status < 300) getCohortStudents();
      })
      .catch((error) => error);
  };

  const deleteUserFromCohort = () => {
    bc.admissions()
      .deleteUserCohort(cohortId, currentStd.id)
      .then((data) => {
        if (data.status === 204) getCohortStudents();
      })
      .catch((error) => error);
    setOpenDialog(false);
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
          Are you sure you want to delete this user from cohort
          {slug.toUpperCase()}
          ?
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
      <div className="mb-4 flex justify-between items-center">
        <h4 className="m-0 font-medium">Cohort Members</h4>
        <div className="text-muted text-13 font-medium">
          {format(new Date(), 'MMM dd, yyyy')}
          at
          {format(new Date(), 'HH:mm:aa')}
        </div>
      </div>
      <Divider className="mb-6" />

      <div className="flex mb-6">
        <AsyncAutocomplete
          onChange={(userData) => setUser(userData)}
          width="100%"
          label="Search Users"
          asyncSearch={(searchTerm) => bc.auth().getAllUsers(searchTerm)}
          debounced
          getOptionLabel={(option) => `${option.first_name} ${option.last_name}, (${option.email})`}
        >
          <Button
            className="ml-3 px-7 font-medium text-primary bg-light-primary whitespace-pre"
            onClick={() => addUserToCohort(user.id)}
          >
            Add to cohort
          </Button>
        </AsyncAutocomplete>
      </div>

      <div className="overflow-auto">
        {isLoading && <MatxLoading />}
        <div className="min-w-600">
          {studenList.length > 0
            && studenList.map((s, i) => (
              <div key={s.user.id} className="py-4">
                <Grid container alignItems="center">
                  <Grid item lg={6} md={6} sm={6} xs={6}>
                    <div className="flex">
                      <Avatar
                        className={clsx('h-full w-full mb-6 mr-2', classes.avatar)}
                        src={s.user.profile !== undefined ? s.user.profile.avatar_url : ''}
                      />
                      <div className="flex-grow">
                        <Link to={`/admissions/students/${s.user.id}`}>
                          <h6 className="mt-0 mb-0 text-15 text-primary">
                            {s.user.first_name}
                            {' '}
                            {s.user.last_name}
                          </h6>
                        </Link>
                        <p className="mt-0 mb-6px text-13">
                          <span className="font-medium">{s.created_at}</span>
                        </p>
                        <p className="mt-0 mb-6px text-13">
                          <small
                            aria-hidden="true"
                            onClick={() => {
                              setRoleDialog(true);
                              setCurrentStd({ id: s.user.id, positionInArray: i });
                            }}
                            className="border-radius-4 px-2 pt-2px bg-secondary"
                            style={{ cursor: 'pointer' }}
                          >
                            {s.role}
                          </small>
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
                      value={s.finantial_status || ''}
                      onChange={({ target: { name, value } }) => {
                        changeStudentStatus(value, name, s.user.id, i);
                      }}
                      select
                    >
                      {['NONE', 'FULLY_PAID', 'UP_TO_DATE', 'LATE'].map((item) => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item lg={2} md={4} sm={2} xs={2} className="text-center">
                    <TextField
                      className="min-w-100"
                      label="Educational Status"
                      name="educational_status"
                      size="small"
                      variant="outlined"
                      value={s.educational_status || ''}
                      onChange={({ target: { name, value } }) => {
                        changeStudentStatus(value, name, s.user.id, i);
                      }}
                      select
                    >
                      {['ACTIVE', 'POSTPONED', 'SUSPENDED', 'GRADUATED', 'DROPPED', ''].map(
                        (item) => (
                          <MenuItem value={item} key={item}>
                            {item}
                          </MenuItem>
                        ),
                      )}
                    </TextField>
                  </Grid>
                  <Grid item lg={2} md={2} sm={2} xs={2} className="text-center">
                    <div className="flex justify-end items-center">
                      <IconButton
                        onClick={() => {
                          setCurrentStd({ id: s.user.id, positionInArray: i });
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
          <div>
            <Button
              disabled={!hasMore}
              fullWidth
              className="text-primary bg-light-primary"
              onClick={() => {
                handlePaginationNextPage();
              }}
            >
              {hasMore ? 'Load More' : 'No more students to load'}
            </Button>
          </div>
        </div>
      </div>
      {/* This Dialog opens the modal for the user role in the cohort */}
      <Dialog
        onClose={() => setRoleDialog(false)}
        open={openRoleDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Select a Cohort Role</DialogTitle>
        <List>
          {['TEACHER', 'ASSISTANT', 'REVIEWER', 'STUDENT'].map((role) => (
            <ListItem
              button
              onClick={() => {
                changeStudentStatus(role, 'role', currentStd.id, currentStd.positionInArray);
                setRoleDialog(false);
              }}
              key={role}
            >
              <ListItemText primary={role} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
};

CohortStudents.propTypes = propTypes;

export default CohortStudents;
