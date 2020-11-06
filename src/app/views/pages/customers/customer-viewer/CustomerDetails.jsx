import React from "react";
import { Grid, Fade } from "@material-ui/core";
import CustomerBillings from "./CustomerBillings";
import CustomerEmailSender from "./CustomerEmailSender";
import CustomerInfo from "./CustomerInfo";
import CustomerActions from "./CustomerActions";

const CustomerDetails = () => {
  return (
    <Fade in timeout={300}>
      <Grid container spacing={3}>
        <Grid item lg={4} md={6} xs={12}>
          <CustomerInfo />
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <CustomerBillings />
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <CustomerEmailSender />
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <CustomerActions />
        </Grid>
      </Grid>
    </Fade>
  );
};

export default CustomerDetails;
