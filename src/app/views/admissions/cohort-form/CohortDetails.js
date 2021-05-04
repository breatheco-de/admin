import React, {useState} from "react";
import { Divider, Card, Grid, TextField, Button, MenuItem } from "@material-ui/core";
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

const CohortDetails = ({ slug, endDate, startDate, language, onSubmit, syllabus }) => {
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
                    kickoff_date: startDate
                }}
                onSubmit={(values) => onSubmit({...values, syllabus: `${cert.slug}.v${version.version}`})}
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
                            <Grid item md={4} sm={4} xs={12}>
                                Cohort Slug
                                </Grid>
                            <Grid item md={8} sm={8} xs={12}>
                                <TextField
                                    label="Slug"
                                    name="slug"
                                    disabled
                                    size="small"
                                    variant="outlined"
                                    value={values.slug}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item md={2} sm={4} xs={12}>
                                Syllabus
                                </Grid>
                            <Grid item md={10} sm={8} xs={12}>
                                <div className="mr-4 flex flex-wrap">
                                    <AsyncAutocomplete
                                        onChange={(certificate) => {
                                            setCert(certificate);
                                            setVersion(null);
                                        }}
                                        width={"70%"}
                                        initialValue={cert}
                                        className="mr-2 ml-2"
                                        asyncSearch={() => bc.admissions().getCertificates()}
                                        size={"small"}
                                        label="Certificate"
                                        required={true}
                                        getOptionLabel={option => `${option.name}`}
                                        value={cert} />
                                    <AsyncAutocomplete
                                        onChange={(v) => setVersion(v)}
                                        width={"20%"}
                                        key={cert !== null ? cert.slug: ""}
                                        asyncSearch={() =>  bc.admissions().getAllCourseSyllabus(cert?.slug)}
                                        size={"small"}
                                        label="Version"
                                        required={true}
                                        getOptionLabel={option => `${option.version}`}
                                        value={version} />
                                </div>
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
                            <Grid item md={3} sm={4} xs={12}>
                                End date
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
                                        value={values.ending_date}
                                        format="MMMM dd, yyyy"
                                        onChange={(date) => {
                                            console.log(date);
                                            setFieldValue("ending_date", date)}}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item md={3} sm={4} xs={12}>
                                Language
                                </Grid>
                            <Grid item md={9} sm={8} xs={12}>
                                <TextField
                                    className="m-2 min-w-188"
                                    label="Language"
                                    name="language"
                                    size="small"
                                    variant="outlined"
                                    value={values.language}
                                    onChange={handleChange}
                                    select
                                >
                                    {['es', 'en'].map((item, ind) => (
                                        <MenuItem value={item} key={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </Grid>
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
