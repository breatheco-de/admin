import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import {
  Grid,
  Icon,
  Select,
  DialogTitle,
  Dialog,
  Button,
  TextField,
  Card,
  Divider,
  Checkbox,
  FormControlLabel,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import bc from '../../../services/breathecode';
import { getToken, getSession } from '../../../redux/actions/SessionActions';
import { MatxLoading } from '../../../../matx';
import { Breadcrumb } from 'matx';
import PropTypes from 'prop-types';
import DowndownMenu from '../../../components/DropdownMenu';


toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const useStyles = makeStyles(() => ({
  dialogue: {
    color: 'rgba(52, 49, 76, 1)',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
  },
  select: {
    width: '15rem',
  },
}));




  const propTypes = {
    slug: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    // hits: PropTypes.number.isRequired,
    author: PropTypes.number.isRequired,
    utm_campaign: PropTypes.string.isRequired,
    utm_medium: PropTypes.string.isRequired,
    utm_content: PropTypes.string.isRequired,
    utm_source: PropTypes.string.isRequired,
  };

const Short = ({
  slug,
  destination,
  isPrivate,
  // hits,
  author,
  utm_campaign,
  utm_medium,
  utm_content,
  utm_source,
}) => {
          const { academy } = JSON.parse(localStorage.getItem('bc-session'));
          const history = useHistory();
        return (
          <div className="m-sm-30">
            <div className="mb-sm-30">
              <Breadcrumb
                routeSegments={[
                  { name: 'Growth', path: '/Growth' },
                  { name: 'URL Shortner', path: '/growth/urls' },
                  { name: 'Edit Short Link', path: '/growth/handleChange' },
                ]}
              />
            </div>

            <Card elevation={3}>
              <div className="flex p-4">
                <h4 className="m-0">Edit Short Link</h4>
              </div>
              <Divider className="mb-2" />

              <Formik
                initialValues={{
                  slug,
                  destination,
                  isPrivate,
                  // hits,
                  author,
                  utm_campaign,
                  utm_medium,
                  utm_content,
                  utm_source,
                }}
                // validationSchema={ProfileSchema}
                onSubmit={(values) => { 
                  if (values) {
                    bc.marketing()
                    .updateShort(values)
                    .then((data) => {
                      if (data.status === 201) {
                        history.push('/growth/urls')
                        console.log("This is the new short###", data)
                        
                      }
                    }) 
                    
                  }
                  
                  
                }}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  setSubmitting,
                  setFieldValue,
                }) => (
                 
                  <form className="p-4" onSubmit={handleSubmit} >
                    <Grid container spacing={3} alignItems="center" >
                      <Grid item md={2} sm={4} xs={12} className="font-weight-bold">
                        Slug
                      </Grid>
                      <Grid item md={10} sm={8} xs={12}>
                        <TextField
                          label="Slug"
                          name="slug"
                          size="small"
                          variant="outlined"
                          disabled
                          value={values.slug}
                          // defaultValue={values.slug}
                          // onChange={handleChange}
                        />
                      </Grid>
                    
                      <Grid item md={2} sm={4} xs={12}>
                        Destination
                      </Grid>
                      <Grid item md={10} sm={8} xs={12}>
                        <TextField
                          label="Destination"
                          name="destination"
                          size="small"
                          variant="outlined"
                          defaultValue={values.destination}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item md={2} sm={4} xs={12} >
                        Private
                      </Grid>
                      <Grid item md={10} sm={8} xs={12}>
                        <FormControlLabel
                            control={(
                              <Checkbox
                                checked={true}
                                onChange={handleChange}
                                name="Private"
                                data-cy="private"
                                color="primary"
                                className="text-left"
                              />
                            )}
                            label="Other academies will see and use private urls."
                          />
                      </Grid>
                      <Grid item md={2} sm={4} xs={12}>
                        Utm campaign
                      </Grid>
                      <Grid item md={10} sm={8} xs={12}>
                        <TextField
                          label="Utm campaign"
                          name="utm_campaign"
                          size="small"
                          variant="outlined"
                          defaultValue={values.utm_campaign}
                          onChange={handleChange}
                        />
                      </Grid>
                      
                      <Grid item md={2} sm={4} xs={12}>
                        Utm medium
                      </Grid>
                      <Grid item md={10} sm={8} xs={12}>
                        <TextField
                          label="Utm medium"
                          name="utm_medium"
                          size="small"
                          variant="outlined"
                          defaultValue={values.utm_medium}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item md={2} sm={4} xs={12}>
                        Utm content
                      </Grid>
                      <Grid item md={10} sm={8} xs={12}>
                        <TextField
                          label="Utm content"
                          name="utm_content"
                          size="small"
                          variant="outlined"
                          defaultValue={values.utm_content}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item md={2} sm={4} xs={12}>
                        Utm source
                      </Grid>
                      <Grid item md={10} sm={8} xs={12}>
                        <TextField
                          label="Utm source"
                          name="utm_source"
                          size="small"
                          variant="outlined"
                          defaultValue={values.utm_source}
                          onChange={handleChange}
                        />
                      </Grid>
                      
                    </Grid>
                    <div className="mt-6">
                      <Button color="primary" variant="contained" type="submit" >
                        Save Changes
                      </Button>
                      
                    </div>
                  </form>
                )}
              </Formik>
            </Card>
          </div>
        );
};

Short.propTypes = propTypes;
export default Short;
