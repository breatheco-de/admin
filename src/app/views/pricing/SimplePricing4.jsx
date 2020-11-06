import React from "react";
import { Card, Icon, Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useState } from "react";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  icon: {
    fontSize: 84,
  },
  dot: {
    fontSize: 8,
  },
  title: {
    opacity: 0.74,
  },
  borderWhite: {
    borderColor: "white",
  },
}));

const SimplePricing4 = () => {
  const [plan, setPlan] = useState("monthly");
  const classes = useStyles();

  return (
    <div className="mb-14 max-w-850 mx-auto">
      <h1 className="mt-0 mb-12 text-36 text-center">Simple Pricing</h1>
      <div className="flex rounded max-w-280 mx-auto mb-12 elevation-z1">
        <Button
          className={clsx({
            "border-radius-0 card flex-grow": true,
            "bg-white": plan !== "monthly",
          })}
          variant={plan === "monthly" ? "contained" : "text"}
          color={plan === "monthly" ? "primary" : "default"}
          onClick={() => setPlan("monthly")}
        >
          Monthly Fees
        </Button>
        <Button
          className={clsx({
            "border-radius-0 card flex-grow": true,
            "bg-white": plan !== "annual",
          })}
          variant={plan === "annual" ? "contained" : "text"}
          color={plan === "annual" ? "primary" : "default"}
          onClick={() => setPlan("annual")}
        >
          Annual Fees
        </Button>
      </div>

      <Card elevation={3} className="p-6 h-full mb-4">
        <h4 className="mt-0 mb-8 text-muted capitalize">
          {plan} Product Pricing
        </h4>
        <p className="">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          tempus vestibulum vestibulum. Nunc nec feugiat ligula. In porta
          feugiat purus et ornare.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          tempus vestibulum vestibulum. Nunc nec feugiat ligula. In porta
          feugiat purus et ornare.Integer tempor, sapien scelerisque commodo
          molestie, ante lacus dapibus ligula
        </p>
      </Card>
      <Grid container spacing={3}>
        <Grid item lg={4} xs={12}>
          <Card
            elevation={3}
            className="px-6 py-14 mb-4 flex-column items-center h-full"
          >
            <Icon className="text-72 mb-14 text-primary">person</Icon>
            <h4 className="text-22 font-normal mb-5">Student</h4>
            <div className="flex items-end mb-14">
              <div className="flex">
                <b className="mr-1 mt-6px">$</b>
                <h1 className={clsx("text-48 m-0", classes.title)}>
                  {plan === "monthly" ? 75 : 75 * 11}
                </h1>
              </div>
              <b className="text-muted text-16 ml-1 mb-1 capitalize">
                /{plan === "monthly" ? "month" : "year"}
              </b>
            </div>
            <Button
              className="px-7 rounded text-18 hover-bg-primary card"
              variant="outlined"
              color="primary"
            >
              Purchase
            </Button>
          </Card>
        </Grid>

        <Grid item lg={4} xs={12}>
          <Card
            elevation={3}
            className={clsx({
              "px-6 py-14 mb-4 flex-column items-center bg-primary text-white h-full": true,
              "bg-secondary": plan !== "monthly",
            })}
          >
            <Icon className="text-72 mb-14">people</Icon>
            <h4 className="text-22 font-normal mb-5">10 Users</h4>
            <div className="flex items-end mb-14">
              <div className="flex">
                <b className="mr-1 mt-6px">$</b>
                <h1 className="text-48 m-0">
                  {plan === "monthly" ? 775 : 775 * 11}
                </h1>
              </div>
              <b className="text-16 ml-1 mb-1 capitalize">
                /{plan === "monthly" ? "month" : "year"}
              </b>
            </div>
            <Button
              className={clsx(
                "px-7 rounded text-18 text-white card",
                classes.borderWhite
              )}
              variant="outlined"
            >
              Purchase
            </Button>
          </Card>
        </Grid>

        <Grid item lg={4} xs={12}>
          <Card
            elevation={3}
            className={clsx({
              "px-6 py-14 flex-column items-center bg-green text-white h-full": true,
              "bg-secondary": plan !== "monthly",
            })}
          >
            <Icon className="text-72 mb-14">apartment</Icon>
            <h4 className="text-22 font-normal mb-5">Enterprise</h4>
            <div className="flex items-end mb-14">
              <div className="flex">
                <b className="mr-1 mt-6px">$</b>
                <h1 className="text-48 m-0">
                  {plan === "monthly" ? 775 : 775 * 11}
                </h1>
              </div>
              <b className="text-16 ml-1 mb-1 capitalize">
                /{plan === "monthly" ? "month" : "year"}
              </b>
            </div>
            <Button
              className={clsx(
                "px-7 rounded text-18 hover-bg-green text-white card",
                classes.borderWhite
              )}
              variant="outlined"
            >
              Purchase
            </Button>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SimplePricing4;
