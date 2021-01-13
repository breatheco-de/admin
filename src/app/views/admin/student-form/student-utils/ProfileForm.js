import React from "react";
import { Formik } from "formik";
import {
    Grid,
    TextField,
    Button
} from "@material-ui/core";
import axios from "../../../../../axios";

export const ProfileForm = ({user_id}) => {
    const postAcademyStudentProfile  = (values) => {
       const academy_id = localStorage.getItem("academy_id");
       axios.post(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/${academy_id}/student/${user_id}`,{...values})
       .then(data => console.log(data))
       .catch(error => console.log(error))
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
                    <Grid item md={2} sm={4} xs={12}>
                        Name
                </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                        <div className="flex flex-wrap m--2">
                            <TextField
                                className="m-2 min-w-188"
                                label="First Name"
                                name="first_name"
                                size="small"
                                variant="outlined"
                                value={values.firstName}
                                onChange={handleChange}
                            />
                            <TextField
                                className="m-2"
                                label="Last Name"
                                name="lastName"
                                size="small"
                                variant="outlined"
                                value={values.lastName}
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
                            variant="outlined"
                            value={values.phoneNumner}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item md={2} sm={4} xs={12}>
                        Customer Email
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                        <TextField
                            label="Address"
                            name="address"
                            size="small"
                            type="text"
                            variant="outlined"
                            value={values.email}
                            onChange={handleChange}
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

const initialValues = {
    customerType: "",
};

