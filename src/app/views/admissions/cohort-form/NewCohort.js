import React, { useState,useEffect } from "react";
import { Formik } from "formik";
import {
  Grid,
  Card,
  Divider,
  TextField,
  MenuItem,
  Button,
  Checkbox
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumb } from "matx";
import bc from "app/services/breathecode";
import { AsyncAutocomplete } from "../../../components/Autocomplete";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  neverEnd: {
      display: "none",
  },
}));

const NewCohort = () => {
  const classes = useStyles();

  const [newCohort, setNewCohort] = useState({
    name: "",
    slug: "",
    kickoff_date: today,
    ending_date: today,
  })

  const [cert, setCert] = useState(null);
  const [version, setVersion] = useState(null);

  const academy = JSON.parse(localStorage.getItem("bc-academy"));

  const today = new Date()

  const [checked, setChecked] = useState(false)
  const [neverEnd, setNeverEnd] = useState(true);

  const testhandleChange = (event) => {
    setChecked(event.target.checked);
    setNeverEnd(!neverEnd);
    setNewCohort({
      ...newCohort, ending_date: null
    })
  };
  


  const postCohort = (values) => {
    console.log({...values, syllabus: `${cert.slug}.v${version.version}`})
     bc.admissions().addCohort({...values, syllabus: `${cert.slug}.v${version.version}`})
      .then((data) => data)
      .catch(error => console.log(error))
  };
  
  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
      <Breadcrumb
          routeSegments={[
            { name: "Admin", path: "/admin" },
            { name: "Cohort", path: "/admissions/cohorts" },
            { name: "New Cohort" },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Cohort</h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={newCohort}
          onSubmit={(newCohort) => console.log(newCohort)}
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
                  This cohort never ends. 
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                    <Checkbox
                      checked={checked}
                      onChange={testhandleChange}
                      name="ending_date"
                      color="primary"
                    />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Cohort Name
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Cohort Name"
                    name="name"
                    size="small"
                    variant="outlined"
                    value={values.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Cohort Slug
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    
                    label="Cohort Slug"
                    name="slug"
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
                  <div className="flex flex-wrap m--2">
                  <AsyncAutocomplete
                    onChange={(certificate) => setCert(certificate)}
                    width={"30%"}
                    className="mr-2 ml-2"
                    asyncSearch={() => bc.admissions().getCertificates()}
                    size={"small"}
                    label="Certificate"
                    // required={true}
                    getOptionLabel={option => `${option.name}`}
                    value={cert} />
                    {cert !== null ? <AsyncAutocomplete
                    onChange={(v) => setVersion(v)}
                    width={"20%"}
                    key={cert.slug}
                    asyncSearch={() => {
                      console.log(cert.slug);
                      bc.admissions().getAllCourseSyllabus(cert.slug)}}
                    size={"small"}
                    label="Version"
                    // required={true}
                    getOptionLabel={option => `${option.version}`}
                    value={version} /> : ""}
                  </div>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                    Start date
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            className="m-2"
                            margin="none"
                            label="Date"
                            inputVariant="outlined"
                            type="text"
                            size="small"
                            autoOk={true}
                            value={newCohort.kickoff_date}
                            format="MMMM dd, yyyy"
                            onChange={(date) => setNewCohort({
                              ...newCohort, kickoff_date: date
                            })}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={2} sm={4} xs={12} className={neverEnd ? "" : classes.neverEnd}>
                    End date
                </Grid>
                <Grid item md={10} sm={8} xs={12} className={neverEnd ? "" : classes.neverEnd}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          name="ending_date"
                          className="m-2"
                          margin="none"
                          label="End date"
                          inputVariant="outlined"
                          type="text"
                          size="small"
                          autoOk={true}
                          value={newCohort.ending_date}
                          format="MMMM dd, yyyy"
                          onChange={(date) => setNewCohort({
                            ...newCohort, ending_date: date
                          })}
                        />
                    </MuiPickersUtilsProvider>
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
      </Card>
    </div>
  );
};

export default NewCohort;