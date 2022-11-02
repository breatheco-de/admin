import {
  Avatar,
  Button,
  Card, Dialog, DialogTitle, Divider, Grid, List,
  ListItem,
  ListItemText, MenuItem, TextField,
  TextareaAutosize,
  FormControlLabel, Checkbox
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import dayjs, { duration } from 'dayjs';

import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import bc from '../../../services/breathecode';
import { minToHHMMSS } from '../../../utils/minToHHMMSS'
import { secToMin } from '../../../utils/secToMin'

const propTypes = {
  project: PropTypes.object.isRequired,
  projectID: PropTypes.string.isRequired,
};

dayjs.extend(duration);


const ProjectDetails = ({ project, onSubmit }) => {
  
  const [singleProject, setSingleProject] = useState(project);
  const initialValues = {
    id: singleProject?.id || "",
    title: singleProject?.title || "",
    created_at: singleProject?.created_at || "",
    repository: singleProject?.repository || "",
    total_client_hourly_price: singleProject?.total_client_hourly_price || 0,
  };

  return (
    <Card className="pt-6" elevation={3}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => onSubmit(values)}
        enableReinitialize
      >
        {({
          values, handleChange, handleSubmit, setFieldValue,
        }) => (
          <form className="p-4" onSubmit={handleSubmit}>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  className="m-0"
                  label="Project Title"
                  name="name"
                  data-cy="name"
                  size="small"
                  variant="outlined"
                  value={values.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className='m-0'
                  label="Default Hourly Price"
                  name="total_client_hourly_price"
                  size="small"
                  type="number"
                  required
                  variant="outlined"
                  value={values.total_client_hourly_price}
                  onChange={handleChange}
                  helperText="This is a base default value, you can specify per project member"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className='m-0'
                  label="Repository"
                  name="repository"
                  size="small"
                  type="url"
                  required
                  helperText={`Github URL whre the issues will be stored`}
                  variant="outlined"
                  value={values.repository}
                  onChange={handleChange}
                />
              </Grid>

              <div className="flex-column items-start px-4 mb-4">
                <Button color="primary" variant="contained" type="submit">
                  Update Project Details
                </Button>
              </div>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
};

ProjectDetails.propTypes = propTypes;

export default ProjectDetails;
