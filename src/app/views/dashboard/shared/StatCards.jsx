/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Grid, Card, Icon, IconButton, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  icon: {
    fontSize: '44px',
    opacity: 0.6,
    color: palette.primary.main,
  },
}));

const StatCards = ({ metrics }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className="mb-3">
      <Grid item xs={12} md={6}>
        <Card
          className="flex flex-wrap justify-between items-center p-sm-24 bg-paper"
          elevation={6}
        >
          <div className="flex items-center">
            <Icon className={classes.icon}>{metrics[0].icon}</Icon>
            <div className="ml-3">
              <small className="text-muted">{metrics[0].label}</small>
              <h6 className="m-0 mt-1 text-primary font-medium">
                {metrics[0].value}
              </h6>
            </div>
          </div>
          <Tooltip title="View Details" placement="top">
            <IconButton>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card
          className="flex flex-wrap justify-between align-center p-sm-24 bg-paper"
          elevation={6}
        >
          <div className="flex items-center">
            <Icon className={classes.icon}>{metrics[1].icon}</Icon>
            <div className="ml-3">
              <small className="text-muted line-height-1">
                {metrics[1].label}
              </small>
              <h6 className="m-0 mt-1 text-primary font-medium">
                {metrics[1].value}
              </h6>
            </div>
          </div>
          <Tooltip title="View Details" placement="top">
            <IconButton>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card
          className="flex flex-wrap justify-between items-center p-sm-24 bg-paper"
          elevation={6}
        >
          <div className="flex items-center">
            <Icon className={classes.icon}>{metrics[2].icon}</Icon>
            <div className="ml-3">
              <small className="text-muted">{metrics[2].value}</small>
              <h6 className="m-0 mt-1 text-primary font-medium">
                {metrics[2].label}
              </h6>
            </div>
          </div>
          <Tooltip title="View Details" placement="top">
            <IconButton>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card
          className="flex flex-wrap justify-between items-center p-sm-24 bg-paper"
          elevation={6}
        >
          <div className="flex items-center">
            <Icon className={classes.icon}>{metrics[3].icon}</Icon>
            <div className="ml-3">
              <small className="text-muted">{metrics[3].value}</small>
              <h6 className="m-0 mt-1 text-primary font-medium">
                {metrics[3].label}
              </h6>
            </div>
          </div>
          <Tooltip title="View Details" placement="top">
            <IconButton>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatCards;
