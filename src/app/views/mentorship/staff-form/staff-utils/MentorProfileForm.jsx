import React from 'react';
import {
  Grid, TextField, Button, MenuItem
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import bc from 'app/services/breathecode';
import { useHistory } from 'react-router-dom';

const propTypes = {
  initialValues: PropTypes.objectOf(PropTypes.object).isRequired,
  serviceList: PropTypes.array,
};

export const MentorProfileForm = ({ initialValues, serviceList }) => {
  const history = useHistory();

  const postMentor = (values) => {
    let serviceIndex = serviceList.filter((service) => {
      return values.service === service.name
    })
    bc.mentorship().addAcademyMentor({
      user: values.id,
      booking_url: values.booking_url,
      meeting_url: values.meeting_url,
      slug: `${values.first_name.toLowerCase().trim()}-${values.last_name.toLowerCase().trim()}`,
      price_per_hour: values.price_per_hour,
      service: serviceIndex[0].id,
      email: values.email
    }).then((data) => {
      if (data.status === 200) {
        history.push('/mentors/staff');
      }
    })
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => postMentor(values)}
      enableReinitialize
    >
      {({ values, handleChange, handleSubmit, setFieldValue }) => (
        <form className="p-4" onSubmit={handleSubmit}>
          <Grid container spacing={3} alignItems="center">
            <Grid item md={1} sm={4} xs={12}>
              Name
            </Grid>
            <Grid item md={11} sm={8} xs={12}>
              <div className="flex">
                <TextField
                  className="m-2"
                  label="First Name"
                  name="first_name"
                  size="small"
                  required
                  variant="outlined"
                  value={values.first_name}
                  onChange={handleChange}
                />
                <TextField
                  className="m-2"
                  label="Last Name"
                  name="last_name"
                  size="small"
                  required
                  variant="outlined"
                  value={values.last_name}
                  onChange={handleChange}
                />
              </div>
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Booking Url
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Booking Url"
                name="booking_url"
                size="small"
                required
                variant="outlined"
                value={values.booking_url}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Meeting URL
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Meeting Url"
                name="meeting_url"
                size="small"
                type="text"
                variant="outlined"
                value={values.meeting_url}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Email
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Email"
                name="email"
                size="small"
                type="email"
                required
                variant="outlined"
                value={values.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Price per hour
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Price per hour"
                name="price_per_hour"
                size="small"
                type="number"
                required
                variant="outlined"
                value={values.price_per_hour}
                onChange={handleChange}
              />
            </Grid>

            <Grid item md={2} sm={4} xs={12}>
              Service
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                className="m-2"
                label="Service"
                data-cy="service"
                size="small"
                variant="outlined"
                value={values.service}
                onChange={(e) => {
                  setFieldValue('service', e.target.value);
                }}
                select
              >
                {serviceList.map((singleService, i) => {
                  console.log('servince', singleService);
                  return (
                    <MenuItem value={singleService.name || 'Loading'} key={`${singleService.name}${i}`}>
                      {singleService.name.toUpperCase()}
                    </MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Slug
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Slug"
                name="slug"
                size="small"
                type="text"
                required
                variant="outlined"
                value={`${values.first_name.toLowerCase()}-${values.last_name.toLowerCase()}`}
                onChange={handleChange}
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
  )
};

MentorProfileForm.propTypes = propTypes;
