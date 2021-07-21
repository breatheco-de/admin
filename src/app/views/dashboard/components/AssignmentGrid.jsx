import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import bc from '../../../services/breathecode';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

const AssignmentGrid = ({ data }, classes) => {
  const [assignmentsDetails, setAssignmentsDetails] = useState([]);
  const { title, task_type, associated_slug } = data;
  const { created_at, difficulty } = assignmentsDetails;

  console.log(assignmentsDetails);

  useEffect(() => {
    bc.registry()
      .getAsset(associated_slug)
      .then(({ data }) => setAssignmentsDetails(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {task_type}
        </Typography>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {difficulty}
        </Typography>
        <Typography component="p">{dayjs(created_at).fromNow()}</Typography>
      </CardContent>
    </Card>
  );
};

AssignmentGrid.propTypes = {
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AssignmentGrid);
