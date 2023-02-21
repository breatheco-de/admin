import React, { useState, useEffect } from 'react';
import { Button, Card, Grid, Icon, IconButton, TextField, List, ListItem, Dialog, DialogTitle, DialogActions, ListItemText } from '@material-ui/core';
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
  visibility_settings: PropTypes.string,
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

const getVisibilitySettingMessage = (visibility) => {
  if (visibility && visibility?.academy && visibility?.syllabus) {
    if (visibility.cohort) return <>Everyone at <strong>{visibility.academy.name}</strong> with access to <strong>{visibility.syllabus.name}</strong> syllabus, from cohort <strong>{visibility.cohort.name}</strong></>
    else return <>Everyone at <strong>{visibility.academy.name}</strong> with access to <strong>{visibility.syllabus.name}</strong> syllabus</>
  } else if (visibility.cohort) return <>Everyone at <strong>{visibility.academy.name}</strong> from cohort <strong>{visibility.cohort.name}</strong></>
  else return <>Everyone at <strong>{visibility.academy.name}</strong></>
}

const JoinEvents = ({ eventype, onSubmit, openDialogDeleteVisibility, setOpenDialogDeleteVisibility, setVisibilitySetting }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [chooseCohort, setChooseCohort] = useState(null);
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
    <>
      <h1 className="ml-2 mt-2 mb-4 font-medium text-28">Who can join these events?</h1>
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
          initialValues={{ eventype }}
          validationSchema={schema}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting, handleSubmit, setFieldValue }) => (
            <Modal open={open} onClose={handleClose}>
              <form className="p-4" onSubmit={handleSubmit}>

                <Box sx={style}>
                  <Form className="p-4">
                    <Grid item md={12} sm={12} xs={12}>

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
                            
                            getOptionLabel={(option) => `${option.name}`}
                            value={syllabus}
                          />
                        </div>
                      </Grid>
                      <Grid item md={2} sm={4} xs={12}>
                        Cohort
                      </Grid>
                      <Grid item md={12} sm={12} xs={12}>
                        <div className="flex flex-wrap">
                          <AsyncAutocomplete
                            debounced={false}
                            onChange={(x) => setChooseCohort(x)}
                            width="100%"
                            className="m-4"
                            asyncSearch={() => bc.admissions().getAllCohorts()}
                            size="small"
                            data-cy="cohort"
                            label="cohort"
                            
                            getOptionLabel={(option) => `${option.name}`}
                            value={chooseCohort}
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <div className="flex-column items-start px-4 mb-4">
                      <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        data-cy="submit"
                        disabled={isSubmitting}>
                        Share
                      </Button>
                    </div>
                  </Form>
                </Box>
              </form>

            </Modal>
          )}
        </Formik>


        <Grid className="p-4" container spacing={1} alignItems="center">
          <div className="overflow-auto">

            {isLoading && <MatxLoading />}

            <div className="min-w-600">
              <>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div>
                    <List>
                      <Grid className='m-2' item md={12} sm={12} xs={12}>
                        {eventype && eventype.visibility_settings && eventype.visibility_settings.length > 0 ? eventype.visibility_settings.map((visibility, i) => (
                          <ListItem>
                            <Grid key={i} className='m-1' item lg={10} md={10} sm={10} xs={10}>
                              {getVisibilitySettingMessage(visibility)}
                            </Grid>
{/*   
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                                      
                              <IconButton
                                onClick={() => {
                                  setVisibilitySetting(visibility);
                                  setOpenDialogDeleteVisibility(true);
                                }}
                              >

                                <Icon fontSize="small">delete</Icon>
                              </IconButton>

                            </Grid>
                          */}
                          </ListItem>
                        )) : (
                          <>
                            <div><h5>There are no shared settings</h5></div>
                          </>
                        )}
                        
{/*     
                        <IconButton onClick={() => {
                          handleOpen()
                        }}>
                          <Icon fontSize="small">
                            add_circle
                          </Icon>
                        </IconButton>
                      */}  

                      </Grid>
                    </List>
                  </div>
                </Grid>
              </>
            </div>

          </div>
        </Grid >
      </Card >
    </>
  )
};

JoinEvents.propTypes = propTypes;

export default JoinEvents;
