/* eslint-disable react/prop-types */
import React from 'react';
import { Grid, LinearProgress, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

// eslint-disable-next-line no-unused-vars
const CustomLinearProgress = withStyles((theme) => ({
  root: {
    borderRadius: 2,
    background: 'rgba(0, 0, 0, 0.1)',
  },
}))(LinearProgress);

const MatxProgressBar = ({
  value = 75,
  color = 'primary',
  text = '',
  spacing = 2,
  coloredText = false,
  className,
}) => (
  <Grid container spacing={spacing} alignItems="center" className={className}>
    <Grid item xs={text ? 8 : 12}>
      <CustomLinearProgress
        color={color}
        value={value}
        variant="determinate"
      />
    </Grid>
    {text !== '' && (
    <Grid item xs={text ? 4 : false}>
      <Typography color={color}>
        <small className={`${coloredText ? '' : 'text-muted'}`}>
          {text}
        </small>
      </Typography>
    </Grid>
    )}
  </Grid>
);

export default MatxProgressBar;
