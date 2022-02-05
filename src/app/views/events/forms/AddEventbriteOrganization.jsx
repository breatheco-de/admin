import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';

export const AddEventbriteOrganization = ({ initialValues, isCreating }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [organization, setOrganization] = useState({
    eventbrite_key: '',
    eventbrite_id: '',
    status: '',
    sync_desc: '',
    sync_status: '',
  });

  const ProfileSchema = Yup.object().shape({
    eventbrite_key: Yup.string().required('Api Key required'),
    eventbrite_id: Yup.string().required('Organizer Id required'),
  });

  useEffect(() => {

    const getOrganization = async () => {
      try {
        const { data } = await bc.events().getAcademyEventOrganization();
        // console.log(data);

        // delete data.eventbrite_key
        // delete data.eventbrite_id

        if (!data) {
          setIsCreating(true);
        } else {
          setOrganization({ ...data });
        }

        if (!data.eventbrite_key && !data.eventbrite_id) {
          toast.error('The academy has not organization configured', {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        return error;
      }
    };
    getOrganization();
  }, []);

  const postOrganization = async (values) => {
    // console.log('Everything fine!', values);
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
            <Grid item md={12}>
              <p>
                {' '}
                Status:
                <small
                  className={
                    `border-radius-4 px-2 pt-2px text-white ${organization.sync_status === 'SYNCHED' ? 'bg-green' : organization.sync_status !== 'ERROR' ? 'bg-secondary' : 'bg-error'}`
                  }
                >
                  {organization.sync_status}
                </small>
                {organization.sync_desc}
              </p>
            </Grid>
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
