import React from 'react';
import {
  Grid,
  TextField,
  DialogContentText,
  StaticDatePicker
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from 'formik';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
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
}));

const Field = ({
  form='default', label, dialog, children, ...props
}) => {
  props.name = props.name || '';
  props.name = props.name.toLowerCase().replace(/ /g, '_');
  const [field, meta, helpers] = useField(props);
  const { name } = props;
  const classes = useStyles();
  const fieldName = name.toLowerCase().replace(/ /g, '_');
  const cypressFieldName = `${form}-${fieldName.replace(/_/g, '-')}`;
  const labelText = label || capitalizeEachFirstLetter(name);

  const onChange = (v) => {
    helpers.setValue(v.toISOString());
    helpers.setTouched(true);
  };

  const textProps = {
    fullWidth: true,
    'data-cy': cypressFieldName,
    size: 'small',
    variant: 'outlined',
    // value: values[fieldName],
    // onChange: handleChange,
    // onBlur: handleBlur,
    helperText: meta.touched ? meta.error : '',
    error: meta.touched && meta.error,
    // type,
    // placeholder,
    // required,
    // select,
    // multiline,
    // type: 'datetime',
    format: 'MMMM dd, yyyy',
    type: 'text',
    autoOk: true,
    ...field,
    ...props,
    name: fieldName,
    onChange,
    // onClose: field.onBlur,
    onClose: () => helpers.setTouched(true),
  };

  if (meta.value) textProps.value = meta.value;
  if (props.select) textProps.label = label;
  return (
    <>
      {dialog ? (
        <>
          <DialogContentText className={classes.dialogue} style={{ marginTop: 12 }}>
            {labelText}
          </DialogContentText>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker {...textProps} />
          </MuiPickersUtilsProvider>
        </>
      ) : (
        <>
          <Grid item md={5} sm={5} xs={5}>
            {labelText}
          </Grid>
          <Grid item md={7} sm={7} xs={7} style={meta.touched && meta.error ? { marginBottom: '-23px' } : {}}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker {...textProps} />
            </MuiPickersUtilsProvider>
          </Grid>
        </>
      )}
    </>
  );
};

export default Field;
