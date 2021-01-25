import React,{useState} from "react";
import { Formik } from "formik";
import {
    Grid,
    TextField,
    Button,
    Checkbox,
    FormControlLabel
} from "@material-ui/core";
import BC from "../../../../services/breathecode";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import {AutocompleteCohorts} from "../../../../components/AutocompleteCohorts";


export const ProfileForm = ({initialValues}) => {
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" });
    const [cohortId, setCohortId] = useState(null);

    const postAcademyStudentProfile = (values) => {
        const requestValues = cohortId !== "" ? { ...values, cohort: cohortId, invite: true } : { ...values, invite: true }
        const academy_id = localStorage.getItem("academy_id");
        axios.post(`${process.env.REACT_APP_API_HOST}/v1/auth/academy/${academy_id}/student`, requestValues)
            .then(data => setMsg({ alert: true, type: "success", text: data.status_code === 201 ?"Student created successfuly" : data.statusText}))
            .catch(error => {
                console.log(error)
                let resKeys = Object.keys({...values, cohort: cohortId});
                resKeys.forEach(item => {
                    if(Array.isArray(error[item])) setMsg({ alert: true, type: "error", text: error[item][0]});
                    else if(error.detail) setMsg({ alert: true, type: "error", text: error.detail ? error.detail: "Unknown error, check fields"})
                })
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
                        <AutocompleteCohorts setState={setCohortId} placeholder="Cohort" size="small" width="30%"/>
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


