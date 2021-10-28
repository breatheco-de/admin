import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Grid,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
// import axios from 'axios';
// import * as yup from 'yup';
import PropTypes from 'prop-types';
import bc from '../../../services/breathecode';
import Field from '../../../components/Field';
import { schemas } from '../../../utils';

const syllabusPropTypes = {
  id: PropTypes.number,
  slug: PropTypes.string,
  name: PropTypes.string,
  github_url: PropTypes.string,
  duration_in_hours: PropTypes.number,
  duration_in_days: PropTypes.number,
  week_hours: PropTypes.number,
  logo: PropTypes.string,
  private: PropTypes.bool,
  academy_owner: PropTypes.number,
  created_at: PropTypes.string,
  updated_at: PropTypes.string,
};

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  syllabus: PropTypes.shape(syllabusPropTypes).isRequired,
};

const schema = Yup.object().shape({
  // academy: yup.number().required().positive().integer(),
  // specialty_mode: yup.number().required().positive().integer(),
  slug: schemas.slug(),
  name: schemas.name(),
  duration_in_hours: schemas.nonZeroPositiveNumber('Total hours'),
  week_hours: schemas.nonZeroPositiveNumber('Weekly hours'),
  duration_in_days: schemas.nonZeroPositiveNumber('Total days'),
  github_url: Yup.string().url('Invalid github url').required('Github url is a required field')
    .test(
      'invalid-github-url',
      'Invalid github url',
      (value) => /^https?:\/\/github\.com\//i.test(value),
    ),
  logo: Yup.string().url('Invalid logo url').required('Logo is a required field'),
  // schedule_type: Yup.mixed().oneOf(scheduleTypes).required(),
});

const StudentDetails = ({ syllabus, onSubmit }) => {
  // TODO: remove this console.log
  console.log();
  return (
    <Card className="pt-6" elevation={3}>
      <Formik
        initialValues={syllabus}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
          setSubmitting(false);
        }}
      >
        {({
          isSubmitting,
        }) => (
          <Form className="p-4">
            <Grid container spacing={3} alignItems="center">
              <Field
                type="text"
                name="Slug"
                placeholder="full-stack-pt"
                required
              />
              <Field
                type="text"
                name="Name"
                placeholder="Full Stack PT"
                required
              />
              <Field
                type="number"
                label="Total hours"
                name="duration_in_hours"
                placeholder="12345"
                required
              />
              <Field
                type="number"
                label="Weekly hours"
                name="week_hours"
                placeholder="12345"
                required
              />
              <Field
                type="number"
                label="Total Days"
                name="duration_in_days"
                placeholder="12345"
                required
              />
              <Field
                type="text"
                label="Github URL"
                name="github_url"
                placeholder="https://github.com/user/repo"
              />
              <Field
                type="text"
                name="logo"
                placeholder="https://storage.googleapis.com/bucket/filename"
              />
              <div className="flex-column items-start px-4 mb-4">
                <Button color="primary" variant="contained" type="submit" data-cy="submit" disabled={isSubmitting}>
                  Save Syllabus Details
                </Button>
              </div>
            </Grid>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

StudentDetails.propTypes = propTypes;

export default StudentDetails;
