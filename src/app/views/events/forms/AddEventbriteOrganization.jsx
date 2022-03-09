import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Button } from '@material-ui/core';
import bc from '../../../services/breathecode';

export const AddEventbriteOrganization = ({ initialValues, isCreating }) => {
  const ProfileSchema = Yup.object().shape({
    eventbrite_key: Yup.string().required('Api Key required'),
    eventbrite_id: Yup.string().required('Organizer Id required'),
  });

  const postOrganization = async (values) => {
    if (isCreating) {
      // Call POST
      const payload = {
        eventbrite_id: values.eventbrite_id,
        eventbrite_key: values.eventbrite_key,
      };
      await bc.events().postAcademyEventOrganization(payload);
    } else {
      // Call PUT
      await bc.events().putAcademyEventOrganization({ ...values });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ProfileSchema}
      onSubmit={(values) => postOrganization(values)}
      enableReinitialize
    >
      {({
        values, handleChange, handleSubmit, errors, touched,
      }) => (
        <form className="p-4" onSubmit={handleSubmit}>
          <Grid container spacing={3} alignItems="center">
            <Grid item md={4}>
              <TextField
                fullWidth
                error={errors.eventbrite_key && touched.eventbrite_key}
                helperText={touched.eventbrite_key && errors.eventbrite_key}
                label="Eventbrite API Key"
                name="eventbrite_key"
                size="small"
                type="text"
                variant="outlined"
                value={values.eventbrite_key}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                fullWidth
                error={errors.eventbrite_id && touched.eventbrite_id}
                helperText={touched.eventbrite_id && errors.eventbrite_id}
                label="Eventbrite Organizer ID"
                name="eventbrite_id"
                size="small"
                type="text"
                variant="outlined"
                value={values.eventbrite_id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={4}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            </Grid>
            {initialValues.sync_desc && (<Grid item md={12}>
              <p>
                {' '}
                Status: {initialValues.sync_desc}
              </p>
            </Grid>)}
          </Grid>
        </form>
      )}
    </Formik>
  );
};

AddEventbriteOrganization.propTypes = {
  initialValues: PropTypes.object,
};

AddEventbriteOrganization.defaultProps = {
  initialValues: {},
};
