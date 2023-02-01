import React from 'react';
import { Formik } from 'formik';
import {
  Grid,
  Card,
  Divider,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import bc from '../../../services/breathecode';
import Field from '../../../components/Field';
import { Breadcrumb } from '../../../../matx';
import { schemas } from '../../../utils';

const schema = Yup.object().shape({
  // academy: yup.number().required().positive().integer(),
  // schedule: yup.number().required().positive().integer(),
  slug: schemas.slug(),
  name: schemas.name(),
  duration_in_hours: schemas.nonZeroPositiveNumber('Total hours'),
  week_hours: schemas.nonZeroPositiveNumber('Weekly hours'),
  duration_in_days: schemas.nonZeroPositiveNumber('Total days'),
  github_url: Yup.string().url('Invalid github url')
    .nullable()
    .notRequired()
    .test(
      'invalid-github-url',
      'Invalid github url',
      (value) => value === null || value === undefined || /^https?:\/\/github\.com\//i.test(value),
    ),
  logo: Yup.string()
    .nullable()
    .notRequired()
    .url('Invalid logo url'),
  // schedule_type: Yup.mixed().oneOf(scheduleTypes).required(),
});

const NewSyllabus = () => {
  const history = useHistory();

  const addSyllabus = async (values, { setSubmitting }) => {
    try {
      const response = await bc.admissions().addSyllabus(values);
      if (response.status === 201) {
        setSubmitting(false);
        history.push('/admin/syllabus');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: 'Admin', path: '/admin' },
            { name: 'Cohort', path: '/admin/syllabus' },
            { name: 'New Syllabus' },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Syllabus</h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={{}}
          validationSchema={schema}
          onSubmit={addSyllabus}
        >
          {({
            handleSubmit, isSubmitting,
          }) => (
            <form className="p-4" onSubmit={handleSubmit}>
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
              </Grid>
              <div className="flex-column items-start px-4 mb-4">
                <Button color="primary" variant="contained" type="submit" data-cy="submit" disabled={isSubmitting}>
                  Create
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default NewSyllabus;
