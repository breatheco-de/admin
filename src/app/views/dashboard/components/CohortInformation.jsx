import React from 'react';

import PropTypes from 'prop-types';

const CohortInformation = ({ data }) => {
  const {
    name, kickoff_date, ending_date, stage,
  } = data;
  return (
    <div>
      <h1>Cohort Info</h1>
      <p>{name}</p>
      <p>{kickoff_date}</p>
      <p>{ending_date}</p>
      <p>{stage}</p>
    </div>
  );
};

CohortInformation.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CohortInformation;
