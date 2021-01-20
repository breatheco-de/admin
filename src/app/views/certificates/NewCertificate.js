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
    const [cert, setCert] = useState([]);
    const [showForm, setShowForm] = useState({
        show: false,
        data: {
            student: "",
            academy: "",
            specialty: "",
            cohort: "",
            signed_by: "",
        }
    });

    const postCerfiticate = () => {
        console.log("New Certificate")
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
                                                name="certificate"
                                                size="small"
                                                variant="outlined"
                                                select
                                                value={values.certificate || ""}
                                                onChange={handleChange}
                                            >
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
                                                name="certificate"
                                                size="small"
                                                variant="outlined"
                                                select
                                                value={values.certificate || ""}
                                                onChange={handleChange}
                                            >
                                                {cert.map((item, ind) => (
                                                    <MenuItem value={item.id} key={item.name}>
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
                                                name="certificate"
                                                size="small"
                                                variant="outlined"
                                                select
                                                value={values.certificate || ""}
                                                onChange={handleChange}
                                            >

                                            </TextField>
                                        </div>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        Signed by
                </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <TextField
                                            label=""
                                            name="name"
                                            size="small"
                                            variant="outlined"
                                            value={values.name}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        Signed by Role
                                    </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <TextField
                                            label=""
                                            name="name"
                                            size="small"
                                            variant="outlined"
                                            value={values.name}
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
    name: "",
    slug: "",
    certificate: "",
    kickoff_date: ""
};

export default NewCertificate;