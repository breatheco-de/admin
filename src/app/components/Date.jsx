import React, { useRef, useEffect } from 'react';
import {
  Grid,
  TextField,
  DialogContentText,
} from '@material-ui/core';
import DateAdapter from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from 'formik';
import DatePicker from '@mui/lab/DatePicker';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// import TextField from '@mui/lab/TextField';
// import TextField from '@mui/material/TextField';
// import { TextField } from '@mui/material';
import { capitalizeEachFirstLetter } from '../utils';

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
  date: {
    display: 'flex',
  },
}));

const defaultProps = {
  form: 'default',
  label: undefined,
  dialog: false,
  required: false,
  readOnly: false,
  timezone: undefined,
  children: undefined,
};

const propTypes = {
  form: PropTypes.string,
  label: PropTypes.string,
  dialog: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  timezone: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  name: PropTypes.string.isRequired,
};

const Field = ({
  form, label, dialog, readOnly, timezone, children, ...props
}) => {
  const elementRef = useRef();

  const extraProps = props;
  extraProps.name = props.name || '';
  extraProps.name = props.name.toLowerCase().replace(/ /g, '_');
  const [field, meta, helpers] = useField(extraProps);
  const { name } = extraProps;
  const classes = useStyles();
  const fieldName = name.toLowerCase().replace(/ /g, '_');
  const cypressFieldName = `${form}-${fieldName.replace(/_/g, '-')}`;
  const labelText = label || capitalizeEachFirstLetter(name);

  if (timezone) dayjs.tz.setDefault(timezone);

  const onChange = (date, value) => {
    try {
      if (/ ,/.test(value)) throw new Error();

      if (timezone) {
        helpers.setValue(dayjs(value).tz(timezone, true).toISOString());
      } else {
        helpers.setValue(date.toISOString());
      }
    } catch {
      helpers.setValue('');
    }
  };

  const textProps = {
    fullWidth: true,
    size: 'small',
    variant: 'outlined',
    // type: 'datetime',
    helperText: meta.touched ? meta.error : '',
    error: meta.touched && Boolean(meta.error),
    onBlur: field.onBlur,
    name: fieldName,
    ref: elementRef,
    readOnly,
    ...extraProps,
  };

  const renderInput = (params) => {
    const { inputProps } = params;
    const cumtomInputProps = {
      ...inputProps,
      readOnly,
      value: inputProps.value,
    };

    const customParams = { ...params, inputProps: cumtomInputProps };
    return <TextField {...customParams} {...textProps} />;
  };

  const dateProps = {
    fullWidth: true,
    size: 'small',
    variant: 'outlined',
    inputFormat: 'MMMM DD, YYYY',
    disableMaskedInput: true,
    autoOk: true,
    name: fieldName,
    value: field.value,
    onChange,
    renderInput,
  };

  const boxProps = {
    'data-cy': cypressFieldName,
    sx: {
      '& *': {
        display: 'flex',
      },
    },
  };

  if (meta.value) textProps.value = meta.value;
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      {dialog ? (
        <>
          <DialogContentText className={classes.dialogue} style={{ marginTop: 12 }}>
            {labelText}
          </DialogContentText>
          <Box {...boxProps} >
            <DatePicker {...dateProps} />
          </Box>
        </>
      ) : (
        <>
          <Grid item md={5} sm={5} xs={5}>
            {labelText}
          </Grid>
          <Grid item md={7} sm={7} xs={7} style={meta.touched && meta.error ? { marginBottom: '-23px' } : {}}>
            <Box {...boxProps} >
              <DatePicker {...dateProps} />
            </Box>
          </Grid>
        </>
      )}
    </LocalizationProvider>
  );
};

Field.defaultProps = defaultProps;
Field.propTypes = propTypes;

export default Field;
