import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import {
  Grid,
  Icon,
  IconButton,
  Select,
  DialogTitle,
  Dialog,
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';
import { getToken, getSession } from "../../../redux/actions/SessionActions"
import { MatxLoading } from '../../../../matx';
import DowndownMenu from '../../../components/DropdownMenu';
import CohortDetails from './CohortDetails';
import CohortStudents from './CohortStudents';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const useStyles = makeStyles(() => ({
  dialogue: {
    color: 'rgba(52, 49, 76, 1)',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
  },
  select: {
    width: '15rem',
  },
}));

const stageMap = [
  {
    value: 'ACTIVE',
    label: 'Active',
  },
  {
    value: 'INACTIVE',
    label: 'Inactive',
  },
  {
    value: 'PREWORK',
    label: 'Prework',
  },
  {
    value: 'FINAL_PROJECT',
    label: 'Final project',
  },
  {
    value: 'ENDED',
    label: 'Ended',
  },
];

const Cohort = () => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [stageDialog, setStageDialog] = useState(false);
  const [cohortDayDialog, setCohortDayDialog] = useState(false);
  const [cohort, setCohort] = useState(null);
  const [maxSyllabusDays, setMaxSyllabusDays] = useState(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [stage, setStage] = useState('');
  const classes = useStyles();

  const [openDialog, setOpenDialog] = useState(false);
  const [url, setUrl] = useState('');

  const token = getToken();
  const session = getSession();

  const options = [
    { label: 'Change cohort stage', value: 'stage' },
    { label: 'Change cohort current day', value: 'current_day' },
    { label: 'Assignments', value: 'assignments' },
    { label: 'Attendancy', value: 'attendancy' },
    { label: 'Instant NPS Survey', value: 'new_survey' },
    { label: cohort?.private ? 'Mark as public' : 'Mark as private', value: 'privacy' },
  ];

  const [newSurvey, setNewSurvey] = useState({
    cohort: slug,
    max_assistants: 2,
    max_teachers: 2,
    duration: '1 00:00:00',
    send_now: true,
  });
  const [openSurveyDialog, setSurveyDialog] = useState(false);

  const handleClose = () => {
    setCohortDayDialog(false);
    setSurveyDialog(false);
  };

  const updateSurvey = (event) => {
    console.log('update survey', event.target.name, event.target.value);
    setNewSurvey({
      ...newSurvey,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    bc.admissions()
      .getCohort(slug)
      .then(({ data }) => {
        setIsLoading(false);
        setCurrentDay(data.current_day);
        setCohort(data);
        setStage(data.stage);
        setMaxSyllabusDays(data.syllabus.certificate.duration_in_days);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (stage === 'ENDED') {
      setCurrentDay(maxSyllabusDays);
    }
  }, [stage]);

  const makePrivate = () => {
    bc.admissions()
      .updateCohort(cohort.id, {
        ...cohort,
        private: !cohort.private,
        syllabus: `${cohort.syllabus.certificate.slug}.v${cohort.syllabus.version}`,
      })
      .then(() => {
        setCohort({ ...cohort, private: !cohort.private });
      })
      .catch((error) => console.log(error));
  };

  const updateCohort = (values) => {
    const { ending_date, ...rest } = values;
    if (values.never_ends) {
      bc.admissions()
        .updateCohort(cohort.id, { ...rest, private: cohort.private, ending_date: null })
        .then((data) => data)
        .catch((error) => console.log(error));
    } else {
      bc.admissions()
        .updateCohort(cohort.id, { ...values, private: cohort.private })
        .then((data) => data)
        .catch((error) => console.log(error));
    }
  };

  const ProfileSchema = Yup.object().shape({
    current_day: Yup.number()
      .max(maxSyllabusDays, `You can not set a day greater than ${maxSyllabusDays}`)
      .required('Please enter a day'),
  });

  return (
    <>
      <div className="m-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <h3 className="mt-0 mb-4 font-medium text-28">
              Cohort:
              {slug}
            </h3>
            <div className="flex">
              <div
                className="px-3 text-11 py-3px border-radius-4 text-white bg-green "
                onClick={() => setStageDialog(true)}
                onKeyDown={() => setStageDialog(true)}
                role="none"
                style={{ cursor: 'pointer' }}
              >
                {cohort && cohort.stage}
              </div>
            </div>
          </div>
          {isLoading && <MatxLoading />}
          <DowndownMenu
            options={options}
            icon="more_horiz"
            onSelect={({ value }) => {

              if (value === 'current_day') {
                setCohortDayDialog(true);
              } else setCohortDayDialog(false);
              if (value === 'stage') {
                setStageDialog(true);
              } else setStageDialog(false);
              if (value === 'new_survey') {
                setSurveyDialog(true);
              } else setSurveyDialog(false);
              if (value === 'privacy') {
                makePrivate();
              }

              if (value === 'attendancy') {
                window.open(`https://attendance.breatheco.de/?token=${token}&cohort_slug=${slug}&academy=${session.academy.id}`)
              } else if (value === 'assignments') {
                window.open(`https://assignments.breatheco.de/?token=${token}&cohort=${slug}&academy=${session.academy.id}`)
              }
            }}
          >
            <Button>
              <Icon>playlist_add</Icon>
              Additional Actions
            </Button>
          </DowndownMenu>
        </div>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            {cohort !== null ? (
              <CohortDetails
                slug={slug}
                language={cohort.language || 'en'}
                endDate={cohort.ending_date}
                startDate={cohort.kickoff_date}
                id={cohort.id}
                syllabus={cohort.syllabus}
                never_ends={cohort.never_ends}
                isPrivate={cohort.private}
                onSubmit={updateCohort}
              />
            ) : (
              ''
            )}
          </Grid>
          <Grid item md={8} xs={12}>
            {cohort !== null ? <CohortStudents slug={slug} cohortId={cohort.id} /> : ''}
          </Grid>
        </Grid>
      </div>
      <Dialog
        onClose={() => setStageDialog(false)}
        open={stageDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Select a Cohort Stage</DialogTitle>
        <Formik
          initialValues={{
            stage,
            current_day: currentDay,
          }}
          enableReinitialize
          validationSchema={ProfileSchema}
          onSubmit={() => {
            updateCohort({
              stage,
              slug: cohort.slug,
              name: cohort.name,
              language: cohort.language,
              kickoff_date: cohort.kickoff_date,
              ending_date: cohort.ending_date,
              current_day: stage === 'ENDED' ? maxSyllabusDays : currentDay,
            });
            setCohort({ ...cohort, stage, current_day: currentDay });
            setStageDialog(false);
          }}
        >
          {({ errors, touched, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="d-flex justify-content-center mt-0 p-4">
              <DialogContent>
                <DialogContentText className={classes.dialogue}>Select a stage:</DialogContentText>
                <TextField
                  select
                  className={classes.select}
                  label="Stage"
                  name="stage"
                  size="small"
                  variant="outlined"
                  defaultValue={cohort.stage}
                  onChange={(e) => {
                    setStage(e.target.value);
                  }}
                >
                  {stageMap.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <DialogContentText className={classes.dialogue}>
                  Select a current day:
                </DialogContentText>
                <TextField
                  error={errors.current_day && touched.current_day}
                  helperText={touched.current_day && errors.current_day}
                  type="number"
                  name="current_day"
                  size="small"
                  variant="outlined"
                  value={stage === 'ENDED' ? maxSyllabusDays : currentDay}
                  onChange={(e) => {
                    setCurrentDay(e.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions className={classes.button}>
                <Button color="primary" variant="contained" type="submit">
                  Send now
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
      <Dialog onClose={handleClose} open={cohortDayDialog} aria-labelledby="simple-dialog-title">
        <DialogTitle id="simple-dialog-title">
          Change cohort current day
          {' '}
          <br />
          <small className="text-muted">{`This syllabus has a maximum duration of ${maxSyllabusDays} days.`}</small>
        </DialogTitle>
        <Formik
          initialValues={{
            current_day: currentDay,
          }}
          enableReinitialize
          validationSchema={ProfileSchema}
          onSubmit={() => {
            updateCohort({
              stage: cohort.stage,
              slug: cohort.slug,
              name: cohort.name,
              language: cohort.language,
              kickoff_date: cohort.kickoff_date,
              ending_date: cohort.ending_date,
              current_day: currentDay,
            });
            setCohort({ ...cohort, current_day: currentDay });
            handleClose();
          }}
        >
          {({ errors, touched, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="d-flex justify-content-center mt-0 p-4">
              <DialogContent>
                <DialogContentText className={classes.dialogue}>
                  Select a current day:
                </DialogContentText>
                <TextField
                  error={errors.current_day && touched.current_day}
                  helperText={touched.current_day && errors.current_day}
                  type="number"
                  label="day"
                  name="current_day"
                  size="small"
                  variant="outlined"
                  defaultValue={cohort.current_day}
                  onChange={(e) => {
                    setCurrentDay(e.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions className={classes.button}>
                <Button color="primary" variant="contained" type="submit">
                  Send now
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
      <Dialog onClose={handleClose} open={openSurveyDialog} aria-labelledby="simple-dialog-title">
        <DialogTitle id="simple-dialog-title">New Instant Survey</DialogTitle>
        <Formik
          initialValues={newSurvey}
          enableReinitialize
          onSubmit={() => {
            bc.feedback()
              .addNewSurvey({ ...newSurvey, cohort: cohort.id })
              .then((res) => {
                if (res === undefined) setOpenDialog(false);
                if (res.data) {
                  setUrl(res.data.public_url);
                }
                setOpenDialog(true);
              })
              .catch((error) => error);
          }}
        >
          {({ handleSubmit }) => (
            <form className="p-4" onSubmit={handleSubmit}>
              <DialogContent>
                <DialogContentText className={classes.dialogue}>Cohort:</DialogContentText>
                <TextField
                  type="text"
                  label="Cohort"
                  name="cohort"
                  size="small"
                  variant="outlined"
                  defaultValue={slug}
                />
                <DialogContentText className={classes.dialogue}>
                  Max assistants to ask:
                </DialogContentText>
                <TextField
                  type="number"
                  label="Max assistants"
                  name="max_assistants"
                  size="small"
                  variant="outlined"
                  defaultValue={newSurvey.max_assistants}
                  onChange={updateSurvey}
                />
                <DialogContentText className={classes.dialogue}>
                  Max assistants of teachers:
                </DialogContentText>
                <TextField
                  type="number"
                  label="Max teachers"
                  name="max_teachers"
                  size="small"
                  variant="outlined"
                  defaultValue={newSurvey.max_teachers}
                  onChange={updateSurvey}
                />
                <DialogContentText className={classes.dialogue}>Duration:</DialogContentText>
                <Select
                  native
                  label="Duration"
                  name="duration"
                  variant="outlined"
                  size="small"
                  value={newSurvey.duration}
                  onChange={updateSurvey}
                >
                  <option value="01:00:00">1 Hr</option>
                  <option value="03:00:00">3 Hr</option>
                  <option value="1 00:00:00">1 Day</option>
                  <option value="2 00:00:00">2 Day</option>
                </Select>
              </DialogContent>
              <DialogActions>
                <Button color="primary" variant="contained" type="submit" onClick={handleClose}>
                  Send now
                </Button>
                <Button color="danger" variant="contained" onClick={handleClose}>
                  Close
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default Cohort;
