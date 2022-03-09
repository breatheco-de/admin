import React, { useState } from 'react';
import { Formik } from 'formik';
import {
  Grid,
  Card,
  Divider,
  TextField,
  Button,
  Input,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Breadcrumb } from '../../../../matx';
import bc from '../../../services/breathecode';
import { AsyncAutocomplete } from '../../../components/Autocomplete';

const useStyles = makeStyles(({ palette }) => ({
  neverEnd: {
    color: palette.text.secondary,
  },
}));

const NewCohort = () => {
  const classes = useStyles();
  const startDate = new Date();
  const [syllabus, setSyllabus] = useState(null);
  const [version, setVersion] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [checked, setChecked] = useState(false);
  const [neverEnd, setNeverEnd] = useState(true);
  const [timeZone, setTimeZone] = useState('');
  const [language, setLanguage] = useState('EN');
  const [newCohort, setNewCohort] = useState({
    name: '',
    slug: '',
    language: '',
    kickoff_date: startDate,
    ending_date: null,
    never_ends: false,
    time_zone: '',
  });
  const { academy } = JSON.parse(localStorage.getItem('bc-session'));
  const history = useHistory();
  const languages = [
    {
      value: 'ES',
      label: 'Spanish',
    },
    {
      value: 'EN',
      label: 'English',
    },
  ];

  const handleNeverEnd = (event) => {
    setChecked(event.target.checked);
    setNeverEnd(!neverEnd);
    setNewCohort({
      ...newCohort,
      ending_date: null,
      never_ends: true,
    });
  };

  const createCohort = (event) => {
    setNewCohort({
      ...newCohort,
      [event.target.name]: event.target.value,
    });
  };

  const languageCohort = (event) => {
    setNewCohort({
      ...newCohort,
      language: event.target.value,
    });
  };

  const postCohort = (values) => {
    bc.admissions()
      .addCohort({
        ...values,
        time_zone: `${timeZone}`,
        syllabus: `${syllabus.slug}.v${version.version}`,
        schedule: schedule?.id,
      })
      .then((data) => {
        if (data.status === 201) {
          history.push('/admissions/cohorts');
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Admin', path: '/admin' },
            { name: 'Cohort', path: '/admissions/cohorts' },
            { name: 'New Cohort' },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Cohort</h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={newCohort}
          onSubmit={(newPostCohort) => postCohort(newPostCohort)}
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <form className="p-4" onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                <Grid item md={2} sm={4} xs={12}>
                  Cohort Name
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Cohort Name"
                    data-cy="name"
                    name="name"
                    size="small"
                    variant="outlined"
                    value={newCohort.name}
                    onChange={createCohort}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Cohort Slug
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Cohort Slug"
                    data-cy="slug"
                    name="slug"
                    size="small"
                    variant="outlined"
                    value={newCohort.slug}
                    onChange={createCohort}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Syllabus
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <div className="flex flex-wrap m--2">
                    <AsyncAutocomplete
                      debounced={false}
                      onChange={(x) => setSyllabus(x)}
                      width="30%"
                      className="m-4"
                      asyncSearch={() => bc.admissions().getAllSyllabus()}
                      size="small"
                      data-cy="syllabus"
                      label="syllabus"
                      required
                      getOptionLabel={(option) => `${option.name}`}
                      value={syllabus}
                    />
                    {syllabus ? (
                      <AsyncAutocomplete
                        className="m-4"
                        debounced={false}
                        onChange={(v) => setVersion(v)}
                        width="30%"
                        key={syllabus.slug}
                        asyncSearch={() =>
                          bc.admissions().getAllCourseSyllabus(syllabus.slug)
                        }
                        size="small"
                        data-cy="version"
                        label="Version"
                        required
                        getOptionLabel={(option) => `${option.version}`}
                        value={version}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Schedule
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AsyncAutocomplete
                    className="m-2"
                    debounced={false}
                    onChange={(v) => setSchedule(v)}
                    width="20%"
                    key={syllabus ? syllabus.slug : ''}
                    asyncSearch={() => {
                      if (!syllabus) {
                        return Promise.resolve([]);
                      }
                      return bc
                        .admissions()
                        .getAllRelatedSchedulesById(syllabus?.id, academy?.id);
                    }}
                    size="small"
                    data-cy="schedule"
                    label="Schedule"
                    required
                    getOptionLabel={(certificate) => `${certificate.name}`}
                    value={schedule}
                    disabled={!syllabus}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Language
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="Language"
                    data-cy="language"
                    size="small"
                    style={{ width: '20%' }}
                    variant="outlined"
                    value={newCohort.language}
                    onChange={languageCohort}
                    select
                  >
                    {languages.map((option) => (
                      <MenuItem
                        value={option.value}
                        key={option.value}
                        width="40%"
                      >
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Start date
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      className="m-2"
                      margin="none"
                      label="Date"
                      inputVariant="outlined"
                      type="text"
                      size="small"
                      data-cy="start-date"
                      autoOk
                      value={newCohort.kickoff_date}
                      format="MMMM dd, yyyy"
                      onChange={(date) =>
                        setNewCohort({
                          ...newCohort,
                          kickoff_date: date,
                        })
                      }
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid
                  item
                  md={2}
                  sm={4}
                  xs={12}
                  className={neverEnd ? '' : classes.neverEnd}
                >
                  End date
                </Grid>
                <Grid item md={3} sm={4} xs={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      name="endingDate"
                      className="m-2"
                      margin="none"
                      label="End date"
                      data-cy="end-date"
                      inputVariant="outlined"
                      type="text"
                      size="small"
                      value={newCohort.ending_date}
                      format="MMMM dd, yyyy"
                      onChange={(date) =>
                        setNewCohort({
                          ...newCohort,
                          ending_date: date,
                          never_ends: false,
                        })
                      }
                      disabled={!neverEnd}
                      required
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={7} sm={4} xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleNeverEnd}
                        name="endingDate"
                        data-cy="never-ends"
                        color="primary"
                        className="text-left"
                      />
                    }
                    label="This cohort never ends."
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Live meeting URL
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    className="m-2"
                    label="URL"
                    width="100%"
                    name="online_meeting_url"
                    data-cy="meetingURL"
                    size="small"
                    variant="outlined"
                    placeholder="https://bluejeans.com/<id>"
                    value={newCohort.online_meeting_url}
                    onChange={createCohort}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Timezone
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <div className="flex flex-wrap m--2">
                    <AsyncAutocomplete
                      debounced={false}
                      onChange={(x) => setTimeZone(x)}
                      width="40%"
                      className="m-4"
                      asyncSearch={() => bc.admissions().getAllTimeZone()}
                      size="small"
                      data-cy="timezone"
                      label="Timezone"
                      getOptionLabel={(option) => `${option}`}
                      value={timeZone}
                    />
                  </div>
                </Grid>
              </Grid>
              <div className="mt-6">
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  data-cy="submit"
                >
                  Create
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default NewCohort;
