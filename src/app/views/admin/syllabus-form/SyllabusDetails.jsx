import React, { useState, useEffect } from 'react';
import { Button, Card, Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import { Alert, AlertTitle } from '@material-ui/lab';
import * as Yup from 'yup';
// import axios from 'axios';
// import * as yup from 'yup';
import PropTypes from 'prop-types';
import bc from '../../../services/breathecode';
import Field from '../../../components/Field';
import { schemas } from '../../../utils';
import { getSession } from '../../../redux/actions/SessionActions';


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
  // schedule: yup.number().required().positive().integer(),
  slug: schemas.slug(),
  name: schemas.name(),
  duration_in_hours: schemas.nonZeroPositiveNumber('Total hours'),
  week_hours: schemas.nonZeroPositiveNumber('Weekly hours'),
  duration_in_days: schemas.nonZeroPositiveNumber('Total days'),
  github_url: Yup.string()
    .url('Invalid github url')
    .nullable(true)
    .test(
      'invalid-github-url',
      'URL must start with https://github.com',
      (value) => /^(https?:\/\/github\.com\/)?/i.test(value)
    ),
  logo: Yup.string().url('Invalid logo url').nullable(true),
  // schedule_type: Yup.mixed().oneOf(scheduleTypes).required(),
});



const StudentDetails = ({ syllabus, onSubmit }) => {
  const [status, setStatus] = useState({ color: "", message: "" });

  const session = getSession();
  const academyOwner = session.academy.id
  const syllabusId = syllabus.academy_owner.id


  useEffect(() => {
    if (syllabusId !== academyOwner) {
      setStatus({ color: "warning", message: `This syllabus is owned by another academy, you can not make changes to its basic information.` });
    } else {
      "";
    }
  }, [academyOwner]);

  return (

    <Card elevation={3}>
      {syllabusId !== academyOwner && (<Alert severity={status.color}>

        <AlertTitle>{syllabusPropTypes.id !== academyOwner
          ? (<>{status.message}</>)
          : ""}
        </AlertTitle>
      </Alert>)}

      {syllabus.private && (
        <Grid item md={12} sm={12} xs={12}>
          <Alert severity="warning">
            <AlertTitle className="m-auto" cy-data="syllabus-private-alert">
              This syllabus is private
            </AlertTitle>
          </Alert>
        </Grid>
      )}


      <Formik
        initialValues={syllabus}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
          setSubmitting(false);
        }}
      >

        {syllabusId !== academyOwner ? (
          <Grid className="p-4" container spacing={1} alignItems="center">
            <Field
              type="text"
              name="Slug"
              placeholder="full-stack-pt"
              disabled
            />
            <Field
              type="text"
              name="Name"
              placeholder="Full Stack PT"
              disabled
            />
            <Field
              type="number"
              label="Total hours"
              name="duration_in_hours"
              placeholder="12345"
              disabled
            />
          </Grid>
        ) : (
          ({ isSubmitting }) => (
            <Form className="p-4">
              <Grid container spacing={3} alignItems="center">
                <Field
                  type="text"
                  name="Slug"
                  placeholder="full-stack-pt"
                  disabled
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
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    data-cy="submit"
                    disabled={isSubmitting}
                  >
                    Save Syllabus Details
                  </Button>
                </div>
              </Grid>
            </Form>
          ))}
      </Formik>
    </Card>
  )
};

StudentDetails.propTypes = propTypes;

export default StudentDetails;
