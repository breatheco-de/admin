import React from 'react';
import {
  Grid,
  TextField,
  DialogContentText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from 'formik';
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

// const Field = ({
//   values={}, errors={}, handleChange, handleBlur, name, label, placeholder,
//   type, required=false, dialog, touched={}, form='default', select=false, children,
//   multiline=false
// }) => {
//   const classes = useStyles();
//   const fieldName = name.toLowerCase().replace(/ /g, '_');
//   const cypressFieldName = `${form}-${fieldName.replace(/_/g, '-')}`;
//   const labelText = label || capitalizeEachFirstLetter(name);
//   const props = {
//     fullWidth: true,
//     name: fieldName,
//     'data-cy': cypressFieldName,
//     size: 'small',
//     variant: 'outlined',
//     value: values[fieldName],
//     onChange: handleChange,
//     onBlur: handleBlur,
//     helperText: touched[fieldName] ? errors[fieldName] : '',
//     error: touched[fieldName] && errors[fieldName],
//     type,
//     placeholder,
//     required,
//     select,
//     multiline,
//   };

//   if (values[fieldName]) props.value = values[fieldName];
//   return (
//     <>
//       {dialog ? (
//         <>
//           <DialogContentText className={classes.dialogue} style={{ marginTop: 12 }}>
//             {labelText}
//           </DialogContentText>
//           <TextField {...props}>
//             {children}
//           </TextField>
//         </>
//       ) : (
//         <>
//           <Grid item md={5} sm={5} xs={5}>
//             {labelText}
//           </Grid>
//           <Grid item md={7} sm={7} xs={7} style={touched[fieldName] && errors[fieldName] ? { marginBottom: '-23px' } : {}}>
//             <TextField {...props}>
//               {children}
//             </TextField>
//           </Grid>
//         </>
//       )}
//     </>
//   );
// };

const Field = ({
  form='default', label, dialog, children, ...props
  // values={}, errors={}, handleChange, handleBlur, name, label, placeholder,
  // type, required=false, dialog, touched={}, form='default', select=false, children,
  // multiline=false, ...props
}) => {
  props.name = props.name || '';
  props.name = props.name.toLowerCase().replace(/ /g, '_');
  const [field, meta] = useField(props);
  const { name } = props;
  const classes = useStyles();
  const fieldName = name.toLowerCase().replace(/ /g, '_');
  const cypressFieldName = `${form}-${fieldName.replace(/_/g, '-')}`;
  const labelText = label || capitalizeEachFirstLetter(name);
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
    ...field,
    ...props,
    name: fieldName,
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
          <TextField {...textProps}>
            {children}
          </TextField>
        </>
      ) : (
        <>
          <Grid item md={5} sm={5} xs={5}>
            {labelText}
          </Grid>
          <Grid item md={7} sm={7} xs={7} style={meta.touched && meta.error ? { marginBottom: '-23px' } : {}}>
            <TextField {...textProps}>
              {children}
            </TextField>
          </Grid>
        </>
      )}
    </>
  );
};

export default Field;
