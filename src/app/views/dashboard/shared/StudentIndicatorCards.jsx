import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette }) => ({
  icon: {
    fontSize: '44px',
    opacity: 0.6,
    color: '#fafafa',
  },
}));

const StudentIndicatorCards = ({ metrics }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className="mb-3">
      {metrics.map((v, ind) => (
        <Grid key={ind} item xs={12} md={6} lg={4}>
          <Card
            className="flex flex-wrap justify-between items-center p-sm-24 bg-gray bg-default"
            elevation={6}
          >
            <div className="flex items-center">
              <div className="ml-3">
                <small className="text-light-white">{v.label}</small>
                {v.label === 'Github Username' ? (
                  <a href={`https://github.com/${v.value}`} target="_blank" rel="noreferrer">
                    <h6 className="underline m-0 mt-1 text-white font-medium">{v.value}</h6>
                  </a>
                ) : (
                  <h6 className="m-0 mt-1 text-white font-medium">{v.value}</h6>
                )}
              </div>
            </div>
            {v.icon && <Icon className={classes.icon}>{v.icon}</Icon>}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StudentIndicatorCards;

StudentIndicatorCards.defaultProps = {
  metrics: [],
};
StudentIndicatorCards.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.array),
};
