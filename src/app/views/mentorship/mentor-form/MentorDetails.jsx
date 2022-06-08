import {
  Avatar,
  Button,
  Card, Dialog, DialogTitle, DialogActions, Divider, Grid, List,
  ListItem,
  ListItemText, MenuItem, TextField
} from '@material-ui/core';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import bc from '../../../services/breathecode';

const propTypes = {
  user: PropTypes.object.isRequired,
  staffId: PropTypes.string.isRequired,
};

const MentorDetails = ({ user, staffId }) => {
  const [roleDialog, setRoleDialog] = useState(false);
  const [confirmation, setConfirmation] = useState({open: false, values: {}});
  const [mentor, setMentor] = useState(user);
  const [mentorSlug, setMentorSlug] = useState(mentor?.slug || "")
  const [syllabusArray, setSyllabusArray] = useState([]);
  const mentorStatusChoices = ['ACTIVE', 'INNACTIVE', "UNLISTED"];
  const initialValues = {
    first_name: mentor?.user?.first_name || "",
    last_name: mentor?.user?.last_name || "",
    booking_url: mentor?.booking_url || "",
    service: mentor?.service.name || "",
    email: mentor?.email || mentor?.user.email,
    service_status: mentor?.service.status || "",
    slug: mentor?.slug || "",
    online_meeting_url: mentor?.online_meeting_url || "",
    status: mentor?.status || "",
    price_per_hour: mentor?.price_per_hour || "",
  };

  const updateMentorProfile = async (values) => {
    let filteredSyllArr = mentor.syllabus.map((syl) => syl.id)
    bc.mentorship()
      .updateAcademyMentor(staffId, { ...values, syllabus: filteredSyllArr, service: mentor.service.id, slug: mentorSlug })
      .then((data) => data)
      .catch((error) => console.error(error));
  };

  const updateStatus = (currentStatus) => {
    bc.mentorship()
      .updateAcademyMentor(staffId, {
        status: currentStatus.toUpperCase(),
        slug: mentor.slug,
        price_per_hour: mentor.price_per_hour,
        service: mentor.service.id,
      })
      .then(({ data, status }) => {
        if (status === 200) {
          setMentor({ ...mentor, ...data });
        }
      });
  };

  const validate = (values, props /* only available when using withFormik */) => {
    const errors = {};

    const match = /https?:\/\/calendly\.com\/([\w\-]+)\/?/gm.exec(values.booking_url);
    if (!match || match[1] == undefined) {
      errors.booking_url = 'Booking URL must start with https://calendly.com'
    }
    else setMentorSlug(match[1])

    return errors;
  };

  return (
    <Card className="pt-6" elevation={3}>
      <div className="flex-column items-center mb-6">
        <Avatar className="w-84 h-84" src={mentor?.user.profile?.avatar_url} />
        <h5 className="mt-4 mb-2">{ }</h5>
        <button
          type="button"
          className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3"
          onClick={() => setRoleDialog(true)}
          style={{ cursor: 'pointer' }}
        >
          {mentor?.status ? mentor.status.toUpperCase() : 'SET STATUS'}
        </button>
      </div>
      <Divider />
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values) => {
          if(mentor.syllabus.length === 1){
            setConfirmation({open: true, values});
          } else {
            updateMentorProfile(values)
          }
        }}
        enableReinitialize
      >
        {({
          values, handleChange, handleSubmit, setFieldValue, errors,
        }) => (
          <form className="p-4" onSubmit={handleSubmit}>

            <Grid container spacing={3} alignItems="center">
              <Grid item md={3} sm={4} xs={12}>
                Slug
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Slug"
                  name="slug"
                  data-cy="slug"
                  disabled
                  size="small"
                  variant="outlined"
                  value={mentorSlug}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                First Name
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="First Name"
                  name="first_name"
                  data-cy="first_name"
                  size="small"
                  variant="outlined"
                  value={values.first_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Last Name
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Last Name"
                  name="last_name"
                  data-cy="last_name"
                  size="small"
                  variant="outlined"
                  value={values.last_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Email
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Email"
                  name="email"
                  data-cy="email"
                  size="small"
                  variant="outlined"
                  value={values.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Backup Meeting URL
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Meeting URL"
                  name="online_meeting_url"
                  data-cy="online_meeting_url"
                  size="small"
                  variant="outlined"
                  value={values.online_meeting_url}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Booking URL
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Booking URL"
                  name="booking_url"
                  data-cy="booking_url"
                  size="small"
                  variant="outlined"
                  value={values.booking_url}
                  onChange={handleChange}
                />
                {errors.booking_url && <small className="text-error d-block">{errors.booking_url}</small>}
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Price per hour
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Price per hour"
                  name="price_per_hour"
                  type='number'
                  data-cy="price_per_hour"
                  InputProps={{
                    inputProps: {
                      max: 100, min: 1
                    }
                  }}
                  size="small"
                  variant="outlined"
                  value={values.price_per_hour}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Service
              </Grid>
              <Grid item md={9} sm={8} xs={12}>
                <TextField
                  className="m-2"
                  label="Service"
                  name="service"
                  data-cy="service"
                  disabled
                  size="small"
                  variant="outlined"
                  value={values.service}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                Syllabus expertise
              </Grid>
              <Grid item md={7} sm={4} xs={6}>
                <AsyncAutocomplete
                  getOptionLabel={(option) => `${option.name}`}
                  onChange={(selectedSyllabus) => {
                    setMentor({ ...mentor, syllabus: selectedSyllabus })
                  }}
                  width="100%"
                  key={mentor.syllabus}
                  asyncSearch={async () => {
                    const response = await bc.admissions().getAllSyllabus();
                    setSyllabusArray(response.data)
                    return response.data;
                  }}
                  size="small"
                  label="Syllabus expertise"
                  multiple
                  initialValues={mentor.syllabus}
                  debounced={false}
                  value={mentor.syllabus}
                />
                <small className="text-muted">Make sure to select all the syllabus this person is able to mentor</small>
              </Grid>

              <div className="flex-column items-start px-4 mb-4">
                <Button color="primary" variant="contained" type="submit">
                  Update Mentor Details
                </Button>
              </div>
            </Grid>
          </form>
        )}
      </Formik>
      {/* Confirmation dialog */}
      <Dialog
        onClose={() => setConfirmation({open: false})}
        open={confirmation.open}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Only One Syllabus expertise was selected for this mentor, are you sure?</DialogTitle>
        <DialogActions>
            <Button
              onClick={() => {
                setConfirmation({open: false});
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              autoFocus
              onClick={ async () => {
                await updateMentorProfile({...confirmation.values});
                setConfirmation({open: false});
              }}
            >
              Yes
            </Button>
          </DialogActions>
      </Dialog>
      {/* Confirmation dialog */}
      <Dialog
        onClose={() => setRoleDialog(false)}
        open={roleDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Change Mentor Status</DialogTitle>
        <List>
          {mentorStatusChoices && mentorStatusChoices.map((currentStatus) => (
            <ListItem
              button
              onClick={() => {
                updateStatus(currentStatus);
                setRoleDialog(false);
              }}
              key={currentStatus?.name}
            >
              <ListItemText primary={currentStatus.toUpperCase()} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
};

MentorDetails.propTypes = propTypes;

export default MentorDetails;
