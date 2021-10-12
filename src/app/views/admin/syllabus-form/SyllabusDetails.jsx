import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  Grid,
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
// import axios from 'axios';
// import * as yup from 'yup';
import PropTypes from 'prop-types';
import bc from '../../../services/breathecode';
import { ContinuousColorLegend } from 'react-vis';

const capitalizeTheFirstLetter = (words) => words.replace(/(\w+)/g, (v, captureGroup) => {
  const firstLetter = captureGroup.slice(0, 1).toUpperCase();
  const restOfLetters = captureGroup.slice(1, captureGroup.length).toLowerCase();
  return firstLetter + restOfLetters;
});

const Field = ({
  values, errors, handleChange, handleBlur, name, label, placeholder, type, required=false
}) => {
  const fieldName = name.toLowerCase().replace(/ /g, '_');
  const cypressFieldName = fieldName.replace(/_/g, '-');
  const labelText = label || capitalizeTheFirstLetter(name);
  const props = {};

  if (values[fieldName]) props.value = values[fieldName];
  return (
    <>
      <Grid item md={5} sm={5} xs={5}>
        {labelText}
      </Grid>
      <Grid item md={7} sm={7} xs={7} style={errors[fieldName] ? { marginBottom: '-23px' } : {}}>
        <TextField
          fullWidth
          type={type}
          name={fieldName}
          data-cy={cypressFieldName}
          placeholder={placeholder}
          size="small"
          variant="outlined"
          // value={values[fieldName]}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={errors[fieldName]}
          error={!!errors[fieldName]}
          required={required}
          {...props}
        />
      </Grid>
    </>
  );
};

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

const StudentDetails = ({ syllabus, onSubmit }) => {
  const validateSlug = (values) => {
    if (!values.slug) return '';
    if (/ /.test(values.slug)) return 'Slug can\'t contains spaces';
    if (/[A-Z]/.test(values.slug)) return 'Slug can\'t contains uppercase';
    if (/[^a-zA-Z0-9-]+/.test(values.slug)) return 'Slug can\'t contains symbols';
    if (/-$/.test(values.slug)) return 'Slug can\'t end with (-)';
    if (!/^[a-z0-9-]+$/.test(values.slug)) return 'Invalid slug';
    return '';
  };

  const validateName = (values) => {
    if (!values.name) return '';
    if (/[^a-zA-Z0-9 -]+/.test(values.name)) return 'Name can\'t contains symbols';
    if (!/^[a-zA-Z0-9 -]+$/.test(values.name)) return 'Invalid name';
    return '';
  };

  const validateDurationInHours = (values) => {
    if (values.duration_in_hours === '') return '';
    if (values.duration_in_hours === 0) return 'Total hours can\'t be equat to 0';
    if (values.duration_in_hours < 0) return 'Total hours can\'t be equat less that 0';
    return '';
  };

  const validateWeekHours = (values) => {
    if (values.week_hours === '') return '';
    if (values.week_hours === 0) return 'Weekly hours can\'t be equat to 0';
    if (values.week_hours < 0) return 'Weekly hours can\'t be equat less that 0';
    return '';
  };

  const validateDurationInDays = (values) => {
    if (values.duration_in_days === '') return '';
    if (values.duration_in_days === 0) return 'Total days can\'t be equat to 0';
    if (values.duration_in_days < 0) return 'Total days can\'t be equat less that 0';
    return '';
  };

  const validateGithubUrl = (values) => {
    if (!values.github_url) return '';
    if (!/^https?:\/\/github\.com\//i.test(values.github_url)) return 'Invalid github url';
    return '';
  };

  const validateLogo = (values) => {
    // const urlPattern = /^https?:\/\/(www\.)?/i;
    const urlPattern = /^https?:\/\/(www.)?(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])\//gm;
    if (!values.logo) return '';
    if (!urlPattern.test(values.logo)) return 'Invalid logo url';

    // here should implement a service that check if url exist using head method
    // this should be implement in the backend

    return '';
  };

  const validate = (values) => {
    const errors = {};

    const slugError = validateSlug(values);
    if (slugError) errors.slug = slugError;

    const nameError = validateName(values);
    if (nameError) errors.name = nameError;

    const durationInHoursError = validateDurationInHours(values);
    if (durationInHoursError) errors.duration_in_hours = durationInHoursError;

    const weekHoursError = validateWeekHours(values);
    if (weekHoursError) errors.week_hours = weekHoursError;

    const durationInDaysError = validateDurationInDays(values);
    if (durationInDaysError) errors.duration_in_days = durationInDaysError;

    const githubUrlError = validateGithubUrl(values);
    if (githubUrlError) errors.github_url = githubUrlError;

    const LogoError = validateLogo(values);
    if (LogoError) errors.logo = LogoError;

    return errors;
  };

  return (
    <Card className="pt-6" elevation={3}>
      <Formik
        initialValues={syllabus}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
          setSubmitting(false);
        }}
      >
        {({
          values, errors, handleChange, handleBlur, handleSubmit, isSubmitting,
        }) => (
          <form className="p-4" onSubmit={handleSubmit}>
            <Grid container spacing={3} alignItems="center">
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
              />
              <Field
                type="text"
                name="logo"
                values={values}
                errors={errors}
                placeholder="https://storage.googleapis.com/bucket/filename"
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
              <div className="flex-column items-start px-4 mb-4">
                <Button color="primary" variant="contained" type="submit" data-cy="submit" disabled={isSubmitting}>
                  Save Syllabus Details
                </Button>
              </div>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

StudentDetails.propTypes = propTypes;

export default StudentDetails;
