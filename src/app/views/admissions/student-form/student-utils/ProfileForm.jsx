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
import useAuth from '../../../../hooks/useAuth';

const propTypes = {
  initialValues: PropTypes.objectOf(PropTypes.object).isRequired,
};

const defaultPlan = { id: "default", name: "Do not assign plan yet" };

export const ProfileForm = ({ initialValues }) => {
  const [cohort, setCohort] = useState([]);
  const history = useHistory();
  const [availableAsSaas, setAvailableAsSaas] = useState(false)
  const [selectedPlans, setSelectedPlans] = useState(defaultPlan)
  const [paymentMethods, setPaymentMethods] = useState(null)

  const { user } = useAuth();

  const postAcademyStudentProfile = (values) => {
    if (typeof (values.invite) === 'undefined' || !values.invite) values.user = values.id;
    let cohortId = cohort.map(c => {
      return c.id
    });
    let planId = selectedPlans ? selectedPlans.id : undefined;
    let paymentMethodsId = paymentMethods ? paymentMethods.id : undefined;

    let requestValues = {
      ...values,
      cohort: cohort.length > 0 ? cohortId : undefined,
      plan: planId,
      payment_method: paymentMethodsId
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
    else if (values.phone.length > 15 || values.phone.length < 10) {
      console.error("The number entered has formatting errors (insert more than 10 and less than 15)")
      toast.error("The number entered has formatting errors (insert more than 10 and less than 15)")
    }
    else {
      let payload = {
        address: requestValues.address,
        cohort: cohortId,
        email: requestValues.email,
        first_name: requestValues.first_name,
        last_name: requestValues.last_name,
        phone: requestValues.phone,
        invite: requestValues.invite,
      };

      if (!availableAsSaas) {
        bc.auth()
          .addAcademyStudent(payload)
          .then((data) => {
            if (data !== undefined && data.ok) {
              history.push('/admissions/students');
            }
          })
          .catch((error) => console.error(error));
      } else {
        // Remove address from payload when adding a student to a saas cohort because the invite doesn't need it.
        delete payload["address"];
        delete payload["invite"];

        // Add needed fields for saas students to the payload.
        payload["academy"] = user.academy.id;
        payload["plan"] = planId;
        payload["cohort"] = cohortId[0]

        console.log(payload)

        bc.auth()
          .addSaasStudent(payload)
          .then((data) => {
            console.log("Data", data)
            if (!data || !data.ok) return;

            const userId = data?.data?.user;
            if (availableAsSaas && selectedPlans?.slug && selectedPlans?.slug !== defaultPlan?.name) {
              const planSlug = selectedPlans?.slug;

              const payloadPlanSubscription = {
                provided_payment_details: requestValues.payment_details,
                reference: requestValues.payment_reference,
                user: userId,
                payment_method: requestValues.payment_method,
              };
              bc.payments().addAcademyPlanSlugSubscription(planSlug, payloadPlanSubscription)
                .then((response) => {
                  console.log("Subscription created", response.data);
                  cohortId.forEach((_cohortId) => {
                    let cohortUserPayload = {
                      user: userId,
                      cohort: _cohortId,
                    }

                    bc.admissions().addUserCohort(_cohortId, cohortUserPayload)
                      .then((response) => {
                        console.log("Student added to cohort", response.data);
                      })
                      .catch((error) => {
                        toast.error(`Error adding student to cohort: ${error.detail || error.data.details || error.message}`)
                        console.error("Error adding student to cohort", error);
                      });
                  })
                })
                .catch((error) => {
                  toast.error(`Error creating subscription: ${error.detail || error.data.details || error.message}`)
                  console.error("Error creating subscription", error);
                });
            }
            history.push('/admissions/students');
          }
          )
          .catch((error) => console.error(error));
      }
    }
  };

  return (

    <Formik

      initialValues={initialValues}
      onSubmit={(values) => {
        if (availableAsSaas && !selectedPlans || selectedPlans?.length === 0){
          toast.error("You must select at leats one plan before submitting")
          return;
        }
        if (availableAsSaas && selectedPlans && selectedPlans.length > 1){
          toast.error("You can only select one plan")
          return;
        }
        postAcademyStudentProfile(values)}
      } 
      enableReinitialize
      validate={(values) => {
        let errors = {}
        if (cohort.length === 0) {
          errors.cohort = 'You must select at least one cohort'
        }
        return errors
      }}
    >

      {({ values, errors, touched, handleChange, handleSubmit }) => (
        <form className="p-4" onSubmit={handleSubmit}>
          <ToastContainer />
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
            </Grid>
            {availableAsSaas === true && (
              <>
                <Divider className="mb-2" />
                <Grid item md={12} sm={12} xs={12}>
                  <Alert severity='warning'>
                    <AlertTitle> On adding a new cohort</AlertTitle>
                    You are selecting a cohort that is available as saas, in order to add him/her to this cohort, you should select the plan that you want to add him/her to
                  </Alert>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Plan
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <AsyncAutocomplete
                    value={selectedPlans}
                    onChange={(newPlan) => {
                      setSelectedPlans(newPlan);
                    }}
                    width="30%"
                    size="small"
                    label="Select a plan"
                    debounced={false}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.id === "default" ? option.name : option.slug}
                    multiple={false}
                    asyncSearch={() => {
                      const selectedCohortSlug = cohort.length > 0 ? cohort[0].slug : null;
                      if (selectedCohortSlug) {
                        return bc.payments().getPlan({ cohort: selectedCohortSlug })
                          .then((response) => {
                            return [
                              defaultPlan,
                              ...response.data
                            ];
                          })
                          .catch((error) => {
                            console.error("Error fetching plans:", error);
                            return [defaultPlan];
                          });
                      } else {
                        return [];
                      }
                    }}
                  />
                </Grid>
                {selectedPlans && selectedPlans.id !== "default" && (
                  <>
                    <Grid item md={2} sm={4} xs={12}>
                      Payments
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <AsyncAutocomplete
                        onChange={(paymentMethod) => {
                          setPaymentMethods(paymentMethod);
                        }}
                        width="30%"
                        size="small"
                        label="Select a payment"
                        debounced={false}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => `${option.title}`}
                        multiple={false}
                        required
                        variant="outlined"
                        asyncSearch={() => {
                          return bc.payments().getPaymentsMethods({ academy_id: user.academy.id })
                            .then((response) => {
                              const uniqueMethods = Array.from(
                                new Map(response.data.map(method => [method.title, method])).values()
                              );
                              return uniqueMethods;
                            })
                            .catch((error) => {
                              console.error("Error fetching payments methods:", error);
                              return [];
                            });
                        }}
                      />
                    </Grid>
                    <Grid item md={2} sm={4} xs={12}>
                      Payment Details
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <TextField
                        label="Payment Details"
                        name="payment_details"
                        size="small"
                        type="text"
                        required
                        variant="outlined"
                        value={values.paymentDetails}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item md={2} sm={4} xs={12}>
                      Reference
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                      <TextField
                        label="Reference"
                        name="payment_reference"
                        size="small"
                        type="text"
                        required
                        variant="outlined"
                        value={values.reference}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                )}
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
