import React, { Fragment, useState } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  Card,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
  MenuItem,
  Divider,
} from "@material-ui/core";
import { countries } from "./Country";
import PaymentDialog from "./PaymentDialog";
import { useSelector } from "react-redux";

const Checkout = () => {
  const [state, setState] = useState({});
  const [open, setOpen] = useState(false);

  const { cartList = [] } = useSelector((state) => state.ecommerce);

  const getTotalCost = () => {
    let totalCost = 0;
    cartList.forEach((product) => {
      totalCost += product.amount * product.price;
    });
    return totalCost;
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    console.log(state);
    toggleDialog();
  };

  const toggleDialog = () => {
    setOpen(!open);
  };

  let {
    firstName,
    lastName,
    company,
    email,
    mobile,
    country,
    city,
    address,
  } = state;

  return (
    <Card className="checkout m-sm-30 p-sm-24">
      <ValidatorForm onSubmit={handleSubmit} onError={(errors) => null}>
        <h5 className="font-medium mt-0 mb-6">Billing Details</h5>
        <Grid container spacing={3}>
          <Grid item lg={7} md={7} sm={12} xs={12}>
            <Grid container spacing={3} className="mb-2">
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  label="First Name"
                  onChange={handleChange}
                  type="text"
                  name="firstName"
                  value={firstName || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  label="Last Name"
                  onChange={handleChange}
                  type="text"
                  name="lastName"
                  value={lastName || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextValidator
              className="mb-5"
              variant="outlined"
              label="Company"
              onChange={handleChange}
              type="text"
              name="company"
              value={company || ""}
              fullWidth
            />

            <Grid container spacing={3} className="mb-2">
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  label="Email"
                  onChange={handleChange}
                  type="email"
                  name="email"
                  value={email || ""}
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    "this field is required",
                    "email is not valid",
                  ]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  label="Mobile"
                  onChange={handleChange}
                  type="number"
                  name="mobile"
                  value={mobile || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} className="mb-2">
              <Grid item xs={6}>
                <TextValidator
                  label="Country"
                  select
                  name="country"
                  variant="outlined"
                  value={country || ""}
                  onChange={handleChange}
                  fullWidth
                >
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextValidator>
              </Grid>
              <Grid item xs={6}>
                <TextValidator
                  variant="outlined"
                  label="City"
                  onChange={handleChange}
                  type="text"
                  name="city"
                  value={city || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextValidator
              variant="outlined"
              className="mb-5"
              label="Address"
              onChange={handleChange}
              type="text"
              name="address"
              value={address || ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
              fullWidth
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Create an account?"
            />
          </Grid>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <div className="flex justify-between mb-4">
              <h6 className="m-0">Porduct</h6>
              <h6 className="m-0">Total Price</h6>
            </div>
            <div>
              {cartList.map((product, ind) => (
                <Fragment key={product.id}>
                  <div className="flex justify-between py-4">
                    <span className="text-muted pr-8">{product.title}</span>
                    <span className="text-muted">
                      ${product.price * product.amount}
                    </span>
                  </div>
                  {ind !== cartList.length - 1 && <Divider></Divider>}
                </Fragment>
              ))}
              <div className="flex justify-between mb-8 mt-4">
                <h6 className="m-0">Total</h6>
                <h6 className="m-0">${getTotalCost().toFixed(2)}</h6>
              </div>
              <Button
                className="w-full"
                color="primary"
                variant="contained"
                type="submit"
              >
                Place Order
              </Button>
            </div>
          </Grid>
        </Grid>
      </ValidatorForm>

      <PaymentDialog open={open} toggleDialog={toggleDialog} />
    </Card>
  );
};

export default Checkout;
