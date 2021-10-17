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

const recurrentTypes = ['DAILY', 'WEEKLY', 'MONTHLY'];
const schema = Yup.object().shape({
  // academy: yup.number().required().positive().integer(),
  // specialty_mode: yup.number().required().positive().integer(),
  slug: schemas.slug,
  starting_hour: Yup.string().required().matches(/\d{1,2}:\d{2}/, 'Invalid hour'),
  ending_hour: Yup.string().required().matches(/\d{1,2}:\d{2}/, 'Invalid hour'),
  starting_date: Yup.date().required(),
  ending_date: Yup.date().required(),
  recurrent: Yup.bool().required(),
  recurrent_type: Yup.mixed().oneOf(recurrentTypes).required(),
});

const NewTimeslot = ({ isOpen, setIsOpen }) => {
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
                values={values}
                errors={errors}
                touched={touched}
                placeholder="full-stack-pt"
                handleChange={handleChange}
                handleBlur={handleBlur}
                required
                dialog
              />
              {/* <Field
                type="text"
                name="Slug"
                values={values}
                errors={errors}
                touched={touched}
                placeholder="full-stack-pt"
                handleChange={handleChange}
                handleBlur={handleBlur}
                required
                dialog
              />
              <Field
                type="text"
                name="Slug"
                values={values}
                errors={errors}
                touched={touched}
                placeholder="full-stack-pt"
                handleChange={handleChange}
                handleBlur={handleBlur}
                required
                dialog
              /> */}
              <DialogContentText className={classes.dialogue}>Select a stage:</DialogContentText>
              <TextField
                select
                className={classes.select}
                label="Stage"
                name="stage"
                size="small"
                variant="outlined"
                // defaultValue={cohort.stage}
                // onChange={(e) => {
                //   setStage(e.target.value);
                // }}
              >
                {recurrentTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {capitalizeEachFirstLetter(option)}
                  </MenuItem>
                ))}
              </TextField>
              <DialogContentText className={classes.dialogue}>
                Select a current day:
              </DialogContentText>
              <TextField
                error={errors.current_day && touched.current_day}
                helperText={touched.current_day && errors.current_day}
                type="number"
                name="current_day"
                size="small"
                variant="outlined"
                // handleChange={handleChange}
                // handleBlur={handleBlur}
                // value={stage === 'ENDED' ? maxSyllabusDays : currentDay}
                // onChange={(e) => {
                //   setCurrentDay(e.target.value);
                // }}
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
