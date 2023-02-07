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
  // schedule_type: Yup.mixed().oneOf(scheduleTypes).required(),
});

const NewSyllabus = () => {
  const history = useHistory();

  const addEventType = async (values, { setSubmitting }) => {
    try {
      const response = await bc.events().addAcademyEventType(values);
      if (response.status === 201) {
        setSubmitting(false);
        history.push('/events/academy/eventype');
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
            { name: 'Events', path: '/events' },
            { name: 'Event Type', path: '/events/eventtype' },
            { name: 'New Event Type' },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Event Type</h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={{}}
          validationSchema={schema}
          onSubmit={addEventType}
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
                  type="text"
                  label="Description"
                  name="description"
                  placeholder="12345"
                  required
                />
                <Field
                  type="checkbox"
                  label="Allow Shared Creation"
                  name="allow_shared"
                  placeholder="true"
                  required
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
