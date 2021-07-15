import React from 'react';
import PropTypes from 'prop-types';

const AssignmentGrid = ({ data }) => {
  const { title, task_type, associated_slug } = data;
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
    </div>
  );
};

AssignmentGrid.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AssignmentGrid;
