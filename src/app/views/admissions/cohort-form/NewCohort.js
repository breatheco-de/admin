import React, { useState,useEffect } from "react";
import { Formik } from "formik";
import {
  Grid,
  Card,
  Divider,
  TextField,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import bc from "app/services/breathecode";
import { AsyncAutocomplete } from "../../../components/Autocomplete";

const NewCohort = () => {
  const [cert, setCert] = useState(null);
  const [version, setVersion] = useState(null);
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
            { name: "Cohort", path: "/admin/cohorts" },
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
          initialValues={initialValues}
          onSubmit={(values) => postCohort(values)}
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
                    required={true}
                    getOptionLabel={option => `${option.name}`}
                    value={cert} />
                    {cert !== null ? <AsyncAutocomplete
                    onChange={(v) => setVersion(v)}
                    width={"20%"}
                    key={cert.slug}
                    asyncSearch={() => bc.admissions().getAllCourseSyllabus(cert.slug)}
                    size={"small"}
                    label="Version"
                    required={true}
                    getOptionLabel={option => `${option.version}`}
                    value={version} /> : ""}
                  </div>
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Kick off date
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    name="kickoff_date"
                    size="small"
                    type="datetime-local"
                    variant="outlined"
                    value={values.kickoff_date}
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
      </Card>
    </div>
  );
};

const initialValues = {
  name: "",
  slug:"",
  kickoff_date:""
};

export default NewCohort;