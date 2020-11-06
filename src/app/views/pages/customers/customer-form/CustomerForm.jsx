import React, { useState } from "react";
import { Formik } from "formik";
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
import OtherDetailsForm from "./OtherDetailsForm";
import AddressForm from "./AddressForm";
import ContactPersonForm from "./ContactPersonForm";
import { Breadcrumb } from "matx";

const CustomerForm = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleSubmit = async (values, { isSubmitting }) => {
    console.log(values);
  };

  const handleTabChange = (e, value) => {
    setTabIndex(value);
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Pages", path: "/pages" },
            { name: "New Customer" },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add a New Customer</h4>
        </div>
        <Divider className="mb-2" />

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
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
                  Customer Type
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="customerType"
                      value={values.customerType}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        className="h-20 mr-6"
                        label="Business"
                        value="business"
                        control={<Radio size="small" color="secondary" />}
                      />
                      <FormControlLabel
                        className="h-20"
                        label="Individual"
                        value="individual"
                        control={<Radio size="small" color="secondary" />}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Primary Contact
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <div className="flex flex-wrap m--2">
                    <TextField
                      className="m-2 min-w-188"
                      label="Salutation"
                      name="salutation"
                      size="small"
                      variant="outlined"
                      select
                      value={values.salutation || ""}
                      onChange={handleChange}
                    >
                      {salutationList.map((item, ind) => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      className="m-2"
                      label="First Name"
                      name="firstName"
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
                  Primary Contact
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Company Name"
                    name="companyName"
                    size="small"
                    variant="outlined"
                    value={values.companyName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Customer Display Name
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Display Name"
                    name="displayName"
                    size="small"
                    variant="outlined"
                    value={values.displayName}
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

                <Grid item md={2} sm={4} xs={12}>
                  Customer Phone
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <div className="flex flex-wrap m--2">
                    <TextField
                      className="m-2"
                      label="Work Phone"
                      name="workPhone"
                      size="small"
                      variant="outlined"
                      value={values.workPhone}
                      onChange={handleChange}
                    />
                    <TextField
                      className="m-2"
                      label="Mobile"
                      name="mobile"
                      size="small"
                      variant="outlined"
                      value={values.mobile}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Website
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Website"
                    name="website"
                    size="small"
                    type="email"
                    variant="outlined"
                    value={values.website}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Tabs
                className="mt-4 mb-6"
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                {tabList.map((item, ind) => (
                  <Tab
                    className="capitalize"
                    value={ind}
                    label={item}
                    key={ind}
                  />
                ))}
              </Tabs>
              {tabIndex === 0 && (
                <OtherDetailsForm values={values} handleChange={handleChange} />
              )}
              {tabIndex === 1 && (
                <AddressForm
                  values={values}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                />
              )}
              {tabIndex === 2 && (
                <ContactPersonForm
                  values={values}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                />
              )}

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

const salutationList = ["Mr.", "Mrs.", "Ms.", "Miss.", "Dr."];
const tabList = ["Other Details", "Address", "Contact Persons"];

const initialValues = {
  customerType: "",
};

export default CustomerForm;
