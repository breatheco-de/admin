import React from "react";
import { TextField, Grid, MenuItem } from "@material-ui/core";
import { Facebook, Twitter } from "@material-ui/icons";

const OtherDetailsForm = ({ values, handleChange }) => {
  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item md={2} sm={4} xs={12}>
        Currency
      </Grid>
      <Grid item md={10} sm={8} xs={12}>
        <TextField
          className="min-w-208"
          label="Currency"
          name="currency"
          size="small"
          variant="outlined"
          select
          value={values.currency || ""}
          onChange={handleChange}
        >
          {currencyList.map((item, ind) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item md={2} sm={4} xs={12}>
        Payment Terms
      </Grid>
      <Grid item md={10} sm={8} xs={12}>
        <TextField
          className="min-w-208"
          label="Terms"
          name="paymentTerm"
          size="small"
          variant="outlined"
          select
          value={values.paymentTerm || ""}
          onChange={handleChange}
        >
          {paymentTermList.map((item, ind) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item md={2} sm={4} xs={12}>
        Facebook
      </Grid>
      <Grid item md={10} sm={8} xs={12}>
        <TextField
          label="Facebook"
          name="facebook"
          size="small"
          variant="outlined"
          value={values.facebook}
          onChange={handleChange}
          InputProps={{
            style: {
              paddingLeft: 8,
            },
            startAdornment: (
              <Facebook className="mr-6px" color="primary" fontSize="small" />
            ),
          }}
        />
      </Grid>
      <Grid item md={2} sm={4} xs={12}>
        Twitter
      </Grid>
      <Grid item md={10} sm={8} xs={12}>
        <TextField
          label="Twitter"
          name="twitter"
          size="small"
          variant="outlined"
          value={values.twitter}
          onChange={handleChange}
          InputProps={{
            style: {
              paddingLeft: 8,
            },
            startAdornment: (
              <Twitter className="mr-6px" color="primary" fontSize="small" />
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};

const paymentTermList = [
  "NET 15",
  "NET 30",
  "NET 45",
  "NET 60",
  "Due end of the month",
  "Due on receive",
];
const currencyList = ["USD", "AUD", "EUR", "CNY", "GBP", "INR", "JPY"];

export default OtherDetailsForm;
