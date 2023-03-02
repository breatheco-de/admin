import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import {
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import bc from '../../../services/breathecode';
import { schemas } from '../../../utils';
import Field from '../../../components/Field';
import Select from '../../../components/Select';
import { getSession } from '../../../redux/actions/SessionActions';

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

const scheduleTypes = ['Part time', 'Full time'];
const schema = Yup.object().shape({
  name: schemas.name(),
  description: schemas.description(),
  schedule_type: schemas.select('Schedule type', scheduleTypes, true),
});

const NewSchedule = ({ isOpen, setIsOpen, syllabus, appendSchedule }) => {
  const classes = useStyles();
  const session = getSession();

  const saveSchedule = (values) => {
    const request = {
      ...values,
      syllabus: syllabus?.id,
      academy: session.academy.id,
      schedule_type: values.schedule_type
        ? values.schedule_type.toUpperCase().replace(' ', '-')
        : null,
    };
    bc.admissions()
      .addSchedule(request)
      .then(({ data }) => {
        appendSchedule(data);
      })
      .catch(console.error);
  };

  return (
    <Dialog
      onClose={() => setIsOpen(false)}
      open={isOpen}
      aria-labelledby="simple-dialog-title"
    >
      <DialogTitle id="simple-dialog-title">New schedule</DialogTitle>
      <Formik
        initialValues={{ schedule_type: '' }}
        validationSchema={schema}
        onSubmit={(values) => {
          saveSchedule(values);
          setIsOpen(false);
        }}
      >
        {({ handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="d-flex justify-content-center mt-0 p-4"
            style={{ paddingTop: 0 }}
          >
            <DialogContent style={{ paddingTop: 0 }}>
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
              <Select
                form="new-schedule"
                type="text"
                options={scheduleTypes}
                name="schedule_type"
                // placeholder="Part time"
                label="Schedule type"
                required
                dialog
              />
            </DialogContent>
            <DialogActions className={classes.button}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                data-cy="new-schedule-submit"
              >
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
