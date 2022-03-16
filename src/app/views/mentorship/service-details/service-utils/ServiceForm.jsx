import React from 'react';
import { Grid, TextField, Button, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import bc from 'app/services/breathecode';

const propTypes = {
  handleChange: PropTypes.string.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.object).isRequired,
};

export const ServiceForm = ({ initialValues }) => (
  <Formik
    initialValues={initialValues}
    onSubmit={(values) => {
      console.log('VALUES:', values);
      bc.mentorship().addAcademyService(values);
    }}
    enableReinitialize
  >
    {({ values, handleChange, handleSubmit, setFieldValue }) => (
      <form className="p-4" onSubmit={handleSubmit}>
        <Grid container spacing={3} alignItems="center">

          <Grid item md={1} sm={4} xs={12}>
            Slug
          </Grid>
          <Grid item md={11} sm={8} xs={12}>
            <div className="flex">
              <TextField
                className="m-2"
                label="Slug"
                name="slug"
                size="small"
                required
                variant="outlined"
                value={values.slug}
                onChange={handleChange}
              />
            </div>
          </Grid>

          <Grid item md={2} sm={4} xs={12}>
            Name
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            <TextField
              label="Name"
              name="name"
              size="small"
              required
              variant="outlined"
              value={values.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item md={2} sm={4} xs={12}>
            Logo URL
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            <TextField
              label="Logo Url"
              name="logo_url"
              size="small"
              type="text"
              variant="outlined"
              value={values.logo_url}
              onChange={handleChange}
            />
          </Grid>

          <Grid item md={2} sm={4} xs={12}>
            Description
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            <TextField
              label="Description"
              name="description"
              size="small"
              type="text"
              required
              variant="outlined"
              value={values.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item md={2} sm={4} xs={12}>
            Duration
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            <TextField
              label="Example: 01:00:00"
              name="duration"
              size="small"
              type="text"
              required
              variant="outlined"
              value={values.duration}
              onChange={handleChange}
            />
          </Grid>

          <Grid item md={2} sm={4} xs={12}>
            Max Duration
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            <TextField
              label="Example: 7200.0"
              name="max_duration"
              size="small"
              type="text"
              required
              variant="outlined"
              value={values.max_duration}
              onChange={handleChange}
            />
          </Grid>

          <Grid item md={2} sm={4} xs={12}>
            Missed Meeting Duration
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            <TextField
              label="Example: 600.0"
              name="missed_meeting_duration"
              size="small"
              type="text"
              required
              variant="outlined"
              value={values.missed_meeting_duration}
              onChange={handleChange}
            />
          </Grid>

          <Grid item md={2} sm={4} xs={12}>
            Status
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            <TextField
              label="Status"
              name="status"
              size="small"
              type="text"
              required
              variant="outlined"
              value={values.status}
              onChange={handleChange}
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

          <Grid item md={2} sm={4} xs={12}>
            Allow Mentee extension?
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            <FormControlLabel
              sx={{ mb: '16px' }}
              name="allow_mentee_to_extend"
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'allow_mentee_to_extend',
                    value: e.target.checked,
                  },
                })
              }
              control={
                <Checkbox
                  size="large"
                  checked={values?.allow_mentee_to_extend || false}
                />
              }
              label=""
            />
          </Grid>

          <Grid item md={2} sm={4} xs={12}>
            Allow Mentor extension?
          </Grid>
          <Grid item md={10} sm={8} xs={12}>
            <FormControlLabel
              sx={{ mb: '16px' }}
              name="allow_mentors_to_extend"
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'allow_mentors_to_extend',
                    value: e.target.checked,
                  },
                })
              }
              control={
                <Checkbox
                  size="large"
                  checked={values?.allow_mentors_to_extend || false}
                />
              }
              label=""
            />
          </Grid>

        </Grid>
        <div className="mt-6">
          <Button color="primary" variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    )}
  </Formik>
);

ServiceForm.propTypes = propTypes;
