import React from 'react';
import {
  Grid,
  TextField,
  DialogContentText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { capitalizeEachFirstLetter, capitalizeTheFirstLetter } from '../utils';

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

const defaultProps = {
  form: 'default',
  label: undefined,
  dialog: false,
  children: undefined,
};

const propTypes = {
  form: PropTypes.string,
  label: PropTypes.string,
  dialog: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  name: PropTypes.string.isRequired,
};

const Select = ({
  form, label, dialog, children, disabled, options, ...props
}) => {
  const extraProps = props;

  extraProps.name = extraProps.name || '';
  extraProps.name = extraProps.name.toLowerCase().replace(/ /g, '_');

  const [field, meta, helpers] = useField(extraProps);
  const { name } = extraProps;
  const classes = useStyles();
  const fieldName = name.toLowerCase().replace(/ /g, '_');
  const cypressFieldName = `${form}-${fieldName.replace(/_/g, '-')}`;
  const labelText = label || capitalizeEachFirstLetter(name);
  const textProps = {
    fullWidth: true,
    'data-cy': cypressFieldName,
    size: 'small',
    variant: 'outlined',
    helperText: meta.touched ? meta.error : '',
    error: meta.touched && meta.error,
    // ...field,
    ...extraProps,
    name: fieldName,
  };

  if (meta.value) textProps.value = meta.value;
  return (
    <>
      {dialog ? (
        <>
          <DialogContentText className={classes.dialogue} style={{ marginTop: 12 }}>
            {labelText}
          </DialogContentText>
          <Autocomplete
            disabled={disabled}
            options={options}
            // groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option}
            {...field}
            onChange={(_, v) => helpers.setValue(v)}
            renderInput={(params) => <TextField {...params} {...textProps} />}
          />
        </>
      ) : (
        <>
          <Grid item md={5} sm={5} xs={5}>
            {labelText}
          </Grid>
          <Grid item md={7} sm={7} xs={7} style={meta.touched && meta.error ? { marginBottom: '-23px' } : {}}>
            <Autocomplete
              id="grouped-demo"
              options={options}
              // groupBy={(option) => option.firstLetter}
              // getOptionLabel={(option) => option.label}
              renderInput={(params) => <TextField {...params} {...textProps} />}
            />
          </Grid>
        </>
      )}
    </>
  );
};

Select.defaultProps = defaultProps;
Select.propTypes = propTypes;

export default Select;
