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

const InvoiceCustomer = () => {
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
                <Grid item md={4} sm={4} xs={12}>
                  Cohort Slug
                </Grid>
                <Grid item md={8} sm={8} xs={12}>
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
                        value={values.invoiceDate}
                        format="MMMM dd, yyyy"
                        onChange={(date) => setFieldValue("invoiceDate", date)}
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
                        value={values.invoiceDate}
                        format="MMMM dd, yyyy"
                        onChange={(date) => setFieldValue("invoiceDate", date)}
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
                <Button  color="primary" variant="contained" type="submit">
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

export default InvoiceCustomer;
