import React, { useState } from 'react';
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
import { Breadcrumb } from '../../../../matx';
import { schemas } from '../../../utils';
import { getSession } from '../../../redux/actions/SessionActions';
import { availableLanguages } from 'utils';
import ThumbnailCard from './ThumbnailCard';

const slugify = require('slugify');

const schema = Yup.object().shape({
  name: schemas.name(),
});

const NewEventype = () => {
  const history = useHistory();
  const session = getSession();
  const [name, setName] = useState('')

  const addEventType = async (values, { setSubmitting }) => {
    try {
      const response = await bc.events().addAcademyEventType({ ...values, academy: session.academy.id });
      console.log("this is Values", values)
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
          initialValues={{name: '', slug: ''}}
          validationSchema={schema}
          onSubmit={addEventType}
        >
          {({
            values, setFieldValue, isSubmitting, handleSubmit, errors,
            touched, handleChange
          }) => (
            <form onSubmit={handleSubmit} className="p-4">
              <Grid container spacing={3} alignItems="center">
                <Grid item md={5} sm={4} xs={12}>
                  Name
                </Grid>
                <Grid item md={7} sm={8} xs={12}>
                  <TextField
                    aria-label="Javascript Beginner"
                    minRows={1}
                    placeholder="Javascript Beginner"
                    label="Javascript Beginner"
                    multiline
                    fullWidth
                    name="name"
                    type="text"
                    variant="outlined"
                    error={errors.name && touched.name}
                    helperText={touched.name && errors.name}
                    // onChange={e => setName(e.target.value)}
                    required
                    value={values.name}
                    onChange={(e) => {values.slug = slugify(e.target.value).toLowerCase(); handleChange(e)}}
                  />
                </Grid>

                <Grid item md={5} sm={4} xs={12}>
                  Slug
                </Grid>
                <Grid item md={7} sm={8} xs={12}>
                  <TextField
                    aria-label="javascript-beginner"
                    minRows={1}
                    placeholder="javascript-beginner"
                    label="javascript-beginner"
                    multiline
                    fullWidth
                    name="slug"
                    type="text"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.slug}
                    required
                  />
                </Grid>
                <Grid item md={5} sm={4} xs={12}>
                  Description
                </Grid>
                <Grid item md={7} sm={8} xs={12}>
                  <TextField
                    aria-label="description"
                    minRows={5}
                    placeholder="Description"
                    label="Description"
                    multiline
                    fullWidth
                    name="description"
                    type="text"
                    variant="outlined"
                    onChange={e => setFieldValue('description', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item md={5} sm={4} xs={12}>
                  Icon URL
                </Grid>
                <Grid item md={7} sm={8} xs={12}>
                  <ThumbnailCard eventype={null} onChange={url => setFieldValue('icon_url', url)}></ThumbnailCard>
                </Grid>

                <Grid item md={5} sm={4} xs={12}>
                  Language
                </Grid>
                <Grid item md={7} sm={8} xs={12}>
                  <TextField
                    label="Language"
                    type="text"
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
                    {Object.keys(availableLanguages).map((item) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}

                  </TextField>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="text-right"
                        checked={values.allow_shared_creation}
                        onChange={(e) => {
                          setFieldValue('allow_shared_creation', e.target.checked);
                        }}
                        name="shared_creation"
                        data-cy="shared_creation"
                        color="primary"
                      />
                    }
                    label="Allow Shared Creation"
                  />
                </Grid>
              </Grid>
              <div className="flex-column items-start px-4 mb-4">
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  data-cy="submit"
                  disabled={isSubmitting}>
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

export default NewEventype;
