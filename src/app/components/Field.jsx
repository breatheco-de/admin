import React from 'react';
import { Grid, TextField, DialogContentText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from 'formik';
import PropTypes from 'prop-types';
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

const defaultProps = {
  form: 'default',
  label: undefined,
  dialog: false,
  select: false,
  children: undefined,
};

const propTypes = {
  form: PropTypes.string,
  label: PropTypes.string,
  dialog: PropTypes.bool,
  select: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  name: PropTypes.string.isRequired,
};

const Field = ({
  form,
  label,
  dialog,
  children,
  ...props
  // values={}, errors={}, handleChange, handleBlur, name, label, placeholder,
  // type, required=false, dialog, touched={}, form='default', select=false, children,
  // multiline=false, ...props
}) => {
  const extraProps = props;

  extraProps.name = extraProps.name || '';
  extraProps.name = extraProps.name.toLowerCase().replace(/ /g, '_');
  const [field, meta] = useField(extraProps);
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
    ...field,
    ...extraProps,
    name: fieldName,
  };

  // fix a bug in production build
  if ('required' in textProps && !textProps.required) delete textProps.required;
  if ('readonly' in textProps && !textProps.readonly) delete textProps.readonly;

  if (meta.value) textProps.value = meta.value;
  if (extraProps.select) textProps.label = label;

  return (
    <>
      {dialog ? (
        <>
          <DialogContentText
            className={classes.dialogue}
            style={{ marginTop: 12 }}
          >
            {labelText}
          </DialogContentText>
          <TextField {...textProps}>{children}</TextField>
        </>
      ) : (
        <>
          <Grid item md={5} sm={5} xs={5}>
            {labelText}
          </Grid>
          <Grid
            item
            md={7}
            sm={7}
            xs={7}
            style={meta.touched && meta.error ? { marginBottom: '-23px' } : {}}
          >
            <TextField {...textProps}>{children}</TextField>
          </Grid>
        </>
      )}
    </>
  );
};

Field.defaultProps = defaultProps;
Field.propTypes = propTypes;

export default Field;
