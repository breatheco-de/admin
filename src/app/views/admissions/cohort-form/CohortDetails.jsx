import React, { useState } from 'react';
import {
  Divider,
  Card,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
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
  onSubmit: PropTypes.string.isRequired,
  syllabus: PropTypes.string.isRequired,
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
  syllabus,
  neverEnds,
  isPrivate,
}) => {
  const { academy } = JSON.parse(localStorage.getItem('bc-session'));
  const [cert, setCert] = useState(syllabus?.certificate);
  const [version, setVersion] = useState(syllabus);
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
          endingDate: endDate,
          kickoff_date: startDate,
          neverEnds,
        }}
        onSubmit={(values) => onSubmit({ ...values, syllabus: `${cert.slug}.v${version.version}` })}
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
                    setCert(certificate);
                    setVersion(null);
                  }}
                  width="100%"
                  initialValue={cert}
                  asyncSearch={() => bc.admissions().getCertificates()}
                  size="small"
                  label="Certificate"
                  required
                  debounced={false}
                  getOptionLabel={(option) => `${option.name}`}
                  value={cert}
                />
              </Grid>
              <Grid item md={2} sm={4} xs={6}>
                <AsyncAutocomplete
                  onChange={(v) => setVersion(v)}
                  width="100%"
                  key={cert !== null ? cert.slug : ''}
                  asyncSearch={() => bc.admissions().getAllCourseSyllabus(cert?.slug, academy.id)}
                  size="small"
                  label="Version"
                  required
                  debounced={false}
                  initialValue={version}
                  getOptionLabel={(option) => `${option.version}`}
                  value={version}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Language
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Language"
                  name="language"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={values.language}
                  onChange={handleChange}
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
              {!values.neverEnds ? (
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
                        inputVariant="outlined"
                        type="text"
                        size="small"
                        autoOk
                        value={values.endingDate}
                        format="yyyy-MM-dd"
                        onChange={(date) => {
                          console.log(date);
                          setFieldValue('endingDate', date.toISOString());
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <FormControlLabel
                      className="flex-grow"
                      name="neverEnds"
                      onChange={handleChange}
                      control={<Checkbox checked={values.neverEnds} />}
                      label="This cohort never ends"
                    />
                  </Grid>
                </>
              ) : (
                <Grid item md={12} sm={12} xs={12}>
                  <FormControlLabel
                    className="flex-grow"
                    name="neverEnds"
                    onChange={handleChange}
                    control={<Checkbox checked={values.neverEnds} />}
                    label="This cohort never ends"
                  />
                </Grid>
              )}
              <Button color="primary" variant="contained" type="submit">
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
