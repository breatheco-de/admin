import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import { useParams } from "react-router-dom";
import axios from "../../../axios";
import {
    Grid,
    Card,
    Divider,
    // TextField,
    // MenuItem,
    Button,
} from "@material-ui/core";
import { Breadcrumb } from "matx";

import StudentAutoComplete from "./certificates-utils/StudentAutoComplete";

import {AutocompleteCohorts} from "../../components/AutocompleteCohorts"
import {AutocompleteUsers} from "../../components/AutocompleteUsers"
import ResponseDialog from "./ResponseDialog"


const NewCertificate = () => {
    const { type } = useParams();
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" })
    // const [academy, setAcademy] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedStudent, setSelectedStudent] = React.useState({});
    const [selectedCohort, setSelectedCohort] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [responseData, setResponseData] = React.useState({});
    const [isLoading, setIsLoading] = useState(false);
    // const [user, setUser] =useState(null)
    const [cohortSlug, setCohortSlug] = useState(null);
    const [certificateForm, setCertificateForm] = useState(false)

    

    const getSpecialties = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/v1/certificate/specialty`)
            .then(({ data }) => setSpecialties(data))
            .catch(error => setMsg({ alert: true, type: "error", text: error.details }))
    };

    useEffect(() => {
        getSpecialties();
    }, [])

    const postCerfiticate = (values) => {
        // One specific certificate
        if (type === "single") {
            axios.post(`${process.env.REACT_APP_API_HOST}/v1/certificate/cohort/${selectedCohort}/student/${selectedStudent}`, values)
            .then((data) => {
                console.log("data", data)
                setMsg({ alert: true, type: "success", text: "Certificate added successfully" })
            })
                .catch(error => console.log("error",error) || setMsg({
                    alert: true,
                    type: "error",
                    text: error.detail || "Unknown error, check cerficate fields"
                }))
        } if (type === "all") {
            //all certificates
            setIsLoading(true)
            axios.post(`${process.env.REACT_APP_API_HOST}/v1/certificate/cohort/${selectedCohort}`, values).
            then((data) => {
                setResponseData(data)
                setIsLoading(false)
                setOpenDialog(true)
            }).catch(error => setMsg({
                alert: true,
                type: "error",
                text: error.detail || error.slug[0] || error.name[0] || error.kickoff_date[0] || "Unknown error, check cerficate fields"
            }))
        }
    };

    return (

        <div className="m-sm-30">
            <ResponseDialog setOpenDialog={setOpenDialog} openDialog={openDialog} responseData={responseData} isLoading={isLoading} />
            <div className="mb-sm-30">
                <Breadcrumb
                    routeSegments={[
                        { name: "Certificates", path: "/certificates" },
                        { name: type === "single" ? "New Certificate" : "All Certificates" },
                    ]}
                />
            </div>

            <Card elevation={3}>
                <div className="flex p-4">
                    <h4 className="m-0">{type === "single"? "Create Student Certificate" : "Create all cohort certificates"}</h4>
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
                                        <div className="flex mb-6">Cohort</div>
                                        
                                    </Grid>
                                    <Grid item md={10} sm={8} xs={12}>
                                        <AutocompleteCohorts setCertificateForm={setCertificateForm} setState={setSelectedCohort} setCohortSlug={setCohortSlug} placeholder="Cohort" size="small" width="100%"/>
                                    </Grid>
                                    {type === "single" && certificateForm ?
                                        <>
                                            <Grid item md={2} sm={4} xs={12}>
                                                Student
                                    </Grid>
                                            <Grid item md={10} sm={8} xs={12}>
                                                <StudentAutoComplete setSelectedStudent={setSelectedStudent} selectedCohort={cohortSlug} size="small" width="100%"></StudentAutoComplete>
                                            </Grid>
                                    {/* <Grid item md={2} sm={4} xs={12}>
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
                                                <MenuItem value={"default"}>{"default"}
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
                                    </Grid> */}
                                    </>:null}
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
    // academy: "",
    specialty: "",
    layout: "",
    signed_by: "",
    signed_by_role: "",
};

export default NewCertificate;