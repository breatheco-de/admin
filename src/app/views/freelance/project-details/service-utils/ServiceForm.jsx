import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, MenuItem, FormControlLabel, Checkbox, TextareaAutosize } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import bc from 'app/services/breathecode';
import { useHistory } from 'react-router-dom';
import { minToHHMMSS } from '../../../../utils/minToHHMMSS'
import { getSession } from 'app/redux/actions/SessionActions';

const propTypes = {
  handleChange: PropTypes.string.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.object).isRequired,
};

const slugify = require('slugify')

export const ServiceForm = ({ initialValues }) => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const session = getSession();


  useEffect(() => {
    setSlug(slugify(name).toLowerCase());
  }, [name]);


  const postService = (values) => {
    let formattedDuration = minToHHMMSS(values.duration)
    let formattedMaxDuration = minToHHMMSS(values.max_duration)
    let formattedMissedMeetingDuration = minToHHMMSS(values.missed_meeting_duration)
    
    bc.mentorship().addAcademyService({
      ...values,
      name: name,
      slug: slug,
      duration: formattedDuration,
      max_duration: formattedMaxDuration,
      missed_meeting_duration: formattedMissedMeetingDuration
    })
      .then((resp) => (resp.status >= 200 && resp.status < 400) && history.push(`/mentors/service/${resp.data.id}`))
    
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => postService(values)}
      enableReinitialize
    >
      {({ values, handleChange, handleSubmit, setFieldValue }) => (
        <form className="p-4" onSubmit={handleSubmit}>
          <Grid container spacing={3} alignItems="center">

            <Grid item md={2} sm={4} xs={12}>
              Name
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                className='m-0'
                label="Name"
                name="name"
                size="small"
                required
                variant="outlined"
                value={name}
                onChange={(e) => { setName(e.target.value) }}
              />
            </Grid>

            <Grid item md={2} sm={4} xs={12}>
              Slug
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                className='m-0'
                label="Slug"
                name="slug"
                size="small"
                required
                variant="outlined"
                value={slug}
                onChange={(e) => { setSlug(e.target.value) }}
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
                aria-label="description"
                minRows={3}
                placeholder="Description"
                label="Description"
                multiline
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
                className='m-0'
                label="Minutes"
                name="duration"
                size="small"
                type="text"
                required
                variant="outlined"
                value={values.duration}
                onChange={handleChange}
                helperText="The standard duration  for every session"
                FormHelperTextProps={{
                  classes: {
                    margin: "0 !important"
                  }
                }}
              />
            </Grid>

            <Grid item md={2} sm={4} xs={12}>
              Max Duration
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                className='m-0'
                label="Minutes"
                name="max_duration"
                size="small"
                type="number"
                required
                variant="outlined"
                value={values.max_duration}
                onChange={handleChange}
                helperText={`Max duration that can be billed per session.`}
              />
            </Grid>

            <Grid item md={2} sm={4} xs={12}>
              Missed Meeting Duration
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                className='m-0'
                label="Minutes"
                name="missed_meeting_duration"
                size="small"
                type="text"
                required
                helperText={`Billable amount if mentee does not join.`}
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
                className='m-0'
                label="Status"
                name="status"
                size="small"
                type="text"
                required
                disabled
                variant="outlined"
                value={values.status}
                onChange={handleChange}
                helperText={`You can mark the service "ACTIVE" after creation.`}
              />
            </Grid>

            <Grid item md={2} sm={4} xs={12}>
              Language
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                className='m-0'
                label="Language"
                style={{ width: '25%' }}
                data-cy="language"
                size="small"
                required
                variant="outlined"
                value={session.academy.language || values.language || 'en'}
                onChange={(e) => {
                  setFieldValue('language', e.target.value);
                }}
                select
              >
                {['es', 'en'].map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item md={2} sm={4} xs={12}>
              Allow Mentee to extend sessions?
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
              />
            </Grid>

            <Grid item md={2} sm={4} xs={12}>
              Allow Mentor to extend sessions?
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
                helperText="Once the session is longer than expected duration, the mentor will be able to extended up to max duration"
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
}

ServiceForm.propTypes = propTypes;
