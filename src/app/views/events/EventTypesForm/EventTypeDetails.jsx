import React, { useState, useEffect } from 'react';
import { Button, Card, Grid, TextField, MenuItem, Checkbox, FormControlLabel } from '@material-ui/core';
import { Formik, Form } from 'formik';
import { Alert, AlertTitle } from '@material-ui/lab';
import * as Yup from 'yup';
// import axios from 'axios';
// import * as yup from 'yup';
import PropTypes from 'prop-types';
import Field from '../../../components/Field';
import { schemas } from '../../../utils';
import { getSession } from '../../../redux/actions/SessionActions';
import { availableLanguages } from 'utils';


const eventypePropTypes = {
  id: PropTypes.number,
  slug: PropTypes.string,
  name: PropTypes.string,
  language: PropTypes.string,
  onSubmit: PropTypes.func,
  academy_owner: PropTypes.number,
};

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  eventype: PropTypes.shape(eventypePropTypes).isRequired,
};

const schema = Yup.object().shape({
  // academy: yup.number().required().positive().integer(),
  // schedule: yup.number().required().positive().integer(),
  slug: schemas.slug(),
  name: schemas.name(),
});


const EventTypeDetails = ({ eventype, onSubmit }) => {
  console.log('this is eventype', eventype)
  const [status, setStatus] = useState({ color: "", message: "" });
  const session = getSession();
  const academyOwner = session.academy.id;
  const sessionAcademy = session.academy.slug;
  const eventypeAcademy = eventype.academy.slug;
  const eventypeAcademyId = eventype.academy.id;
  const [checked, setChecked] = useState(false);

  useEffect(() => {

    if (eventypeAcademyId !== academyOwner) {
      setStatus({ color: "warning", message: `This Event Type is owned by another academy, you can not make changes to its basic information.` });
    } else {
      "";
    }
  }, [academyOwner]);

  return (

    <Card elevation={3}>
      {eventypeAcademyId !== academyOwner && (<Alert severity={status.color}>

        <AlertTitle>{eventypePropTypes.id !== academyOwner
          ? (<>{status.message}</>)
          : ""}
        </AlertTitle>
      </Alert>)}

      {eventype.private && (
        <Grid item md={12} sm={12} xs={12}>
          <Alert severity="warning">
            <AlertTitle className="m-auto" cy-data="eventype-private-alert">
              This event type is private
            </AlertTitle>
          </Alert>
        </Grid>
      )}


      <Formik
        initialValues={eventype}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
          setSubmitting(false);
        }}
      >

        {eventypeAcademyId !== academyOwner ? (
          <Grid className="p-4" container spacing={1} alignItems="center">
            <Field
              type="text"
              name="Name"
              placeholder="Full Stack PT"
              disabled
            />
            <Field
              type="text"
              name="Slug"
              placeholder="full-stack-pt"
              disabled
            />
            <Field
              type="text"
              name="Description"
              placeholder="Description"
              disabled
            />
          </Grid>
        ) : (
          ({ values, isSubmitting, setFieldValue, handleChange }) => (
            <Form className="p-4">
              <Grid container spacing={3} alignItems="center">
                <Field
                  type="text"
                  name="Name"
                  placeholder="Full Stack PT"
                  required
                />
                <Field
                  type="text"
                  name="Slug"
                  placeholder="full-stack-pt"
                  disabled
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
                        {item?.toUpperCase()}
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
                <div className="flex-column items-start px-4 mb-4">
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    data-cy="submit"
                    disabled={isSubmitting}
                  >
                    Save Event type Details
                  </Button>
                </div>
              </Grid>
            </Form>
          ))}
      </Formik>
    </Card>
  )
};

EventTypeDetails.propTypes = propTypes;

export default EventTypeDetails;
