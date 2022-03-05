import {
  Avatar,
  Button,
  Card, Dialog, DialogTitle, Divider, Grid, List,
  ListItem,
  ListItemText, MenuItem, TextField
} from '@material-ui/core';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';

const propTypes = {
  service: PropTypes.object.isRequired,
  serviceID: PropTypes.string.isRequired,
};

const ServiceDetails = ({ service, serviceID }) => {
  const [roleDialog, setRoleDialog] = useState(false);
  const [singleService, setService] = useState(service);
  const mentorStatusChoices = ['ACTIVE', 'INNACTIVE'];
  // console.log('service PROP', service);
  const initialValues = {
    id: singleService?.id === null ? '' : singleService?.id,
    name: singleService?.name === null ? '' : singleService?.name,
    slug: singleService?.slug === null ? '' : singleService?.slug,
    status: singleService?.status === null ? '' : singleService?.status,
  };

  const updateAcademyService = (values) => {
    bc.mentorship()
      .updateAcademyService(serviceID, { ...values, service: serviceID })
      .then(({ data }) => data)
      .catch((error) => console.error(error));
  };

  const updateStatus = (currentStatus) => {
    bc.mentorship()
      .updateAcademyMentor(serviceID, {
        status: currentStatus.toUpperCase(),
        slug: mentor.slug,
        price_per_hour: mentor.price_per_hour,
        service: mentor.service.id,
      })
      .then(({ data, status }) => {
        if (status === 200) {
          setMentor({ ...mentor, ...data });
        } else {
          throw Error('Could not update Status');
        }
      });
  };

  return (
    <Card className="pt-6" elevation={3}>
      <div className="flex-column items-center mb-6">
        <button
          type="button"
          className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3"
          onClick={() => setRoleDialog(true)}
          style={{ cursor: 'pointer' }}
        >
          {service?.name}
        </button>
      </div>
      <Divider />
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => updateAcademyService(values)}
        enableReinitialize
      >
        {({
          values, handleChange, handleSubmit, setFieldValue,
        }) => (
          <form className="p-4" onSubmit={handleSubmit}>

            <Grid container spacing={3} alignItems="center">
              <Grid item md={3} sm={4} xs={12}>
                Id
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="ID"
                  name="id"
                  data-cy="id"
                  disabled
                  size="small"
                  variant="outlined"
                  value={values.id}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Name
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Name"
                  name="name"
                  data-cy="name"
                  size="small"
                  variant="outlined"
                  value={values.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item md={3} sm={4} xs={12}>
                Slug
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Slug"
                  name="slug"
                  data-cy="slug"
                  size="small"
                  variant="outlined"
                  value={values.slug}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item md={3} sm={4} xs={12}>
                Service Status
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Service Status"
                  data-cy="service"
                  size="small"
                  fullWidth
                  variant="outlined"
                  value={values.status}
                  onChange={(e) => {
                    setFieldValue('status', e.target.value);
                  }}
                  select
                >
                  {mentorStatusChoices.map((item, i) => (
                    <MenuItem value={item} key={`${item}${i}`}>
                      {item.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <div className="flex-column items-start px-4 mb-4">
                <Button color="primary" variant="contained" type="submit">
                  Update Service Details
                </Button>
              </div>
            </Grid>
          </form>
        )}
      </Formik>
      <Dialog
        onClose={() => setRoleDialog(false)}
        open={roleDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Change Mentor Status</DialogTitle>
        <List>
          {mentorStatusChoices && mentorStatusChoices.map((currentStatus, i) => (
            <ListItem
              button
              onClick={() => {
                updateStatus(currentStatus);
                setRoleDialog(false);
              }}
              key={currentStatus?.name + i}
            >
              <ListItemText primary={currentStatus.toUpperCase()} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
};

ServiceDetails.propTypes = propTypes;

export default ServiceDetails;
