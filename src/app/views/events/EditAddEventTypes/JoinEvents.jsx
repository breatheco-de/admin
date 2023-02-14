import React, { useState, useEffect } from 'react';
import { Button, Card, Grid, Icon, IconButton, TextField, List, ListItem, ListItemText } from '@material-ui/core';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { AsyncAutocomplete } from "../../../components/Autocomplete";
import { Formik, Form } from 'formik';
import { Alert, AlertTitle } from '@material-ui/lab';
import * as Yup from 'yup';
// import axios from 'axios';
// import * as yup from 'yup';
import PropTypes from 'prop-types';
import Field from '../../../components/Field';
import { schemas } from '../../../utils';
import bc from "../../../services/breathecode";
import { getSession } from '../../../redux/actions/SessionActions';


const eventypePropTypes = {
  id: PropTypes.number,
  slug: PropTypes.string,
  name: PropTypes.string,
  academy_owner: PropTypes.number,
};

const schema = Yup.object().shape({
  // academy: yup.number().required().positive().integer(),
  // schedule: yup.number().required().positive().integer(),
  slug: schemas.slug(),
  name: schemas.name(),
});


const propTypes = {
  onSubmit: PropTypes.func.isRequired,
  eventype: PropTypes.shape(eventypePropTypes).isRequired,
};


const JoinEvents = ({ eventype, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const eventTypeVisbility = eventype.visibility_settings[0]
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [syllabus, setSyllabus] = useState(null);

  const [open, setOpen] = React.useState(false);

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


      <h1 className="ml-2 mt-2 mb-4 font-medium text-28">Who can join these events?</h1>

      <Grid className="p-4" container spacing={1} alignItems="center">
        <div className="overflow-auto">

          {isLoading && <MatxLoading />}

          <div className="min-w-600">
            <>
              {eventTypeVisbility != null ? eventype.visibility_settings.map((visibility, i) => (
                <Grid key={i} item lg={12} md={12} sm={12} xs={12}>
                  <div>
                    <Grid className='m-2' item md={12} sm={12} xs={12}>
                      <List>
                        <ListItem>
                        <div className='m-2'>
                          {!visibility?.academy ? '' : `Everyone at the academy ${visibility?.academy.name}`}
                        </div>
                        </ListItem>
                        <ListItem>
                          <div className='m-2'>
                          {!visibility?.academy
                            || !visibility?.syllabus ? ''
                            : `Only students from ${visibility.academy.name} with access to ${visibility.syllabus.name} syllabus.`}
                            </div>
                        </ListItem>

                        <ListItem>
                          <div className='m-2'>
                          {!visibility?.academy
                            || !visibility?.syllabus
                            || visibility?.cohort
                            ? '' : `From cohort ${visibility?.cohort.name}`}
                            </div>
                        </ListItem>
                      </List>

                    </Grid>

                    <Formik
                      initialValues={{ eventype }}
                      validationSchema={schema}
                      onSubmit={(values, { setSubmitting }) => {
                        onSubmit(values);
                        setSubmitting(false);
                      }}
                    >
                      <Grid item xs={12} md={6}>


                        <IconButton onClick={() => {
                          handleOpen()
                        }}>
                          <Icon fontSize="small">
                            add_circle
                          </Icon>
                        </IconButton>
                        {({ values, isSubmitting, handleChange, handleSubmit, setFieldValue }) => (
                          <Modal open={open} onClose={handleClose}>
                            <form className="p-4" onSubmit={handleSubmit}>

                              <Box sx={style}>
                                <Form className="p-4">
                                  <Grid item md={7} sm={8} xs={12}>

                                    <Grid item md={2} sm={4} xs={12}>
                                      Syllabus
                                    </Grid>

                                    <Grid item md={12} sm={12} xs={12}>
                                      <div className="flex flex-wrap">
                                        <AsyncAutocomplete
                                          debounced={false}
                                          onChange={(x) => setSyllabus(x)}
                                          width="100%"
                                          className="m-4"
                                          asyncSearch={() => bc.admissions().getAllSyllabus()}
                                          size="small"
                                          data-cy="syllabus"
                                          label="syllabus"
                                          required
                                          getOptionLabel={(option) => `${option.name}`}
                                          value={syllabus}
                                        />
                                        {syllabus ? (
                                          <AsyncAutocomplete
                                            className="m-4"
                                            debounced={false}
                                            onChange={(v) => setVersion(v)}
                                            width="30%"
                                            key={syllabus.slug}
                                            asyncSearch={() =>
                                              bc.admissions().getAllCourseSyllabus(syllabus.slug)
                                            }
                                            size="small"
                                            data-cy="version"
                                            label="Version"
                                            required
                                            getOptionLabel={(option) =>
                                              option.status === "PUBLISHED"
                                                ? `${option.version}`
                                                : "⚠️ " +
                                                option.version +
                                                " (" +
                                                option.status +
                                                ")"
                                            }
                                            value={version}
                                          />
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                      Cohort
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
                                </Form>
                              </Box>
                            </form>

                          </Modal>
                        )}
                      </Grid>
                    </Formik>
                  </div>
                </Grid>
              )) : (
                <div><h5>There are no shared settings</h5></div>
              )}
            </>
          </div>

        </div>
      </Grid >
    </Card >
  )
};

JoinEvents.propTypes = propTypes;

export default JoinEvents;
