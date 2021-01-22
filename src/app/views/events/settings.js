import React from "react";
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

const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: "4px solid rgba(var(--body), 0.03)",
    boxShadow: theme.shadows[3],
  },
}));

const EventSettings = () => {
  const classes = useStyles();

  return (
    <Card className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h4 className="m-0 font-medium">Cohort Details</h4>
      </div>

      <Divider className="mb-6" />

        <Formik
          initialValues={initialValues}
        //   onSubmit={handleSubmit}
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
                  Cohort Slug
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Slug"
                    name="cohortSlug"
                    size="small"
                    variant="outlined"
                    defaultValue="santiago-xv"
                    value={""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  Invoice#
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <TextField
                    label="Invoice No"
                    name="invoiceNo"
                    size="small"
                    variant="outlined"
                    defaultValue="INV-000001"
                    value={values.invoiceNo}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item md={2} sm={4} xs={12}>
                  StartDate
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className="m-2"
                        margin="none"
                        label="Invoice Date"
                        inputVariant="outlined"
                        type="text"
                        size="small"
                        autoOk={true}
                        value={values.invoiceDate}
                        format="MMMM dd, yyyy"
                        onChange={(date) => setFieldValue("invoiceDate", date)}
                      />
                    </MuiPickersUtilsProvider>
                    
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Eng Date
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className="m-2"
                        margin="none"
                        label="Invoice Date"
                        inputVariant="outlined"
                        type="text"
                        size="small"
                        autoOk={true}
                        value={values.invoiceDate}
                        format="MMMM dd, yyyy"
                        onChange={(date) => setFieldValue("invoiceDate", date)}
                      />
                    </MuiPickersUtilsProvider>
                    
                </Grid>
                <Grid item md={2} sm={4} xs={12}>
                  Language
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                    <TextField
                      className="m-2 min-w-188"
                      label="Terms"
                      name="terms"
                      size="small"
                      variant="outlined"
                      value={values.terms || ""}
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
                <Button className="w-100" color="primary" variant="contained" type="submit">
                  Save Cohort Details
                </Button>
            </Grid>
          </form>
        )}
        </Formik>
    </Card>
  );
};

const initialValues = {
  slug: "",
  name: "Miami Dade XV",
};

export default EventSettings;
