import React from 'react';
import {
  Grid,
  Card,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import bc from '../../../services/breathecode';
import Field from '../../../components/Field';
import { Breadcrumb } from '../../../../matx';
import { schemas } from '../../../utils';
import { getSession } from '../../../redux/actions/SessionActions';

const schema = Yup.object().shape({
  // academy: yup.number().required().positive().integer(),
  // schedule: yup.number().required().positive().integer(),
  slug: schemas.slug(),
  name: schemas.name(),
  // schedule_type: Yup.mixed().oneOf(scheduleTypes).required(),
});

const NewEventype = () => {
  const history = useHistory();
  const session = getSession();

  const addEventType = async (values, { setSubmitting }) => {
    try {
      const response = await bc.events().addAcademyEventType({...values, academy: session.academy.id});
      console.log(session.academy)
      if (response.status === 201) {
        setSubmitting(false);
        history.push('/events/eventype');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb routeSegments={[
          { name: 'Event List', path: '/events/list' },
          { name: 'Event Types', path: '/events/eventype' },
          { name: 'Add Event Type' }]}
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
            values, setFieldValue, isSubmitting, handleChange
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
                  type="text"
                  label="Description"
                  name="description"
                  placeholder="This is a description"
                  required
                />
                <Grid item md={5} sm={4} xs={12}>
                  Language
                </Grid>
                <Grid item md={7} sm={8} xs={12}>
                  <TextField
                    label="Language"
                    data-cy="lang"
                    size="small"
                    fullWidth
                    variant="outlined"
                    value={values.lang}
                    onChange={(e) => {
                      setFieldValue('lang', e.target.value);
                    }}
                    select
                  >
                    {['','es', 'en'].map((item) => (
                      <MenuItem value={item} key={item}>
                        {item.toUpperCase()}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="text-right"
                        checked={values.shared}
                        onChange={handleChange}
                        name="shared_creation"
                        data-cy="shared_creation"
                        color="primary"
                      />
                    }
                    label="Allow Shared Creation"
                  />
                </Grid>
                <div className="flex-column items-start px-4 mb-4">
                  <Button color="primary" variant="contained" type="submit" data-cy="submit" disabled={isSubmitting}>
                    Create
                  </Button>
                </div>
              </Grid>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default NewEventype;
