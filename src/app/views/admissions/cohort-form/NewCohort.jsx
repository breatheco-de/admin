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
  const [cert, setCert] = useState(null);
  const [version, setVersion] = useState(null);
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
      .addCohort({ ...values, syllabus: `${cert.slug}.v${version.version}` })
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

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Cohort</h4>
        </div>
        <Divider className="mb-2" />

        <Formik initialValues={newCohort} onSubmit={(e) => postCohort(e)} enableReinitialize>
          {({ handleSubmit }) => (
            <form className="p-4" onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                <Grid item md={2} sm={4} xs={12}>
                  Cohort Name
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Cohort Name"
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
                      onChange={(certificate) => setCert(certificate)}
                      width="30%"
                      className="mr-2 ml-2"
                      asyncSearch={() => bc.admissions().getCertificates()}
                      size="small"
                      label="Certificate"
                      required
                      getOptionLabel={(option) => `${option.name}`}
                      value={cert}
                    />
                    {cert !== null ? (
                      <AsyncAutocomplete
                        debounced={false}
                        onChange={(v) => setVersion(v)}
                        width="20%"
                        key={cert.slug}
                        asyncSearch={() => {
                          bc.admissions().getAllCourseSyllabus(cert.slug, academy.id);
                        }}
                        size="small"
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
                      name="ending_date"
                      className="m-2"
                      margin="none"
                      label="End date"
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
                        name="ending_date"
                        color="primary"
                      />
                    )}
                    label="This cohort never ends."
                  />
                </Grid>
              </Grid>
              <div className="mt-6">
                <Button color="primary" variant="contained" type="submit">
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
