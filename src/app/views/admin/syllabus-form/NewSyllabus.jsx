import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Dialog,
} from '@material-ui/core';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import bc from '../../../services/breathecode';

const propTypes = {
  user: PropTypes.string.isRequired,
  stdId: PropTypes.number.isRequired,
  openRoleDialog: PropTypes.number.isRequired,
  setOpenRoleDialog: PropTypes.number.isRequired,
};

const StudentDetails = ({
  user, stdId, openRoleDialog, setOpenRoleDialog,
}) => {
  const initialValues = {
//    first_name: user?.first_name,
  };

  const [roleDialog, setRoleDialog] = useState(false);
  // const [role, setRole] = useState('');

  const validateSlug = (values) => {
    if (!values.slug) return '';
    if (/ /.test(values.slug)) return 'Slug can\'t contains spaces';
    if (/[^a-zA-Z0-9-]+/.test(values.slug)) return 'Slug can\'t contains symbols';
    if (/-$/.test(values.slug)) return 'Slug can\'t end with (-)';
    if (!/^[a-z\-]+$/.test(values.slug)) return 'Invalid slug';
    return '';
  };

  const validateName = (values) => {
    if (!values.name) return '';
    if (/[^a-zA-Z0-9 ]+/.test(values.name)) return 'Name can\'t contains symbols';
    if (!/^[a-zA-Z ]+$/.test(values.name)) return 'Invalid name';
    return '';
  };

  const validateGithubUrl = (values) => {
    if (!values.github_url) return '';
    if (!/^https?:\/\/github\.com\//i.test(values.github_url)) return 'Invalid github url';
    return '';
  };

  const validate = (values) => {
    const errors = {};

    errors.slug = validateSlug(values);
    errors.name = validateName(values);
    errors.github_url = validateGithubUrl(values);

    return errors;
  };

  const capitalizeTheFirstLetter = (words) => words.replace(/(\w+)/g, (v, captureGroup) => {
    const firstLetter = captureGroup.slice(0, 1).toUpperCase();
    const restOfLetters = captureGroup.slice(1, captureGroup.length).toLowerCase();
    return firstLetter + restOfLetters;
  });

  const Field = ({
    values, errors, handleChange, handleBlur, name, label, placeholder, type, required
  }) => {
    const fieldName = name.toLowerCase().replace(' ', '_');
    const labelText = label || capitalizeTheFirstLetter(name);
    return (
      <TableRow>
        <TableCell className="pl-4">{labelText}</TableCell>
        <TableCell>
          <TextField
            type={type}
            name={fieldName}
            data-cy={fieldName}
            placeholder={placeholder}
            size="small"
            variant="outlined"
            value={values[fieldName]}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={errors[fieldName]}
            error={errors[fieldName]}
            required
          />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="pt-6" elevation={3}>
      <Formik
        initialValues={{ slug: '', name: '' }}
        validate={validate}
      >
        {({
          values, errors, handleChange, handleBlur, handleSubmit,
        }) => (
          <form className="p-4" onSubmit={handleSubmit}>
            <Table className="mb-4">
              <TableBody>
                <Field
                  type="text"
                  name="Slug"
                  values={values}
                  errors={errors}
                  placeholder="full-stack-pt"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  required
                />
                <Field
                  type="text"
                  name="Name"
                  values={values}
                  errors={errors}
                  placeholder="Full Stack PT"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  required
                />
                <Field
                  type="number"
                  label="Total hours"
                  name="duration_in_hours"
                  values={values}
                  errors={errors}
                  placeholder="12345"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  required
                />
                <Field
                  type="number"
                  label="Weekly hours"
                  name="week_hours"
                  values={values}
                  errors={errors}
                  placeholder="12345"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  required
                />
                <Field
                  type="number"
                  label="Total Days"
                  name="duration_in_days"
                  values={values}
                  errors={errors}
                  placeholder="12345"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  required
                />
                <Field
                  type="text"
                  label="Github URL"
                  name="github_url"
                  values={values}
                  errors={errors}
                  placeholder="https://github.com/user/repo"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  required
                />
              </TableBody>
            </Table>
            <div className="flex-column items-start px-4 mb-4">
              <Button color="primary" variant="contained" type="submit">
                Save Syllabus Details
              </Button>
            </div>
          </form>
        )}
      </Formik>
      <Dialog
        onClose={() => {
          setRoleDialog(false);
          setOpenRoleDialog(false);
        }}
        open={roleDialog || openRoleDialog}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title">Change Syllabus Visibility</DialogTitle>
        <List>
          {['Private', 'Public']?.map((slug) => (
            <ListItem
              button
              onClick={() => {
                updateRole(slug);
                setRoleDialog(false);
                setOpenRoleDialog(false);
              }}
              key={slug}
            >
              <ListItemText primary={slug} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
};

StudentDetails.propTypes = propTypes;

export default StudentDetails;
