import React, { useState } from 'react';
import { Formik } from 'formik';
import {
  Grid,
  Card,
  Divider,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
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
  // const [schedule, setSchedule] = useState(null);
  const [checked, setChecked] = useState(false);
  const [neverEnd, setNeverEnd] = useState(true);
  const [newCohort, setNewCohort] = useState({
    name: '',
    slug: '',
    kickoff_date: startDate,
    ending_date: null,
    never_ends: false,
  });
  const { academy } = JSON.parse(localStorage.getItem('bc-session'));
  const history = useHistory();

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

  const postCohort = (values) => {
    bc.admissions()
      // .addCohort({ ...values, syllabus: `${syllabus.slug}.v${version.version}`,
      //   specialty_mode: schedule.id })
      .addCohort({ ...values, syllabus: `${syllabus.slug}.v${version.version}`, specialty_mode: null })
      .then((data) => {
        if (data.status === 201) {
          history.push('/admissions/cohorts');
        }
      })
      .catch((error) => console.log(error));
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

      <Card elevation={3} >
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
                      className="mr-2 ml-2"
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
                        debounced={false}
                        onChange={(v) => setVersion(v)}
                        width="20%"
                        key={syllabus.slug}
                        asyncSearch={() => bc.admissions()
                          .getAllCourseSyllabus(syllabus.slug)}
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
                {/* <Grid item md={2} sm={4} xs={12}>
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
                      return bc.admissions()
                        .getAllRelatedSchedulesById(syllabus?.id);
                    }}
                    size="small"
                    data-cy="schedule"
                    label="Schedule"
                    required
                    getOptionLabel={(certificate) => `${certificate.name}`}
                    value={schedule}
                    disabled={!syllabus}
                  />
                </Grid> */}
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
                      onChange={(date) => setNewCohort({
                        ...newCohort,
                        kickoff_date: date,
                      })}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={2} sm={4} xs={12} className={neverEnd ? '' : classes.neverEnd}>
                  End date
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
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
                      onChange={(date) => setNewCohort({
                        ...newCohort,
                        ending_date: date,
                        never_ends: false,
                      })}
                      disabled={!neverEnd}
                      required
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={checked}
                        onChange={handleNeverEnd}
                        name="endingDate"
                        data-cy="never-ends"
                        color="primary"
                      />
                    )}
                    label="This cohort never ends."
                  />
                </Grid>
              </Grid>
              <div className="mt-6">
                <Button color="primary" variant="contained" type="submit" data-cy="submit">
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
