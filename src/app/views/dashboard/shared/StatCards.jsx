import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Card, Icon, IconButton, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette }) => ({
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
      {metrics.map((metric) => (
        <Grid item xs={12} md={6}>
          <Card
            className="flex flex-wrap justify-between items-center p-sm-24 bg-paper"
            elevation={6}
          >
            <div className="flex items-center">
              <Icon className={classes.icon}>{metric.icon}</Icon>
              <div className="ml-3">
                <small className="text-muted">{metric.label}</small>
                <h6 className="m-0 mt-1 text-primary font-medium">{metric.value}</h6>
              </div>
            </div>
            {/* <Tooltip title="View Details" placement="top">
              <IconButton>
                <Icon>arrow_right_alt</Icon>
              </IconButton>
            </Tooltip> */}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;

StatCards.defaultProps = {
  metrics: [],
};
StatCards.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.array),
};
