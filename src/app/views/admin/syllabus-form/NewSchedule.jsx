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
import ScheduleDetails from './ScheduleDetails';
import { capitalizeEachFirstLetter, schemas } from '../../../utils';
import Field from '../../../components/Field';

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

const scheduleTypes = ['PART-TIME', 'FULL-TIME'];
const schema = Yup.object().shape({
  // academy: yup.number().required().positive().integer(),
  // specialty_mode: yup.number().required().positive().integer(),
  slug: schemas.slug(),
  name: schemas.name(),
  description: Yup.string().required(),
  schedule_type: Yup.mixed().oneOf(scheduleTypes).required(),
});

const NewSchedule = ({ isOpen, setIsOpen }) => {
  const classes = useStyles();

  const saveSchedule = (values) => {
    //
  };

  return (
    <Dialog
      onClose={() => setIsOpen(false)}
      open={isOpen}
      aria-labelledby="simple-dialog-title"
    >
      <DialogTitle id="simple-dialog-title">Select a Cohort Stage</DialogTitle>
      <Formik
        initialValues={{}}
        // enableReinitialize
        validationSchema={schema}
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
              <Field
                form="new-schedule"
                type="text"
                name="Name"
                placeholder="Full Stack PT"
                required
                dialog
              />
              <Field
                form="new-schedule"
                type="text"
                name="Description"
                placeholder="Every day of the week, 9 am to 6 pm."
                required
                dialog
                multiline
              />
              <Field
                select
                form="new-schedule"
                type="text"
                name="Recurrent type"
                label="Part-Type"
                required
                dialog
              >
                {scheduleTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {capitalizeEachFirstLetter(option)}
                  </MenuItem>
                ))}
              </Field>
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

export default NewSchedule;
