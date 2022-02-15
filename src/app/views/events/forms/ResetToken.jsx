import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Button } from '@material-ui/core';
import bc from '../../../services/breathecode';

export const ResetToken = ({ initialValues }) => {
  const ProfileSchema = Yup.object().shape({
    academy_id: Yup.string().required('Academy ID required'),
    academy_token: Yup.string().required('Academy Token required'),
  });

  const docLink = 'https://documenter.getpostman.com/view/2432393/T1LPC6ef#be79b6fe-7626-4c33-b5f9-4565479852eb';

  const statusColors = {
    ERROR: ' bg-error',
    PERSISTED: ' bg-green',
    PENDING: ' bg-secondary',
  };

  const postOrganization = async (values) => {
    // Call POST
    console.log(values);
    // const payload = {
    //   academy_id: values.academy_id,
    //   academy_token: values.academy_token,
    // };
    // await bc.events().postAcademyEventOrganization(payload);
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
                error={errors.academy_id && touched.academy_id}
                helperText={touched.academy_id && errors.academy_id}
                label="Academy id"
                name="academy_id"
                size="small"
                type="text"
                variant="outlined"
                value={values.academy_id}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item md={4}>
              <TextField
                fullWidth
                error={errors.academy_token && touched.academy_token}
                helperText={touched.academy_token && errors.academy_token}
                label="Academy Token"
                name="academy_token"
                size="small"
                type="text"
                variant="outlined"
                value={values.academy_token}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item md={4}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
              >
                Create or reset token
              </Button>
            </Grid>
            <Grid item md={12}>
              <p>
                {/* <small className={`border-radius-4 px-2 pt-2px text-white ${statusColors[value]}`}>
                  OK
                </small> */}
                Status:
                {' '}
                <small className={`border-radius-4 px-2 pt-2px text-white bg-green`}>
                  OK
                </small>
                {/* {' '}
                Status: {initialValues.sync_desc} */}
              </p>
              <a href={docLink} target="_blank" style={{color:'rgb(17, 82, 147)'}}>
                Click here to read the API documentation
              </a>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

ResetToken.propTypes = {
  initialValues: PropTypes.object,
};

ResetToken.defaultProps = {
  initialValues: {},
};
