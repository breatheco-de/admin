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
import moment from 'moment';
import bc from '../../../services/breathecode';
import { capitalizeEachFirstLetter, schemas } from '../../../utils';
import Field from '../../../components/Field';
import Date from '../../../components/Date';
import Time from '../../../components/Time';
import Select from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';

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

const recurrencyTypes = ['Daily', 'Weekly', 'Monthly'];
const schema = Yup.object().shape({
  slug: schemas.slug(),
  starting_hour: schemas.time('starting hour'),
  ending_hour: schemas.time('ending hour'),
  starting_date: schemas.date('starting date'),
  recurrent: Yup.bool().required(),
  recurrency_type: schemas.select('Recurrency type', recurrencyTypes),
});

const NewTimeslot = ({ isOpen, setIsOpen, schedule }) => {
  const classes = useStyles();
  const initialValues = {
    slug: '',
    starting_date: '',
    starting_hour: '',
    ending_hour: '',
  };

  const saveSchedule = ({
    starting_date, starting_hour, ending_hour, recurrency_type, ...values
  }) => {
    const start = moment(starting_hour);
    const end = moment(ending_hour);

    // prevent overflow
    if (start.get('hour') > end.get('hour')) {
      end.set('date', end.get('date') + 1);
    }

    const delta = moment.duration(end.diff(start));

    const starting_at = moment(starting_date).set({
      hour: start.get('hour'),
      minute: start.get('minute'),
      second: 0,
    }).toISOString();

    const ending_at = moment(starting_date).set({
      hour: start.get('hour'),
      minute: start.get('minute'),
      second: 0,
    }).add(delta).toISOString();

    bc.admissions().addTimeslot(schedule?.id, {
      ...values,
      starting_at,
      ending_at,
      recurrency_type: recurrency_type.toUpperCase(),
    });
  };

  return (
    <Dialog
      onClose={() => setIsOpen(false)}
      open={isOpen}
      aria-labelledby="simple-dialog-title"
    >
      <DialogTitle id="simple-dialog-title">New timeslot</DialogTitle>
      <Formik
        initialValues={initialValues}
        // enableReinitialize
        validationSchema={schema}
        // validate={validate}
        onSubmit={(values) => {
          saveSchedule(values);
          setIsOpen(false);
        }}
      >
        {({
          values, handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} className="d-flex justify-content-center mt-0 p-4" style={{ paddingTop: 0 }}>
            <DialogContent style={{ paddingTop: 0 }}>
              <Field
                form="new-timeslot"
                type="text"
                name="Slug"
                placeholder="full-stack-pt"
                required
                dialog
              />
              <Date
                form="new-timeslot"
                name="starting_date"
                label="Starting date"
                // placeholder="full-stack-pt"
                // disablePast
                required
                dialog
              />
              <Time
                form="new-timeslot"
                name="starting_hour"
                label="Starting hour"
                // placeholder="full-stack-pt"
                required
                dialog
              />
              <Time
                form="new-timeslot"
                name="ending_hour"
                label="Ending hour"
                // placeholder="full-stack-pt"
                required
                dialog
              />
              <Select
                disabled={!values.recurrent}
                form="new-timeslot"
                type="text"
                options={recurrencyTypes}
                name="recurrency_type"
                // placeholder="Part time"
                label="Recurrency type"
                required
                dialog
              />
              <Checkbox
                form="new-timeslot"
                name="Recurrent"
                required
                dialog
              />
            </DialogContent>
            <DialogActions className={classes.button}>
              <Button color="primary" variant="contained" type="submit" data-cy="new-timeslot-submit">
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
