import React, { useEffect, useState } from 'react';
import {
  Divider,
  Card,
  Grid,
  IconButton,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Formik } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';

const propTypes = {
  slug: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  specialtyMode: PropTypes.shape({
    slug: PropTypes.string,
    name: PropTypes.string,
    syllabus: PropTypes.number,
  }).isRequired,
  syllabusVersion: PropTypes.shape({
    version: PropTypes.number,
    syllabus: PropTypes.number,
  }).isRequired,
  neverEnds: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool.isRequired,
};
makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: '4px solid rgba(var(--body), 0.03)',
    boxShadow: theme.shadows[3],
  },
}));

const CohortDetails = ({
  slug,
  endDate,
  startDate,
  language,
  onSubmit,
  specialtyMode,
  syllabusVersion,
  neverEnds,
  isPrivate,
  timeZone
}) => {
  const { academy } = JSON.parse(localStorage.getItem('bc-session'));
  const [syllabus, setSyllabus] = useState(null);
  const [cert, setCert] = useState(specialtyMode);
  const [version, setVersion] = useState(syllabusVersion);
  const [timezone, setTimezone] = useState('America/Caracas');

  useEffect(() => {
    // setIsLoading(true);
    const model = syllabusVersion;
    if (model) {
      bc.admissions()
        .getSyllabus(model.syllabus)
        .then(({ data }) => {
          // setIsLoading(false);
          setSyllabus(data);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  return (
    <Card className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h4 className="m-0 font-medium">Cohort Details</h4>
      </div>
      <Divider className="mb-6" />
      <Formik
        initialValues={{
          slug,
          language,
          ending_date: endDate,
          kickoff_date: startDate,
          never_ends: neverEnds,
          specialtyMode,
          timezone: timeZone,
        }}
        onSubmit={({ specialtyMode, ...values }) => {
          const specialtyModeId = cert ? cert.id : null;
          return onSubmit({
            ...values,
            syllabus: `${syllabus.slug}.v${version.version}`,
            specialty_mode: specialtyModeId,
          });
        }}
        enableReinitialize
      >
        {({
          values, handleChange, handleSubmit, setFieldValue,
        }) => (
          <form className="p-4" onSubmit={handleSubmit}>
            <Grid container spacing={3} alignItems="center">
              {isPrivate && (
              <Grid item md={12} sm={12} xs={12}>
                <Alert severity="warning">
                  <AlertTitle className="m-auto">This cohort is private</AlertTitle>
                </Alert>
              </Grid>
              )}
              <Grid item md={3} sm={4} xs={12}>
                Cohort Slug
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Slug"
                  name="slug"
                  data-cy="slug"
                  disabled
                  size="small"
                  variant="outlined"
                  value={values.slug}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Syllabus
              </Grid>
              <Grid item md={7} sm={4} xs={6}>
                <AsyncAutocomplete

                  onChange={(certificate) => {
                    setSyllabus(certificate);
                    setVersion(null);
                  }}
                  width="100%"
                  key={syllabus}
                  asyncSearch={() => bc.admissions().getAllSyllabus()}
                  size="small"
                  label="Syllabus"
                  data-cy="syllabus"
                  required
                  debounced={false}
                  initialValue={syllabus}
                  getOptionLabel={(option) => `${option.name}`}
                  value={syllabus}
                />
              </Grid>
              <Grid item md={2} sm={4} xs={6}>
                <AsyncAutocomplete
                  onChange={(v) => setVersion(v)}
                  width="100%"
                  key={syllabus !== null ? syllabus.slug : ''}
                  asyncSearch={() => bc.admissions().getAllCourseSyllabus(syllabus?.slug, academy.id)}
                  size="small"
                  label="Version"
                  data-cy="version"
                  required
                  debounced={false}
                  initialValue={version}
                  getOptionLabel={(option) => `${option.version}`}
                  value={version}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Schedule
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <AsyncAutocomplete
                  debounced={false}
                  onChange={(v) => setCert(v)}
                  width="100%"
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
                  getOptionLabel={(v) => `${v.name}`}
                  value={cert}
                  disabled={!syllabus}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Language
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Language"
                  data-cy="language"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={values.language}
                  onChange={(e) => {
                    setFieldValue('language', e.target.value);
                  }}
                  select
                >
                  {['es', 'en'].map((item) => (
                    <MenuItem value={item} key={item}>
                      {item.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Start date
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="m-2"
                    margin="none"
                    label="Date"
                    data-cy="start-date"
                    inputVariant="outlined"
                    type="text"
                    size="small"
                    autoOk
                    value={values.kickoff_date}
                    format="yyyy-MM-dd"
                    onChange={(date) => setFieldValue('kickoff_date', date.toISOString())}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              {!values.never_ends ? (
                <>
                  <Grid item md={3} sm={4} xs={12}>
                    End date
                  </Grid>
                  <Grid item md={9} sm={8} xs={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className="m-2"
                        margin="none"
                        label="Date"
                        data-cy="end-date"
                        inputVariant="outlined"
                        type="text"
                        size="small"
                        autoOk
                        value={values.ending_date}
                        format="yyyy-MM-dd"
                        onChange={(date) => {
                  setFieldValue('ending_date', date.toISOString());
                }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <FormControlLabel
                      className="flex-grow"
                      name="never_ends"
                      data-cy="never-ends"
                      onChange={handleChange}
                      control={<Checkbox checked={values.never_ends} />}
                      label="This cohort never ends"
                    />
                  </Grid>
                </>
              ) : (
                <Grid item md={12} sm={12} xs={12}>
                  <FormControlLabel
                    className="flex-grow"
                    name="never_ends"
                    data-cy="never-ends"
                    onChange={handleChange}
                    control={<Checkbox checked={values.never_ends} />}
                    label="This cohort never ends"
                  />
                </Grid>

              )}

              <Grid item md={3} sm={4} xs={12}>
                Live meeting URL
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="URL"
                  name="meetingURL"
                  data-cy="meetingURL"
                  size="small"
                  variant="outlined"
                  defaultValue={"https://bluejeans.com/976625693"}
                  // value={"https://bluejeans.com/976625693"}
                  // InputProps={{
                  //   readOnly: true,
                  // }}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Timezone
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <div className="flex flex-wrap m--2">
                  <AsyncAutocomplete
                    debounced={false}
                    onChange={(x) => setTimezone(x)}
                    width="60%"
                    className="mr-2 ml-2"
                    asyncSearch={() => bc.admissions().getAllTimeZone()}
                    size="small"
                    data-cy="timezone"
                    label="Timezone"
                    required
                    getOptionLabel={(option) => `${option}`}
                    value={timezone}
                  />

                </div>
              </Grid>
              <Button color="primary" variant="contained" type="submit" data-cy="submit">
                Save Cohort Details
              </Button>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

CohortDetails.propTypes = propTypes;

export default CohortDetails;
