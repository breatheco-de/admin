import React,{useState} from "react";
import { Formik } from "formik";
import {
    Grid,
    TextField,
    Button,
    Checkbox,
    FormControlLabel
} from "@material-ui/core";
import axios from "../../../../../axios";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';


export const ProfileForm = ({initialValues}) => {
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" })

    const postAcademyStudentProfile = (values) => {
        console.log(values)
        const academy_id = localStorage.getItem("academy_id");
        axios.post(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/${academy_id}/student`, { ...values })
            .then(data => setMsg({ alert: true, type: "success", text: data.statusText}))
            .catch(error => {
                console.log(error)
                setMsg({ alert: true, type: "error", text: error.detail || `${error.first_name[0]}: First Name` || error.email[0] || error.phone[0]})
            })
    }

    return <Formik
        initialValues={initialValues}
        onSubmit={(values) =>postAcademyStudentProfile(values)}
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
                {msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
                    <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
                        {msg.text}
                    </Alert>
                </Snackbar> : ""}
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
                                variant="outlined"
                                value={values.first_name}
                                onChange={handleChange}
                            />
                            <TextField
                                className="m-2"
                                label="Last Name"
                                name="last_name"
                                size="small"
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
                            variant="outlined"
                            value={values.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item md={10} sm={8} xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="invite"
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label="Invite student to Breathecode"
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


