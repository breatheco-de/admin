import React from "react";
import { Card, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  pricingCard: {
    borderRadius: 20,
    "& h5": {
      letterSpacing: 3,
    },
    "& h1": {
      lineHeight: 1,
    },
  },
}));

const Pricing = () => {
  const classes = useStyles();

  return (
    <div className="m-sm-30 relative">
      <Card className="p-6 mb-11 bg-light-error box-shadow-none">
        <h5 className="mt-0 mb-2 font-medium text-error">
          You are using the free version of the Application
        </h5>
        <p className="m-0 text-muted max-w-770">
          With 10k searchable messages, 10 apps and integrations, 1-to-1 video
          calls and two factor authentication. The free version gives your team
          access to Application's basic features
        </p>
      </Card>

      <div className="w-full text-center mb-11">
        <h3 className="m-0 font-medium">
          Choose the plan that's right for your team
        </h3>
        <p className="m-0 pt-4 text-muted">
          Pay month or year and cancel at any time
        </p>
      </div>

      <div>
        <Grid container spacing={6}>
          {planList.map((item, ind) => (
            <Grid key={item.title} item lg={4} md={4} sm={4} xs={12}>
              <Card
                elevation={6}
                className={clsx(
                  "card text-center p-sm-24",
                  classes.pricingCard
                )}
              >
                <img
                  className="mb-4 h-152 w-152"
                  src={item.logo}
                  alt={item.title}
                />
                <div className="mb-4">
                  <h5 className="m-0 text-primary uppercase font-light">
                    {item.title}
                  </h5>
                  <h1 className="m-0 text-primary uppercase font-medium pt-2 pb-1 text-48">
                    ${item.price}
                  </h1>
                  <small className="text-muted">Monthly</small>
                </div>

                <div className="mb-6 text-muted text-16">
                  <p className="mt-0">Complete CRM service</p>
                  <p>100GB disk space</p>
                  <p className="mb-0">upto 5 users</p>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  className="uppercase"
                >
                  Sign up
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

const planList = [
  {
    title: "Starter",
    price: 75,
    logo: "/assets/images/illustrations/baby.svg",
  },
  {
    title: "Growing",
    price: 195,
    logo: "/assets/images/illustrations/upgrade.svg",
  },
  {
    title: "Enterprise",
    price: 495,
    logo: "/assets/images/illustrations/business_deal.svg",
  },
];
export default Pricing;
