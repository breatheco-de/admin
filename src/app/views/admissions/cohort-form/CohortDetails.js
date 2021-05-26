import React, { useState } from "react";
import { Divider, Card, Grid, TextField, Button, MenuItem, FormControlLabel, Checkbox } from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import { Formik } from "formik";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { AsyncAutocomplete } from "../../../components/Autocomplete";
import bc from "../../../services/breathecode";

makeStyles(({ palette, ...theme }) => ({
    avatar: {
        border: "4px solid rgba(var(--body), 0.03)",
        boxShadow: theme.shadows[3],
    },
}));
const { academy } = JSON.parse(localStorage.getItem("bc-session"));
const CohortDetails = ({ slug, endDate, startDate, language, onSubmit, syllabus, never_ends, isPrivate }) => {
    const [cert, setCert] = useState(syllabus?.certificate);
    const [version, setVersion] = useState(syllabus);
    return (
        <Card className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h4 className="m-0 font-medium">Cohort Details</h4>
            </div>
            <Divider className="mb-6" />
            <Formik
                initialValues={{
                    slug: slug,
                    language: language,
                    ending_date: endDate,
                    kickoff_date: startDate,
                    never_ends: never_ends
                }}
                onSubmit={(values) => onSubmit({ ...values, syllabus: `${cert.slug}.v${version.version}` })}
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
                            {isPrivate ?<Grid item md={12} sm={12} xs={12}>
                                <Alert severity="warning" >
                                    <AlertTitle className="m-auto">This cohort is private</AlertTitle>
                                </Alert>
                            </Grid>: null}
                            <Grid item md={3} sm={4} xs={12}>
                                Cohort Slug
                                </Grid>
                            <Grid item md={9} sm={8} xs={12}>
                                <TextField
                                    className="m-2"
                                    label="Slug"
                                    name="slug"
                                    disabled
                                    size="small"
                                    variant="outlined"
                                    value={values.slug}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item md={3} sm={4} xs={12}>
                                Syllabus
                            </Grid>
                            <Grid item md={7} sm={4} xs={6}>
                                <AsyncAutocomplete
                                    onChange={(certificate) => {
                                        setCert(certificate);
                                        setVersion(null);
                                    }}
                                    width={"100%"}
                                    initialValue={cert}
                                    className="mr-2 ml-2"
                                    asyncSearch={() => bc.admissions().getCertificates()}
                                    size={"small"}
                                    label="Certificate"
                                    required={true}
                                    debounced={false}
                                    getOptionLabel={option => `${option.name}`}
                                    value={cert} />
                            </Grid>
                            <Grid item md={2} sm={4} xs={6}>
                                <AsyncAutocomplete
                                    onChange={(v) => setVersion(v)}
                                    width={"100%"}
                                    key={cert !== null ? cert.slug : ""}
                                    asyncSearch={() => bc.admissions().getAllCourseSyllabus(cert?.slug, academy.id)}
                                    size={"small"}
                                    label="Version"
                                    required={true}
                                    debounced={false}
                                    initialValue={version}
                                    getOptionLabel={option => `${option.version}`}
                                    value={version} />
                            </Grid>
                            <Grid item md={3} sm={4} xs={12}>
                                Language
                                </Grid>
                            <Grid item md={9} sm={8} xs={12}>
                                <TextField
                                    className="m-2"
                                    label="Language"
                                    name="language"
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    value={values.language}
                                    onChange={handleChange}
                                    select
                                >
                                    {['es', 'en'].map((item, ind) => (
                                        <MenuItem value={item} key={item}>
                                            {item.toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item md={3} sm={4} xs={12}>
                                Start date
                                </Grid>
                            <Grid item md={9} sm={8} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="m-2"
                                        margin="none"
                                        label="Date"
                                        inputVariant="outlined"
                                        type="text"
                                        size="small"
                                        autoOk={true}
                                        value={values.kickoff_date}
                                        format="MMMM dd, yyyy"
                                        onChange={(date) => setFieldValue("kickoff_date", date)}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            {!values.never_ends ? <>
                            <Grid item md={3} sm={4} xs={12}>
                                End date
                            </Grid>
                            <Grid item md={9} sm={8} xs={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="m-2"
                                        margin="none"
                                        label="Date"
                                        inputVariant="outlined"
                                        type="text"
                                        size="small"
                                        autoOk={true}
                                        value={values.ending_date}
                                        format="MMMM dd, yyyy"
                                        onChange={(date) => {
                                            console.log(date);
                                            setFieldValue("ending_date", date)
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                                <Grid item md={12} sm={12} xs={12}>
                                    <FormControlLabel
                                        className="flex-grow"
                                        name={"never_ends"}
                                        onChange={handleChange}
                                        control={
                                            <Checkbox checked={values.never_ends} />
                                        }
                                        label="This cohort never ends"
                                    />
                                </Grid></> : <Grid item md={12} sm={12} xs={12}>
                                <FormControlLabel
                                    className="flex-grow"
                                    name={"never_ends"}
                                    onChange={handleChange}
                                    control={
                                        <Checkbox checked={values.never_ends} />
                                    }
                                    label="This cohort never ends"
                                />
                            </Grid>}
                            <Button color="primary" variant="contained" type="submit">
                                Save Cohort Details
                            </Button>
                        </Grid>
                    </form>
                )}
            </Formik>
        </Card>
    );
};


export default CohortDetails;
