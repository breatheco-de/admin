import React, { useState } from "react";
import { Formik, yupToFormErrors } from "formik";
import {
    Grid,
    TextField,
    Button
} from "@material-ui/core";

import axios from "../../../../../axios";
import { AsyncAutocomplete } from "../../../../components/Autocomplete";
import { useHistory } from "react-router-dom";
import bc from "app/services/breathecode";

export const ProfileForm = ({ initialValues }) => {
    const [cohort, setCohort] = useState(null);
    const history = useHistory();

    const postAcademyStudentProfile = (values) => {
        console.log(cohort)
        const requestValues = cohort !== null ? { ...values, cohort: cohort.id, invite: true } : { ...values, invite: true };
            bc.auth().addAcademyStudent(requestValues)
            .then(data =>{
                if(data !== undefined){
                   history.push("/admissions/students"); 
                }
            })
            .catch(error =>console.log(error))
    }

    return <Formik
        initialValues={initialValues}
        onSubmit={(values) => postAcademyStudentProfile(values)}
        enableReinitialize={true}
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
            <form className="p-4" onSubmit={handleSubmit}>
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
                            onChange={(cohort) => setCohort(cohort)}
                            width={"30%"}
                            size="small"
                            label="Cohort"
                            getOptionLabel={option => `${option.name}, (${option.slug})`}
                            asyncSearch={() => axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/academy/cohort`)}
                        />
                    </Grid>
                </Grid>
                <div className="mt-6">
                    <Button color="primary" variant="contained" type="submit">
                        Submit
                    </Button>
                </div>
            </form>
        )}
    </Formik>
}


