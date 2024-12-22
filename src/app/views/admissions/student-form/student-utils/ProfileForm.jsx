import React, { useState } from 'react';
import { Formik } from 'formik';
import { Grid, TextField, Button, Divider } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import bc from '../../../../services/breathecode';
import axios from '../../../../../axios';
import { AsyncAutocomplete } from '../../../../components/Autocomplete';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import config from '../../../../../config.js';
import { Alert, AlertTitle } from '@material-ui/lab';

const propTypes = {
  initialValues: PropTypes.objectOf(PropTypes.object).isRequired,
};

export const ProfileForm = ({ initialValues }) => {
  console.log("initialValues", initialValues)
  const [cohort, setCohort] = useState([]);
  const history = useHistory();
  const [availableAsSaas, setAvailableAsSaas] = useState(false)
  const [selectedPlans, setSelectedPlans] = useState(null)

  const postAcademyStudentProfile = (values) => {
    if (typeof (values.invite) === 'undefined' || !values.invite) values.user = values.id;
    let cohortId = cohort.map(c => {
      return c.id 
    });
    
    let requestValues = { ...values, 
      cohort: cohort.length > 0 ? cohortId : undefined 
    };
    if (typeof (requestValues.invite) === 'undefined' || !requestValues.invite) requestValues.user = requestValues.id;

    if (values.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/) === null) {
      console.error("The email entered has formatting errors (insert a valid email address)")
      toast.error("The email entered has formatting errors (insert a valid email address)")
    }
    else if (values.phone.match(/[^\d]/g)) {
      console.error("The number entered has formatting errors (insert only numbers)")
      toast.error("The number entered has formatting errors (insert only numbers)")
    }
    else if (values.phone.length > 15 || values.phone.length < 10 ) {
      console.error("The number entered has formatting errors (insert more than 10 and less than 15)")
      toast.error("The number entered has formatting errors (insert more than 10 and less than 15)")
    }
    else {
      bc.auth()
      .addAcademyStudent(requestValues)
      .then((data) => {
        console.log("addAcademyStudent", data, data.ok)
        if (data !== undefined && data.ok) {
          if (availableAsSaas && selectedPlans) {
            const planSlug = selectedPlans[0]?.slug
            const payload ={
              provided_payment_details: "Added on admin",
              reference: "Added on admin",
              user: values.id,
              payment_method: 5,
            }
            bc.payments().addAcademyPlanSlugSubscription(planSlug, payload)
            .then((response) => {
              console.log("Subscription created", response.data);
            })
            .catch((error) => {
              console.error("Error creating subscription", error);
            });
          }
          history.push('/admissions/students');
        }
      })
      .catch((error) => console.error(error));
      console.log("*******", availableAsSaas, selectedPlans)
    }
  };
  
  return (
    
    <Formik
    
      initialValues={initialValues}
      onSubmit={(values) => {
        // console.log("values", values)
        postAcademyStudentProfile(values)}
      } 
      enableReinitialize
      validate={(values)=>{
        let errors = {}

        if (cohort.length === 0) {
          errors.cohort = 'You must select at least one cohort'
        }

        return errors
      }}
    >
      
      {({ values, errors, touched, handleChange, handleSubmit }) => (
        <form className="p-4" onSubmit={handleSubmit}>
          {/* {console.log("values", values)} */}
          <ToastContainer/>
          <Grid container spacing={3} alignItems="center">
            <Grid item md={1} sm={4} xs={12}>
              Name
            </Grid>
            <Grid item md={11} sm={8} xs={12}>
              <div className="flex">
                <TextField
                  className="m-2"
                  label="First Name"
                  name="first_name"
                  size="small"
                  required
                  variant="outlined"
                  value={values.first_name}
                  onChange={handleChange}
                />
                <TextField
                  className="m-2"
                  label="Last Name"
                  name="last_name"
                  size="small"
                  required
                  variant="outlined"
                  value={values.last_name}
                  onChange={handleChange}
                />
              </div>
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Phone number
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Phone number"
                name="phone"
                size="small"
                required
                variant="outlined"
                value={values.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Address
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Address"
                name="address"
                size="small"
                type="text"
                variant="outlined"
                value={values.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Email
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <TextField
                label="Email"
                name="email"
                size="small"
                type="email"
                required
                variant="outlined"
                value={values.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Cohort
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <AsyncAutocomplete
                onChange={(newCohort) => {
                  console.log("NEWCOHORT", newCohort);
                  setCohort(newCohort)            
                  const isAvailableAsSaas = newCohort.some(cohort => cohort.available_as_saas);
                  setAvailableAsSaas(isAvailableAsSaas)
                }}
                
                // name="cohort"
                error={errors.cohort && touched.cohort}
                helperText={touched.cohort && errors.cohort}
                width="30%"
                size="small"
                label="Cohort"
                required={cohort.length === 0}
                debounced={false}
                isOptionEqualToValue={(option, value) => option.id === value.id}  
                getOptionLabel={(option) => `${option.name}, (${option.slug})`}
                multiple={true}
                asyncSearch={() => axios.get(`${config.REACT_APP_API_HOST}/v1/admissions/academy/cohort?stage=PREWORK,STARTED,ACTIVE`)}
              />
              <small>Only cohorts with stage PREWORK or STARTED will be shown here</small>

              {console.log("values", values)}
            </Grid>
            {availableAsSaas === true && (
            <>
            <Divider className="mb-2" />
              <Grid item md={12} sm={12} xs={12}>
                <Alert severity='warning'>
                  <AlertTitle> On adding a new cohort</AlertTitle>
                  You are selecting a cohort that is available as saas, in order to add him/her to this cohort, you should select the plan that you want to add him to
                </Alert>
              </Grid>
            <Grid item md={2} sm={4} xs={12}>
              Plan
            </Grid>
            <Grid item md={10} sm={8} xs={12}>
              <AsyncAutocomplete
                onChange={(newPlan) => {
                  console.log("NEWCOHORT", newPlan);
                  setSelectedPlans(newPlan);
                }}
                width="30%"
                size="small"
                label="Select a plan"
                debounced={false}
                isOptionEqualToValue={(option, value) => option.id === value.id}  
                getOptionLabel={(option) => `${option.slug}`}
                multiple={true}
                asyncSearch={() => {
                  const selectedCohortSlug = cohort.length > 0 ? cohort[0].slug : null;
                  console.log("selectedCohortSlug", selectedCohortSlug)  
                  console.log("cohort", cohort)
                  if (selectedCohortSlug) {
                    return axios.get(`${config.REACT_APP_API_HOST}/v1/payments/plan?cohort=${selectedCohortSlug}`)
                      .then((response) => {
                        console.log("Plans:", response.data);
                        return response.data
                      })
                      .catch((error) => {
                        console.error("Error fetching plans:", error);
                        return [];
                      });
                  } else {
                    return [];
                  }
                }}
              />
            </Grid>
            </>
            )}
          </Grid>
          <div className="mt-6">
            <Button color="primary" variant="contained" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

ProfileForm.propTypes = propTypes;
