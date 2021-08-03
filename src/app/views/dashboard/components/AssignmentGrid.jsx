import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  ListItem, Divider, ListItemText, ListItemAvatar, Avatar,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import bc from '../../../services/breathecode';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const AssignmentGrid = ({ data, classes, isLastItem }) => {
  const [assignmentsDetails, setAssignmentsDetails] = useState([]);
  const { title, task_type, associated_slug } = data;
  console.log('data for projects', data);
  const { created_at, difficulty } = assignmentsDetails;

  useEffect(() => {
    bc.registry()
      .getAsset(associated_slug)
      .then(({ data }) => setAssignmentsDetails(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar variant="square" className={classes.square} alt={associated_slug} src="#" />
        </ListItemAvatar>
        <ListItemText
          primary={task_type}
          secondary={(
            <>
              <Typography variant="h5" component="h2">
                {title}
              </Typography>
              <Typography color="textSecondary">{difficulty}</Typography>
              <Typography component="p">{dayjs(created_at).fromNow()}</Typography>
            </>
          )}
        />
      </ListItem>
      {!isLastItem && <Divider component="li" />}
    </>
  );
};

AssignmentGrid.propTypes = {
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default AssignmentGrid;
