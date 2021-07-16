import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import bc from '../../../services/breathecode';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const AssignmentGrid = ({ data }) => {
  const [assignmentsDetails, setAssignmentsDetails] = useState([]);
  const { title, task_type, associated_slug } = data;
  const { created_at, difficulty } = assignmentsDetails;

  useEffect(() => {
    bc.registry()
      .getAsset(associated_slug)
      .then(({ data }) => setAssignmentsDetails(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <p>
        Name :
        {title}
      </p>
      <p>
        Type:
        {task_type}
      </p>
      <p>{difficulty}</p>
      <p>
        Late days:
        {dayjs(created_at).fromNow()}
      </p>
    </div>
  );
};

AssignmentGrid.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AssignmentGrid;
