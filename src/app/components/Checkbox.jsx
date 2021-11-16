import React from 'react';
import {
  Grid,
  Checkbox,
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
};

const propTypes = {
  form: PropTypes.string,
  label: PropTypes.string,
  dialog: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

const Select = ({
  form, label, dialog, ...props
}) => {
  const extraProps = props;

  extraProps.name = extraProps.name || '';
  extraProps.name = extraProps.name.toLowerCase().replace(/ /g, '_');
  extraProps.type = 'checkbox';

  const [field, meta] = useField(extraProps);
  const { name } = extraProps;
  const classes = useStyles();
  const fieldName = name.toLowerCase().replace(/ /g, '_');
  const cypressFieldName = `${form}-${fieldName.replace(/_/g, '-')}`;
  const labelText = label || capitalizeEachFirstLetter(name);
  const textProps = {
    'data-cy': cypressFieldName,
    size: 'small',
    variant: 'outlined',
    ...field,
    ...extraProps,
    name: fieldName,
    value: field.value || extraProps.value || 'false',
  };

  if (meta.value) textProps.value = meta.value;
  return (
    <>
      {dialog ? (
        <>
          <DialogContentText className={classes.dialogue} style={{ marginTop: 12 }}>
            {labelText}
            <Checkbox {...textProps} />
          </DialogContentText>
        </>
      ) : (
        <>
          <Grid item md={12} sm={12} xs={12}>
            {labelText}
            <Checkbox {...textProps} />
          </Grid>
        </>
      )}
    </>
  );
};

Select.defaultProps = defaultProps;
Select.propTypes = propTypes;

export default Select;
