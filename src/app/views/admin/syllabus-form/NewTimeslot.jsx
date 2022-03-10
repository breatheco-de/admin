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
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import bc from '../../../services/breathecode';
import { capitalizeEachFirstLetter, schemas } from '../../../utils';
import Field from '../../../components/Field';
import Date from '../../../components/Date';
import Time from '../../../components/Time';
import Select from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';
import { getSession } from '../../../redux/actions/SessionActions';
import { toISOStringFromTimezone } from '../../../../utils';

const propTypes = {
  schedules: PropTypes.arrayOf(PropTypes.object).isRequired,
};

dayjs.extend(tz);
dayjs.extend(utc);

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
  starting_hour: schemas.time('starting hour'),
  ending_hour: schemas.time('ending hour'),
  starting_date: schemas.date('starting date'),
  recurrent: Yup.bool(),
  recurrency_type: schemas.select('Recurrency type', recurrencyTypes, false),
});

const NewTimeslot = ({ isOpen, setIsOpen, schedule, appendTimeslot }) => {
  const [session] = useState(getSession());
  const classes = useStyles();
  const initialValues = {
    starting_date: '',
    starting_hour: '',
    ending_hour: '',
    recurrent: false,
    recurrency_type: '',
  };

  if (session?.academy?.timezone) dayjs.tz.setDefault(session.academy.timezone);

  const saveSchedule = ({
    starting_date,
    starting_hour,
    ending_hour,
    recurrency_type,
    ...values
  }) => {
    starting_hour = toISOStringFromTimezone(
      starting_hour,
      session.academy.timezone
    );
    ending_hour = toISOStringFromTimezone(
      ending_hour,
      session.academy.timezone
    );

    const date = dayjs(starting_date).tz(session.academy.timezone);
    const start = dayjs(starting_hour)
      .tz(session.academy.timezone)
      .year(date.year())
      .month(date.month())
      .date(date.date());

    let end = dayjs(ending_hour)
      .tz(session.academy.timezone)
      .year(date.year())
      .month(date.month())
      .date(date.date());

    // prevent overflow
    if (start.get('hour') > end.get('hour')) {
      end = end.set('date', end.get('date') + 1);
    }

    const { timezone } = session.academy;
    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'HH:mm';
    const datetimeFormat = `${dateFormat} ${timeFormat}`;
    const startingDate = `${start.format(dateFormat)} ${start.format(
      timeFormat
    )}`;
    const endingDate = `${end.format(dateFormat)} ${end.format(timeFormat)}`;

    const starting_at = dayjs
      .tz(startingDate, datetimeFormat, timezone)
      .toISOString();
    const ending_at = dayjs
      .tz(endingDate, datetimeFormat, timezone)
      .toISOString();

    const body = {
      ...values,
      starting_at,
      ending_at,
    };

    if (recurrency_type) {
      body['recurrency_type'] = recurrency_type.toUpperCase();
    }

    bc.admissions()
      .addTimeslot(schedule?.id, body)
      .then(({ data }) => appendTimeslot({ ...data, starting_at, ending_at }))
      .catch(console.error);
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
        validationSchema={schema}
        onSubmit={(values) => {
          saveSchedule(values);
          setIsOpen(false);
        }}
      >
        {({ values, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="d-flex justify-content-center mt-0 p-4"
            style={{ paddingTop: 0 }}
          >
            <DialogContent style={{ paddingTop: 0 }}>
              <Date
                form="new-timeslot"
                name="starting_date"
                label="Starting date"
                required
                dialog
              />
              <Time
                form="new-timeslot"
                name="starting_hour"
                label="Starting hour"
                required
                dialog
              />
              <Time
                form="new-timeslot"
                name="ending_hour"
                label="Ending hour"
                required
                dialog
              />
              <Select
                disabled={!values.recurrent}
                form="new-timeslot"
                type="text"
                options={recurrencyTypes}
                name="recurrency_type"
                label="Recurrency type"
                required
                dialog
              />
              <Checkbox form="new-timeslot" name="Recurrent" dialog />
            </DialogContent>
            <DialogActions className={classes.button}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                data-cy="new-timeslot-submit"
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

export default NewTimeslot;
