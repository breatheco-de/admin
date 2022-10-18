import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Button } from '@material-ui/core';
import bc from '../../../services/breathecode';

export const AddActiveCampaign = ({ initialValues, isCreating, setACAcademy }) => {
  const ProfileSchema = Yup.object().shape({
    ac_key: Yup.string().required('Api Key required'),
    ac_url: Yup.string().required('Organizer Id required'),
  });

  const saveACAcademy = async (values) => {
    if (isCreating) {
      // Call POST
      const payload = {
        ac_url: values.ac_url,
        ac_key: values.ac_key,
      };
      const res = await bc.marketing().createACAcademy(payload);
      if (res.ok) setACAcademy(res.data);
    } else {
      // Call PUT
      const res = await bc.marketing().updateACAcademy({ ...values });
      if (res.ok) setACAcademy(res.data);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ProfileSchema}
      onSubmit={(values) => saveACAcademy(values)}
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
                error={errors.ac_key && touched.ac_key}
                helperText={touched.ac_key && errors.ac_key}
                label="Active Campaign API Key"
                name="ac_key"
                size="small"
                type="text"
                variant="outlined"
                value={values.ac_key}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                fullWidth
                error={errors.ac_url && touched.ac_url}
                helperText={touched.ac_url && errors.ac_url}
                label="Active Campaign URL"
                name="ac_url"
                size="small"
                type="url"
                variant="outlined"
                value={values.ac_url}
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
                {isCreating ? 'Save Integration' : 'Submit'}
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

AddActiveCampaign.propTypes = {
  initialValues: PropTypes.object,
};

AddActiveCampaign.defaultProps = {
  initialValues: {},
};
