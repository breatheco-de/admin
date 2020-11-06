import React, { useState } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Dialog, Grid, Button } from "@material-ui/core";

const PaymentDialog = ({ open, toggleDialog }) => {
  const [state, setState] = useState({});

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {};

  let { cardHolderName, cardNumber, expiryDate, cvc } = state;

  return (
    <Dialog open={open} onClose={toggleDialog} scroll="body">
      <div className="p-sm-24 text-center relative">
        <img
          className="h-160 mb-4"
          src="/assets/images/debit-card.png"
          alt="debit-card"
        />
        <ValidatorForm onSubmit={handleSubmit}>
          <TextValidator
            className="mb-4"
            variant="outlined"
            label="Card Number"
            onChange={handleChange}
            type="number"
            name="cardNumber"
            value={cardNumber || ""}
            validators={[
              "required",
              "minStringLength:16",
              "maxStringLength: 16",
            ]}
            errorMessages={[
              "this field is required",
              "invalid card",
              "invalid card",
            ]}
            fullWidth
          />

          <Grid container spacing={3} className="mb-8">
            <Grid item xs={6}>
              <TextValidator
                variant="outlined"
                label="Expiry Date"
                onChange={handleChange}
                type="text"
                placeholder="12/19"
                name="expiryDate"
                value={expiryDate || ""}
                validators={[
                  "required",
                  "minStringLength: 5",
                  "maxStringLength: 5",
                ]}
                errorMessages={[
                  "this field is required",
                  "invalid expiry date",
                  "invalid expiry date",
                ]}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextValidator
                variant="outlined"
                label="CVC"
                onChange={handleChange}
                type="text"
                name="cvc"
                value={cvc || ""}
                validators={["required"]}
                errorMessages={["this field is required"]}
                fullWidth
              />
            </Grid>
          </Grid>

          <TextValidator
            className="mb-6"
            variant="outlined"
            label="Full Name"
            onChange={handleChange}
            type="text"
            name="cardHolderName"
            value={cardHolderName || ""}
            errorMessages={["this field is required"]}
            fullWidth
          />
          <div className="flex justify-end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={toggleDialog}
              className="mr-3"
              type="button"
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Pay
            </Button>
          </div>
        </ValidatorForm>
      </div>
    </Dialog>
  );
};

export default PaymentDialog;
