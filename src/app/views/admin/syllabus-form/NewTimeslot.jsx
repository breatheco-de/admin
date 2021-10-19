import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import {
  MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField,
  DialogActions,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import bc from '../../../services/breathecode';
import { capitalizeEachFirstLetter, schemas } from '../../../utils';
import Field from '../../../components/Field';
import Date from '../../../components/Date';
import Time from '../../../components/Time';
import ScheduleDetails from './ScheduleDetails';

const propTypes = {
  schedules: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const useStyles = makeStyles(() => ({
  dialogue: {
    color: 'rgba(52, 49, 76, 1)',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
  },
  select: {
    width: '15rem',
  },
}));

const recurrentTypes = ['DAILY', 'WEEKLY', 'MONTHLY'];
const schema = Yup.object().shape({
  // academy: yup.number().required().positive().integer(),
  // specialty_mode: yup.number().required().positive().integer(),
  slug: schemas.slug,
  starting_hour: Yup.string().required().matches(/\d{1,2}:\d{2}/, 'Invalid hour'),
  ending_hour: Yup.string().required().matches(/\d{1,2}:\d{2}/, 'Invalid hour'),
  starting_date: Yup.string().required(),
  ending_date: Yup.string().required(),
  recurrent: Yup.bool().required(),
  recurrent_type: Yup.mixed().oneOf(recurrentTypes).required(),
});

const NewTimeslot = ({ isOpen, setIsOpen }) => {
  const classes = useStyles();
  const initialValues = {
    slug: '',
    starting_date: '',
    starting_hour: '',
    ending_date: '',
    ending_hour: '',
  };

  const saveSchedule = (values) => {
    //
  };

  const validate = (values) => {
    const errors = {};

    if (!values.slug) errors.slug = 'Slug is required';
    if (!values.starting_date) errors.starting_date = 'Starting date is required';
    if (!values.starting_hour) errors.starting_hour = 'Starting hour is required';
    if (!values.ending_date) errors.ending_date = 'Ending date is required';
    if (!values.ending_hour) errors.ending_hour = 'Ending hour is required';

    return errors;
  };

  return (
    <Dialog
      onClose={() => setIsOpen(false)}
      open={isOpen}
      aria-labelledby="simple-dialog-title"
    >
      <DialogTitle id="simple-dialog-title">Select a Cohort Stage</DialogTitle>
      <Formik
        initialValues={initialValues}
        // enableReinitialize
        // validationSchema={schema}
        validate={validate}
        onSubmit={(values) => {
          saveSchedule(values);
          setIsOpen(false);
        }}
      >
        {({
          values, errors, touched, handleSubmit, handleChange, handleBlur,
        }) => (
          <form onSubmit={handleSubmit} className="d-flex justify-content-center mt-0 p-4" style={{ paddingTop: 0 }}>
            <DialogContent style={{ paddingTop: 0 }}>
              <Field
                form="new-schedule"
                type="text"
                name="Slug"
                placeholder="full-stack-pt"
                required
                dialog
              />
              <Date
                form="new-schedule"
                name="starting_date"
                label="Starting date"
                // placeholder="full-stack-pt"
                disablePast
                required
                dialog
              />
              <Date
                form="new-schedule"
                name="ending_date"
                label="Ending date"
                // placeholder="full-stack-pt"
                disablePast
                required
                dialog
              />
              <Time
                form="new-schedule"
                name="starting_hour"
                label="Starting hour"
                // placeholder="full-stack-pt"
                required
                dialog
              />
              <Time
                form="new-schedule"
                name="ending_hour"
                label="Ending hour"
                // placeholder="full-stack-pt"
                required
                dialog
              />
            </DialogContent>
            <DialogActions className={classes.button}>
              <Button color="primary" variant="contained" type="submit">
                Send now
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default NewTimeslot;
