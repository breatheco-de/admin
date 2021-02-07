import React, { useState,useEffect } from "react";
import { Formik } from "formik";
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import axios from "../../../../axios";
import {
  Grid,
  Card,
  Divider,
  TextField,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Breadcrumb } from "matx";

const NewCohort = () => {
  const [cert, setCert] = useState([]);
  const [msg, setMsg] = useState({ alert: false, type: "", text: "" });

  const postCohort = (values) => {
     axios.post(`${process.env.REACT_APP_API_HOST}/v1/admissions/academy/cohort`,values)
      .then((data) => setMsg({ alert: true, type: "success", text: "Cohort added successfully" }))
      .catch(error => {
        console.log(error)
        setMsg({ 
        alert: true, 
        type: "error", 
        text: error.detail || "Unknown error, check cohort fields"
       })})
  };


  const getCertificates = () => {
    axios.get(`${process.env.REACT_APP_API_HOST}/v1/admissions/certificate`)
    .then(({data}) => setCert(data))
    .catch(error => setMsg({ alert: true, type: "error", text: error.details })) 
  }
  useEffect(() =>{
    getCertificates();
  }, [])

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
                  Certificate
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <div className="flex flex-wrap m--2">
                    <TextField
                      className="m-2 min-w-188"
                      label="Certificate"
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
  slug:"",
  certificate:"",
  kickoff_date:""
};

export default NewCohort;