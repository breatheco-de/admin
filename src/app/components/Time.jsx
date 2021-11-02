import React, { useRef, useEffect } from 'react';
import {
  Grid,
  TextField,
  DialogContentText,
} from '@material-ui/core';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from 'formik';
import TimePicker from '@mui/lab/TimePicker';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

// import TextField from '@mui/lab/TextField';
// import TextField from '@mui/material/TextField';
// import { TextField } from '@mui/material';
import { capitalizeEachFirstLetter } from '../utils';

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
  children: undefined,
};

const propTypes = {
  form: PropTypes.string,
  label: PropTypes.string,
  dialog: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  name: PropTypes.string.isRequired,
};

const Field = ({
  form, label, dialog, readOnly, children, ...props
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

  const onChange = (v) => {
    try {
      helpers.setValue(v.toISOString());
    } catch {
      helpers.setValue('');
    }
  };

  const textProps = {
    fullWidth: true,
    size: 'small',
    variant: 'outlined',
    type: 'time',
    helperText: meta.touched ? meta.error : '',
    error: meta.touched && Boolean(meta.error),
    onBlur: field.onBlur,
    name: fieldName,
    placeholder: '',
    ref: elementRef,
    readOnly,
    ...extraProps,
  };

  // // fix a bug in production build
  // if ('required' in textProps && !textProps.required) delete textProps.required;
  // if ('readonly' in textProps && !textProps.readonly) delete textProps.readonly;

  const renderInput = (params) => {
    const { inputProps } = params;
    const cumtomInputProps = {
      ...inputProps,
      value: inputProps.value,
    };

    const customParams = { ...params, inputProps: cumtomInputProps };
    return <TextField {...customParams} {...textProps} />;
  };

  const dateProps = {
    fullWidth: true,
    size: 'small',
    variant: 'outlined',
    disableMaskedInput: true,
    'data-cy': cypressFieldName,
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

  useEffect(() => {
    setInterval(() => {
      if (!textProps.required && elementRef.current.getAttribute('required') === '') {
        elementRef.current.removeAttribute('required');
      }
      if (!textProps.readOnly && elementRef.current.getAttribute('readonly') === '') {
        elementRef.current.removeAttribute('readonly');
      }
    }, 0);
  }, []);

  if (meta.value) textProps.value = meta.value;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {dialog ? (
        <>
          <DialogContentText className={classes.dialogue} style={{ marginTop: 12 }}>
            {labelText}
          </DialogContentText>
          <Box {...boxProps} >
            <TimePicker {...dateProps} />
          </Box>
        </>
      ) : (
        <>
          <Grid item md={5} sm={5} xs={5}>
            {labelText}
          </Grid>
          <Grid item md={7} sm={7} xs={7} style={meta.touched && meta.error ? { marginBottom: '-23px' } : {}}>
            <Box {...boxProps} >
              <TimePicker {...dateProps} />
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
