import React from "react";
import { Card, Icon, Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

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
}));

const Pricing2 = () => {
  const classes = useStyles();

  return (
    <div className="m-sm-30 relative">
      <Card elevation={3} className="px-6 mb-4">
        <Grid container spacing={3}>
          <Grid item lg={4} xs={12}>
            <div className="py-12 flex-column justify-centers items-center">
              <Icon className="text-72 mb-8" color="primary">
                sports_football
              </Icon>
              <h4 className={clsx("text-20 mb-6", classes.title)}>Startup </h4>
              <div className="flex flex-wrap justify-center items-center">
                <span className="m-2 text-muted">1 Domain</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">5 Users</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">10 Copies</span>
              </div>
              <p className="text-center text-muted mt-2 mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className="flex my-10">
                <h1 className={clsx("text-48 m-0", classes.title)}>75</h1>
                <b className="text-muted ml-1 mt-6px">$</b>
              </div>
              <Button
                className="px-7 rounded elevation-z12 text-18 font-weight-medium"
                variant="contained"
                color="primary"
              >
                Purchase
              </Button>
            </div>
          </Grid>
          <Grid item lg={4} xs={12}>
            <div className="py-12 flex-column justify-centers items-center">
              <Icon className="text-72 mb-8" color="primary">
                trending_up
              </Icon>
              <h4 className={clsx("text-20 mb-6", classes.title)}>
                Growth Plan
              </h4>
              <div className="flex flex-wrap justify-center items-center">
                <span className="m-2 text-muted">8 Domain</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">15 Users</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">100 Copies</span>
              </div>
              <p className="text-center text-muted mt-2 mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className="flex my-10">
                <h1 className={clsx("text-48 m-0", classes.title)}>175</h1>
                <b className="text-muted ml-1 mt-6px">$</b>
              </div>
              <Button
                className="px-7 rounded elevation-z12 text-18 font-weight-medium"
                variant="contained"
                color="primary"
              >
                Purchase
              </Button>
            </div>
          </Grid>
          <Grid item lg={4} xs={12}>
            <div className="py-12 flex-column justify-centers items-center">
              <Icon className="text-72 mb-8" color="primary">
                apartment
              </Icon>
              <h4 className={clsx("text-20 mb-6", classes.title)}>
                Enterprise
              </h4>
              <div className="flex flex-wrap justify-center items-center">
                <span className="m-2 text-muted">10 Domain</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">25 Users</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">1000 Copies</span>
              </div>
              <p className="text-center text-muted mt-2 mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className="flex my-10">
                <h1 className={clsx("text-48 m-0", classes.title)}>875</h1>
                <b className="text-muted ml-1 mt-6px">$</b>
              </div>
              <Button
                className="px-7 rounded elevation-z12 text-18 font-weight-medium"
                variant="contained"
                color="primary"
              >
                Purchase
              </Button>
            </div>
          </Grid>
        </Grid>
      </Card>

      <Card elevation={3} className="px-6">
        <Grid container spacing={3}>
          <Grid item xl={3} md={6} xs={12}>
            <div className="py-12 flex-column justify-centers items-center">
              <Icon className="text-72 mb-8" color="error">
                person
              </Icon>
              <h4 className={clsx("text-20 mb-6", classes.title)}>Student</h4>
              <div className="flex flex-wrap justify-center items-center">
                <span className="m-2 text-muted">1 Domain</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">5 Users</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">10 Copies</span>
              </div>
              <p className="text-center text-muted mt-2 mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className="flex my-10">
                <h1 className={clsx("text-48 m-0", classes.title)}>20</h1>
                <b className="text-error ml-1 mt-6px">$</b>
              </div>
              <Button
                className="px-7 rounded elevation-z12 text-18 font-weight-medium bg-error text-white"
                variant="contained"
                color="primary"
              >
                Purchase
              </Button>
            </div>
          </Grid>

          <Grid item xl={3} md={6} xs={12}>
            <div className="py-12 flex-column justify-centers items-center">
              <Icon className="text-72 mb-8 text-green">flight</Icon>
              <h4 className={clsx("text-20 mb-6", classes.title)}>
                Basic Plan
              </h4>
              <div className="flex flex-wrap justify-center items-center">
                <span className="m-2 text-muted">8 Domain</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">15 Users</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">100 Copies</span>
              </div>
              <p className="text-center text-muted mt-2 mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className="flex my-10">
                <h1 className={clsx("text-48 m-0", classes.title)}>75</h1>
                <b className="text-primary ml-1 mt-6px">$</b>
              </div>
              <Button
                className="px-7 rounded elevation-z12 text-18 font-weight-medium bg-green text-white"
                variant="contained"
              >
                Purchase
              </Button>
            </div>
          </Grid>

          <Grid item xl={3} md={6} xs={12}>
            <div className="py-12 flex-column justify-centers items-center">
              <Icon className="text-72 mb-8 text-secondary">business</Icon>
              <h4 className={clsx("text-20 mb-6", classes.title)}>
                For Business
              </h4>
              <div className="flex flex-wrap justify-center items-center">
                <span className="m-2 text-muted">18 Domain</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">35 Users</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">10000 Copies</span>
              </div>
              <p className="text-center text-muted mt-2 mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className="flex my-10">
                <h1 className={clsx("text-48 m-0", classes.title)}>375</h1>
                <b className="ml-1 mt-6px">$</b>
              </div>
              <Button
                className="px-7 rounded elevation-z12 text-18 font-weight-medium bg-secondary text-white"
                variant="contained"
              >
                Purchase
              </Button>
            </div>
          </Grid>

          <Grid item xl={3} md={6} xs={12}>
            <div className="py-12 flex-column justify-centers items-center">
              <Icon className="text-72 mb-8 text-primary">meeting_room</Icon>
              <h4 className={clsx("text-20 mb-6", classes.title)}>
                Enterprise
              </h4>
              <div className="flex flex-wrap justify-center items-center">
                <span className="m-2 text-muted">18 Domain</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">35 Users</span>
                <span className="p-2px bg-gray rounded"></span>
                <span className="m-2 text-muted">10000 Copies</span>
              </div>
              <p className="text-center text-muted mt-2 mb-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className="flex my-10">
                <h1 className={clsx("text-48 m-0", classes.title)}>375</h1>
                <b className="ml-1 mt-6px">$</b>
              </div>
              <Button
                className="px-7 rounded elevation-z12 text-18 font-weight-medium bg-primary text-white"
                variant="contained"
              >
                Purchase
              </Button>
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default Pricing2;
