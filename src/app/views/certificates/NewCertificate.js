import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import axios from "../../../axios";
import {
    Grid,
    Card,
    Divider,
    TextField,
    MenuItem,
    Button,
} from "@material-ui/core";
import { Breadcrumb } from "matx";

import StudentAutoComplete from "./certificates-utils/StudentAutoComplete";
import CohortAutoComplete from "./certificates-utils/CohortAutoComplete";


const NewCertificate = () => {
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" })
    const [academy, setAcademy] = useState([]);
    const [specialties, setSpecialties] = useState([]);

    const searchTerm = "santiago-part-time-10";

    const getAcademy = (searchTerm) => {
        axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${searchTerm}`)
            .then(({ data }) => setAcademy(data.academy.name))
            .catch(error => setMsg({ alert: true, type: "error", text: error.details }))
    };
    console.log("academy:", academy)
    useEffect(() => {
        const getSpecialties = () => {
            axios.get(`${process.env.REACT_APP_API_HOST}/v1/certificate/specialty`)
                .then(({ data }) => setSpecialties(data))
                .catch(error => setMsg({ alert: true, type: "error", text: error.details }))
        };

        getAcademy(searchTerm);
        getSpecialties();
    }, [])

    const postCerfiticate = (values) => {
        console.log("New Certificate", values)
    }


    return (
        <div className="m-sm-30">
            <div className="mb-sm-30">
                <Breadcrumb
                    routeSegments={[
                        { name: "Certificates", path: "/certificates" },
                        { name: "New Certificate" },
                    ]}
                />
            </div>

            <Card elevation={3}>
                <div className="flex p-4">
                    <h4 className="m-0">Add a New Certificate</h4>
                </div>
                <Divider className="mb-2" />

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => postCerfiticate(values)}
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
                                        Cohort
                                    </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <CohortAutoComplete />
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        Student
                                    </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <StudentAutoComplete />
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        Academy
                                    </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <div className="flex flex-wrap m--2">
                                            <TextField
                                                className="m-2 min-w-188"
                                                label="Academy"
                                                name="academy"
                                                size="small"
                                                variant="outlined"
                                                select
                                                value={values.academy || ""}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={academy}>{academy}
                                                </MenuItem>
                                            </TextField>
                                        </div>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        Specialty
                                    </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <div className="flex flex-wrap m--2">
                                            <TextField
                                                className="m-2 min-w-188"
                                                label="Specialty"
                                                name="specialty"
                                                size="small"
                                                variant="outlined"
                                                select
                                                value={values.specialty || ""}
                                                onChange={handleChange}
                                            >
                                                {specialties.map((item, ind) => (
                                                    <MenuItem value={item.name} key={item.name}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    </Grid>

                                    <Grid item md={2} sm={4} xs={12}>
                                        Layout
                                    </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <div className="flex flex-wrap m--2">
                                            <TextField
                                                className="m-2 min-w-188"
                                                label="Layout"
                                                name="layout"
                                                size="small"
                                                variant="outlined"
                                                select
                                                value={values.layout || ""}
                                                onChange={handleChange}
                                            >
                                                <MenuItem >
                                                    {"default"}
                                                </MenuItem>
                                            </TextField>
                                        </div>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        Signed by
                </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <TextField
                                            label=""
                                            name="signed_by"
                                            size="small"
                                            variant="outlined"
                                            value={values.signed_by}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        Signed by Role
                                    </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <TextField
                                            label=""
                                            name="signed_by_role"
                                            size="small"
                                            variant="outlined"
                                            value={values.signed_by_role}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <div className="mt-6">
                                    <Button color="primary" variant="contained" type="submit">
                                        Create
                </Button>
                                </div>
                            </form>
                        )}
                </Formik>
                {msg.alert ? <Snackbar open={msg.alert} autoHideDuration={15000} onClose={() => setMsg({ alert: false, text: "", type: "" })}>
                    <Alert onClose={() => setMsg({ alert: false, text: "", type: "" })} severity={msg.type}>
                        {msg.text}
                    </Alert>
                </Snackbar> : ""}
            </Card>
        </div>
    );
};

const initialValues = {
    cohort: "",
    student: "",
    academy: "",
    specialty: "",
    layout: "default",
    signed_by: "",
    signed_by_role: "",
};

export default NewCertificate;