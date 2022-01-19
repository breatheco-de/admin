import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

const propTypes = {
  handleChange: PropTypes.string.isRequired,
  values: PropTypes.objectOf(PropTypes.object).isRequired,
};

export const ProfileForm = ({ handleChange, values }) => (
  <>
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
      Phone number
    </Grid>
    <Grid item md={10} sm={8} xs={12}>
      <TextField
        label="Services"
        name="services"
        size="small"
        required
        variant="outlined"
        value={values.services}
        onChange={handleChange}
      />
    </Grid>
    <Grid item md={2} sm={4} xs={12}>
      Address
    </Grid>
    <Grid item md={10} sm={8} xs={12}>
      <TextField
        label="Booking URL"
        name="booking_url"
        size="small"
        type="text"
        variant="outlined"
        value={values.booking_url}
        onChange={handleChange}
      />
    </Grid>
    <Grid item md={2} sm={4} xs={12}>
      Email
    </Grid>
    <Grid item md={10} sm={8} xs={12}>
      <TextField
        label="Meeting URL"
        name="meeting_url"
        size="small"
        type="text"
        required
        variant="outlined"
        value={values.meeting_url}
        onChange={handleChange}
      />
    </Grid>
  </>
);

ProfileForm.propTypes = propTypes;
