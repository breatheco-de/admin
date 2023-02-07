import React, { useState, useEffect } from 'react';
import { Button, Card, Grid, Icon, IconButton, TextField } from '@material-ui/core';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Formik, Form } from 'formik';
import { Alert, AlertTitle } from '@material-ui/lab';
import * as Yup from 'yup';
// import axios from 'axios';
// import * as yup from 'yup';
import PropTypes from 'prop-types';
import Field from '../../../components/Field';
import { schemas } from '../../../utils';
import { getSession } from '../../../redux/actions/SessionActions';


const eventypePropTypes = {
  id: PropTypes.number,
  slug: PropTypes.string,
  name: PropTypes.string,
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



const JoinEvents = ({ eventype, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const session = getSession();
  const academyOwner = session.academy.id;
  const eventypeAcademyId = eventype.academy.id;
  const eventTypeVisbility = eventype.visibility_settings

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (

    <Card elevation={3}>

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

        {eventypeAcademyId == academyOwner ? (
          <>
            <h1 className="ml-2 mt-2 mb-4 font-medium text-28">Who can join these events?</h1>
            <Grid className="p-4" container spacing={1} alignItems="center">
              <div className="overflow-auto">
                {isLoading && <MatxLoading />}
                <div className="min-w-600">
                  {eventTypeVisbility.length > 0
                    ? eventTypeVisbility.map((s, i) => (
                      ({ values, setFieldValue, handleChange }) => (
                        <div>
                          <Grid item lg={6} md={6} sm={6} xs={6}>

                            {visibility_settings.academy !== '' ? (
                              <TextField
                                size="small"
                                data-cy="academy"
                                fullWidth
                                variant="outlined"
                                value={values.visibility_settings.academy}
                              >
                                Everyone at the academy {value}.
                              </TextField>
                            ) : ('')}

                            {visibility_settings.syllabus !== '' ? (
                              <TextField
                                size="small"
                                data-cy="syllabus"
                                fullWidth
                                variant="outlined"
                                value={values.visibility_settings.syllabus}
                              >
                                Only students from {eventype.academy} with access to {value} syllabus.
                              </TextField>
                            ) : ('')}

                            {visibility_settings.cohort !== '' ? (
                              <TextField
                                size="small"
                                data-cy="cohort"
                                fullWidth
                                variant="outlined"
                                value={values.visibility_settings.cohort}
                              >
                                Only students from {eventype.academy} with access to {eventTypeVisbility.syllabus} syllabus from cohorts {value}
                              </TextField>
                            ) : ('')}


                            <IconButton onClick={handleOpen}>
                              <Icon fontSize="small">
                                add_circle
                              </Icon>
                            </IconButton>
                            <Modal
                              open={open}
                              onClose={handleClose}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <Box sx={style}>
                                <Form className="p-4">
                                  <Grid item md={7} sm={8} xs={12}>
                                    <TextField
                                      label="Select Academy"
                                      size="small"
                                      data-cy="academy"
                                      fullWidth
                                      variant="outlined"
                                      value={values.visibility_settings.academy}
                                      onChange={(e) => {
                                        setFieldValue('academy', e.target.value);
                                      }}
                                      select
                                    >
                                      {['', eventTypeVisbility.academy].map((item) => (
                                        <MenuItem value={item} key={item}>
                                          {item.toUpperCase()}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                    <TextField
                                      label="Select Cohort"
                                      size="small"
                                      data-cy="cohort"
                                      fullWidth
                                      variant="outlined"
                                      value={values.visibility_settings.cohort}
                                      onChange={(e) => {
                                        setFieldValue('cohort', e.target.value);
                                      }}
                                      select
                                    >
                                      {['', eventTypeVisbility.cohort].map((item) => (
                                        <MenuItem value={item} key={item}>
                                          {item.toUpperCase()}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                    <TextField
                                      label="Select Syllabus"
                                      size="small"
                                      data-cy="syllabus"
                                      fullWidth
                                      variant="outlined"
                                      value={values.visibility_settings.syllabus}
                                      onChange={(e) => {
                                        setFieldValue('syllabus', e.target.value);
                                      }}
                                      select
                                    >
                                      {['', eventTypeVisbility.syllabus].map((item) => (
                                        <MenuItem value={item} key={item}>
                                          {item.toUpperCase()}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </Grid>
                                </Form>
                              </Box>
                            </Modal>
                          </Grid>
                        </div>
                      ))) : (
                        <div><h5>There are no shared settings</h5></div>
                        )}
                </div>
              </div>
            </Grid>
          </>
        ) : (
          <>
            <h3>There are no shared settings</h3></>
        )}
      </Formik>

    </Card>
  )
};

JoinEvents.propTypes = propTypes;

export default JoinEvents;
