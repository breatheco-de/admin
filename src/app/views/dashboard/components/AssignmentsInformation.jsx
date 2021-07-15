import React from 'react';
import PropTypes from 'prop-types';
import AssignmentGrid from './AssignmentGrid';

const AssignmentsInformation = ({ data }) => {
  const deliveredAssignments = data.filter((assignment) => assignment.task_status === 'DONE');
  const undeliveredAssignments = data.filter((assignment) => assignment.task_status === 'PENDING');
  return (
    <div>
      <h1>Assignments Information</h1>
      <h5>
        Projects Delivered:
        {deliveredAssignments.length}
      </h5>
      <h5>Missing for delivery Assignments</h5>
      {undeliveredAssignments.map((assignment) => (
        <AssignmentGrid key={assignment.id} data={assignment} />
      ))}
    </div>
  );
};

AssignmentsInformation.propTypes = {
  data: PropTypes.array.isRequired,
};

export default AssignmentsInformation;
