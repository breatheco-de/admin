import {
  Avatar,
  Button,
  Card, Dialog, DialogTitle, Divider, Grid, List,
  ListItem,
  ListItemText, MenuItem, TextField,
  TextareaAutosize,
  FormControlLabel, Checkbox
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
  const serviceStatusChoices = ['ACTIVE', 'INNACTIVE'];
  const initialValues = {
    id: singleService?.id || "",
    name: singleService?.name || "",
    slug: singleService?.slug || "",
    duration: singleService?.duration || "",
    description: singleService?.description || "",
    logo_url: singleService?.logo_url || "",
    allow_mentee_to_extend: singleService?.allow_mentee_to_extend || "",
    allow_mentors_to_extend: singleService?.allow_mentors_to_extend || "",
    max_duration: singleService?.max_duration || "",
    missed_meeting_duration: singleService?.missed_meeting_duration || "",
    created_at: singleService?.created_at || "",
    updated_at: singleService?.updated_at || "",
    status: singleService?.status || "",
    language: singleService?.language || "",
  };

  const updateAcademyService = (values) => {
    bc.mentorship()
      .updateAcademyService(serviceID, { ...values, name: values.name })
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
        <h3>Edit this service</h3>
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
                Updated at
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Updated at"
                  name="updated_at"
                  data-cy="updated_at"
                  disabled
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={values.updated_at}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item md={3} sm={4} xs={12}>
                Created at
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Created at"
                  name="created_at"
                  data-cy="created_at"
                  disabled
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={values.created_at}
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
                Description
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextareaAutosize
                  aria-label="description"
                  minRows={3}
                  placeholder="Description"
                  style={{ width: '30%' }}
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

              <Grid item md={3} sm={4} xs={12}>
                Duration
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
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

              <Grid item md={3} sm={4} xs={12}>
                Max Duration
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
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

              <Grid item md={3} sm={4} xs={12}>
                Missed Meeting Duration
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
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

              <Grid item md={3} sm={4} xs={12}>
                Logo URL
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  label="Logo Url"
                  name="logo_url"
                  data-cy="Logo Url"
                  size="small"
                  type="text"
                  variant="outlined"
                  value={values.logo_url}
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
                  disabled
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
                  {serviceStatusChoices.map((item, i) => (
                    <MenuItem value={item} key={`${item}${i}`}>
                      {item.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={2} sm={4} xs={12}>
                Language
              </Grid>
              <Grid item md={10} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Language"
                  style={{ width: '50%' }}
                  data-cy="language"
                  size="small"
                  variant="outlined"
                  value={values.language}
                  onChange={(e) => {
                    setFieldValue('language', e.target.value);
                  }}
                  select
                >
                  {['English', 'Spanish'].map((item) => (
                    <MenuItem value={item} key={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={4} sm={4} xs={12}>
                Allow Mentee extension?
              </Grid>
              <Grid item md={8} sm={8} xs={12}>
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

              <Grid item md={4} sm={4} xs={12}>
                Allow Mentor extension?
              </Grid>
              <Grid item md={8} sm={8} xs={12}>
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
          {serviceStatusChoices && serviceStatusChoices.map((currentStatus, i) => (
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
