import React, { useState } from "react";
import { Divider, Card, Grid, TextField, Button, MenuItem } from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import axios from "../../../../axios";
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles(({ palette, ...theme }) => ({
    avatar: {
        border: "4px solid rgba(var(--body), 0.03)",
        boxShadow: theme.shadows[3],
    },
}));

const CohortDetails = ({ slug, endDate, startDate, lang, id }) => {
    const classes = useStyles();
    const [msg, setMsg] = useState({ alert: false, type: "", text: "" })
    const onSubmit = (values) => {
        axios.put(`${process.env.REACT_APP_API_HOST}/v1/admissions/cohort/${id}`, values)
            .then((data) => console.log(data))
            .catch(error => setMsg({ alert: true, type: "error", text: error }))
    }
    return (
        <Card className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h4 className="m-0 font-medium">Cohort Details</h4>
            </div>
            <Divider className="mb-6" />
            <Formik
                initialValues={{
                    slug: slug,
                    lang: lang,
                    ending_date: endDate,
                    kickoff_date: startDate
                }}
                onSubmit={(values) => onSubmit(values)}
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
                                        size="small"
                                        variant="outlined"
                                        value={values.slug}
                                        onChange={handleChange}
                                    />
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
                                            onChange={(date) => setFieldValue("ending_date", date)}
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
                                        name="lang"
                                        size="small"
                                        variant="outlined"
                                        value={values.lang}
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
                                {msg.alert ? <Grid item md={12} sm={8} xs={12}>
                                        <Alert severity={msg.type} onClose={() => setMsg({ alert: false, type: "", text: "" })}>
                                            <AlertTitle>{msg.type.toUpperCase()}</AlertTitle>
                                            {"This is an error                             "}
                                        </Alert>
                                </Grid> : ""}
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
