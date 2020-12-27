
import React, { useState } from "react";
import { Formik } from "formik";
import { Alert } from '@material-ui/lab';
import axios from "../../../../axios";
import Snackbar from '@material-ui/core/Snackbar';
import {
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  Divider,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Button,
} from "@material-ui/core";
import { Breadcrumb } from "matx";

const CustomerForm = () => {

  const postStudent = async (values) => {
    
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Admin", path: "/admin" },
            { name: "Students", path: "/admin/students" },
            { name: "New Student" },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Student</h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={initialValues}
          onSubmit={(values) => postStudent}
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
                  Name
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <div className="flex flex-wrap m--2">
                    <TextField
                      className="m-2 min-w-188"
                      label="First Name"
                      name="first_name"
                      size="small"
                      variant="outlined"
                      value={values.firstName}
                      onChange={handleChange}
                    />
                    <TextField
                      className="m-2"
                      label="Last Name"
                      name="lastName"
                      size="small"
                      variant="outlined"
                      value={values.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Github URL
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    name="github"
                    size="small"
                    variant="outlined"
                    value={values.github}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Phone number
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Phone number"
                    name="phone"
                    size="small"
                    variant="outlined"
                    value={values.phoneNumner}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Customer Email
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Customer Email"
                    name="email"
                    size="small"
                    type="email"
                    variant="outlined"
                    value={values.email}
                    onChange={handleChange}
                  />
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
      </Card>
    </div>
  );
};

const initialValues = {
  customerType: "",
};

export default CustomerForm;