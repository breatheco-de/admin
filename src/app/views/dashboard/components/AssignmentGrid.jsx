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
  const {
    title, task_type, associated_slug, intro_video_url,
  } = data;
  const { created_at, difficulty, url } = assignmentsDetails;

  useEffect(() => {
    bc.registry()
      .getAsset(associated_slug)
      .then(({ data }) => {
        setAssignmentsDetails(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <ListItem alignItems="flex-start">
        <a href={url} target="_blank" rel="noreferrer">
          <ListItemText
            secondary={(
              <>
                <Typography variant="h6" component="h2">
                  {title && title[0].toUpperCase() + title.slice(1)}
                </Typography>
                <Typography color="textSecondary">
                  <b>Dificulty: </b>
                  {difficulty ? difficulty.toLowerCase() : 'N/A'}
                </Typography>
                <Typography component="p">
                  <b>Created Date: </b>
                  {dayjs(created_at).fromNow()}
                </Typography>
              </>
            )}
          />
        </a>
      </ListItem>
      {!isLastItem && <Divider component="div" />}
    </>
  );
};

AssignmentGrid.propTypes = {
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default AssignmentGrid;
